# Text-to-Speech Audio Generator

A Node.js CLI tool that generates speech audio from text using OpenAI's GPT-4o-mini-TTS model via the Vercel AI SDK.

## Features

- Generate MP3 audio files from text input
- Support for multiple languages and narration styles
- Command-line interface for easy usage
- Configurable output file names
- Uses OpenAI's high-quality TTS model

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key (set as environment variable)

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies

## Setup

Set your OpenAI API key as a global environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

## Usage

### Basic Usage

```bash
npm start -- -t "Hello world"
```

### With Options

```bash
npm start -- -t "¡Hola mundo!" -l Spanish -s surfer -o hello.mp3
```

### Available Options

- `-t, --text <text>`: Required. The text to convert to speech
- `-l, --language <language>`: Language for narration (default: Spanish)
- `-s, --style <style>`: Narration style (default: surfer)
  - Available styles: surfer, formal, casual
- `-o, --output <file>`: Output file name (default: output.mp3)

### Examples

```bash
# Generate Spanish surfer-style audio
npm start -- -t "¡Gracias, mí, dude! Ahora soy un robot con voz."

# Generate English formal audio
npm start -- -t "Thank you. I am now a robot with a voice." -l English -s formal

# Custom output file
npm start -- -t "Hola" -o greeting.mp3
```

## Supported Languages

The tool supports any language supported by OpenAI's TTS model. Common languages include:
- Spanish
- English
- French
- German
- Italian
- Portuguese
- And many more

## Supported Styles

- `surfer`: Relaxed and enthusiastic, like a surfer
- `formal`: Formal and professional
- `casual`: Casual and friendly

You can also specify custom styles, which will be passed directly to the TTS model.

## Error Handling

The tool includes comprehensive error handling for:
- Missing API key
- Invalid inputs
- Network errors
- API errors

## Dependencies

- `ai`: Vercel AI SDK
- `@ai-sdk/openai`: OpenAI integration for AI SDK
- `commander`: Command-line interface library

## License

ISC
