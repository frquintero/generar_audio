#!/usr/bin/env node

import { experimental_generateSpeech as speech } from 'ai';
import { openai } from '@ai-sdk/openai';
import { writeFile } from 'fs/promises';
import { Command } from 'commander';

const program = new Command();

program
  .name('generar-audio')
  .description('Generate speech audio from text using OpenAI TTS')
  .version('1.0.0')
  .requiredOption('-t, --text <text>', 'Text to convert to speech')
  .option('-l, --language <language>', 'Language for narration', 'Spanish')
  .option('-s, --style <style>', 'Narration style', 'surfer')
  .option('-o, --output <file>', 'Output file name', 'output.mp3')
  .action(async (options) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      const instructions = generateInstructions(options.language, options.style);

      console.log('Generating audio...');
      const { audio } = await speech({
        model: openai.speech('gpt-4o-mini-tts'),
        text: options.text,
        instructions: instructions
      });

      await writeFile(options.output, audio.uint8Array);
      console.log(`Audio file generated successfully: ${options.output}`);
    } catch (error) {
      console.error('Error generating audio:', error.message);
      process.exit(1);
    }
  });

function generateInstructions(language, style) {
  const styleInstructions = {
    surfer: 'relajado y entusiasta, como un surfero',
    formal: 'formal y profesional',
    casual: 'casual y amigable'
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

program.parse();
