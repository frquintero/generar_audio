#!/usr/bin/env node

import 'dotenv/config';
import { experimental_generateSpeech as speech } from 'ai';
import { openai } from '@ai-sdk/openai';
import { writeFile, readFile } from 'fs/promises';
import { Command } from 'commander';
import inquirer from 'inquirer';

const program = new Command();

const validVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse'];

program
  .name('generar-audio')
  .description('Generate speech audio from text using OpenAI TTS')
  .version('1.0.0')
  .option('-t, --text <text>', 'Text to convert to speech')
  .option('-f, --file <file>', 'TXT file to read text and metadata from')
  .option('-l, --language <language>', 'Language for narration')
  .option('-s, --style <style>', 'Narration style')
  .option('-v, --voice <voice>', 'Voice for narration', 'alloy')
  .option('-o, --output <file>', 'Output file name')
  .option('--interactive', 'Run in interactive mode')
  .action(async (options) => {
    try {
      if (options.interactive) {
        await runInteractive();
        return;
      }

      await generateAudio(options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

async function generateAudio(options) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  let { text, language, style, voice, output } = options;
  if (options.file) {
    const content = await readFile(options.file, 'utf-8');
    const parsed = parseTxtFile(content);
    text = text || parsed.text;
    language = language || parsed.language;
    style = style || parsed.style;
    voice = voice || parsed.voice;
    output = output || parsed.output;
  }
  if (!text) {
    throw new Error('Text must be provided either via -t option or -f file');
  }
  language = language || 'Spanish';
  style = style || 'normal';
  voice = voice || 'alloy';
  output = output || 'output.mp3';

  if (!validVoices.includes(voice)) {
    throw new Error(`Invalid voice '${voice}'. Valid voices: ${validVoices.join(', ')}`);
  }

  const instructions = generateInstructions(language, style);

  console.log('Generating audio...');
  const { audio } = await speech({
    model: openai.speech('gpt-4o-mini-tts'),
    text: text,
    voice: voice,
    instructions: instructions
  });

  await writeFile(output, audio.uint8Array);
  console.log(`Audio file generated successfully: ${output}`);
}

async function runInteractive() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputType',
      message: 'How would you like to provide the text?',
      choices: [
        { name: 'Enter text directly', value: 'text' },
        { name: 'Use a TXT file from the current directory', value: 'file' }
      ]
    }
  ]);

  let text, file;
  if (answers.inputType === 'text') {
    const textAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'text',
        message: 'Enter the text to convert to speech:'
      }
    ]);
    text = textAnswer.text;
  } else {
    // List TXT files in current directory
    const fs = await import('fs');
    const files = fs.readdirSync('.').filter(f => f.endsWith('.txt'));
    if (files.length === 0) {
      throw new Error('No TXT files found in the current directory');
    }
    const fileAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'file',
        message: 'Select a TXT file:',
        choices: files
      }
    ]);
    file = fileAnswer.file;
  }

  const configAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'language',
      message: 'Language for narration:',
      default: 'Spanish'
    },
    {
      type: 'input',
      name: 'style',
      message: 'Narration style:',
      default: 'normal'
    },
    {
      type: 'list',
      name: 'voice',
      message: 'Select a voice:',
      choices: validVoices.map(v => ({ name: v, value: v })),
      default: 'alloy'
    },
    {
      type: 'input',
      name: 'output',
      message: 'Output file name:',
      default: 'output.mp3'
    }
  ]);

  const options = {
    text,
    file,
    language: configAnswers.language,
    style: configAnswers.style,
    voice: configAnswers.voice,
    output: configAnswers.output
  };

  await generateAudio(options);
}

program
  .command('generate-template')
  .description('Generate a template TXT file for audio generation')
  .action(async () => {
    const template = `Language: Spanish
Style: normal
Voice: alloy
Output: output.mp3

Your text here.`;
    await writeFile('template.txt', template);
    console.log('Template generated: template.txt');
  });

function generateInstructions(language, style) {
  const styleInstructions = {
    surfer: 'relajado y entusiasta, como un surfero',
    formal: 'formal y profesional',
    casual: 'casual y amigable',
    normal: 'normal y natural'
  };

  const styleText = styleInstructions[style] || styleInstructions.surfer;

  if (language.toLowerCase() === 'spanish') {
    return `Habla en español pero como si fueras ${styleText}.`;
  } else if (language.toLowerCase() === 'english') {
    return `Speak in English but as if you were ${styleText}.`;
  } else {
    return `Speak in ${language} but as if you were ${styleText}.`;
  }
}

function parseTxtFile(content) {
  const lines = content.split('\n');
  const metadata = {};
  let textStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' && i < lines.length - 1) {
      textStart = i + 1;
      break;
    }
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      metadata[key] = value;
    }
  }

  const text = lines.slice(textStart).join('\n').trim();
  return {
    text,
    language: metadata.language || 'Spanish',
    style: metadata.style || 'normal',
    voice: metadata.voice || 'alloy',
    output: metadata.output || 'output.mp3'
  };
}

program.parse();
