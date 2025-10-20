#!/usr/bin/env node

import { experimental_generateSpeech as speech } from 'ai';
import { openai } from '@ai-sdk/openai';
import { writeFile, readFile } from 'fs/promises';
import { Command } from 'commander';

const program = new Command();

program
  .name('generar-audio')
  .description('Generate speech audio from text using OpenAI TTS')
  .version('1.0.0')
  .option('-t, --text <text>', 'Text to convert to speech')
  .option('-f, --file <file>', 'TXT file to read text and metadata from')
  .option('-l, --language <language>', 'Language for narration')
  .option('-s, --style <style>', 'Narration style')
  .option('-o, --output <file>', 'Output file name')
  .action(async (options) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      let { text, language, style, output } = options;
      if (options.file) {
        const content = await readFile(options.file, 'utf-8');
        const parsed = parseTxtFile(content);
        text = text || parsed.text;
        language = language || parsed.language;
        style = style || parsed.style;
        output = output || parsed.output;
      }
      if (!text) {
        throw new Error('Text must be provided either via -t option or -f file');
      }
      language = language || 'Spanish';
      style = style || 'normal';
      output = output || 'output.mp3';

      const instructions = generateInstructions(language, style);

      console.log('Generating audio...');
      const { audio } = await speech({
        model: openai.speech('gpt-4o-mini-tts'),
        text: text,
        instructions: instructions
      });

      await writeFile(output, audio.uint8Array);
      console.log(`Audio file generated successfully: ${output}`);
    } catch (error) {
      console.error('Error generating audio:', error.message);
      process.exit(1);
    }
  });

program
  .command('generate-template')
  .description('Generate a template TXT file for audio generation')
  .action(async () => {
    const template = `Language: Spanish
Style: surfer
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
    if (line === '') {
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
    style: metadata.style || 'surfer',
    output: metadata.output || 'output.mp3'
  };
}

program.parse();
