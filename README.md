# Text-to-Speech Audio Generator

A Node.js CLI tool that generates speech audio from text using OpenAI's GPT-4o-mini-TTS model via the Vercel AI SDK.

## Features

- Generate MP3 audio files from text input or TXT files
- Support for multiple languages, narration styles, and voices
- Command-line interface for easy usage
- Interactive mode with guided prompts
- Configurable output file names via CLI or TXT metadata
- TXT file template generation for easy setup
- Uses OpenAI's high-quality TTS model

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key (set as environment variable)

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies

## Setup

Create a `.env` file in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

Alternatively, set it as a global environment variable:

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

### TXT File Input

Generate a template TXT file first:

```bash
npm start -- generate-template
```

Then edit the generated `template.txt` with your text and metadata. Generate audio from TXT file:

```bash
npm start -- -f template.txt
```

### Interactive Mode

Run the tool in interactive mode for guided setup:

```bash
npm start -- --interactive
```

This will prompt you step-by-step to select options.

### Available Options

- `-t, --text <text>`: The text to convert to speech (required if -f not provided)
- `-f, --file <file>`: TXT file to read text and metadata from (alternative to -t)
- `-l, --language <language>`: Language for narration (default: Spanish)
- `-s, --style <style>`: Narration style (default: normal)
  - Available styles: surfer, formal, casual, normal
- `-v, --voice <voice>`: Voice for narration (default: alloy)
  - Available voices: alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse
- `-o, --output <file>`: Output file name (default: output.mp3)
- `--interactive`: Run in interactive mode

### Examples

```bash
# Generate Spanish surfer-style audio
npm start -- -t "¡Gracias, mí, dude! Ahora soy un robot con voz."

# Generate English formal audio
npm start -- -t "Thank you. I am now a robot with a voice." -l English -s formal

# Custom output file
npm start -- -t "Hola" -o greeting.mp3

# Generate from TXT file
npm start -- -f mytext.txt

# Override TXT metadata with CLI options
npm start -- -f mytext.txt -l English -o custom.mp3

# Use specific voice
npm start -- -t "Hello world" -v nova

# Run interactive mode
npm start -- --interactive
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

## TXT File Format

TXT files can contain metadata in the first lines followed by the text content. Metadata lines are in the format `Key: Value`. The text starts after a blank line.

Example:

```
Language: English
Style: normal
Voice: nova
Output: myaudio.mp3

This is the text to convert to speech. It can span multiple lines.
```

Supported metadata keys:
- `Language`: Narration language (default: Spanish)
- `Style`: Narration style (default: normal)
- `Voice`: Voice for narration (default: alloy)
- `Output`: Output file name (default: output.mp3)

If metadata is missing or incomplete, defaults are used. CLI options override TXT metadata.

## Supported Styles

- `surfer`: Relaxed and enthusiastic, like a surfer
- `formal`: Formal and professional
- `casual`: Casual and friendly
- `normal`: Normal and natural

You can also specify custom styles, which will be passed directly to the TTS model.

## Supported Voices

The following voices are available:
- `alloy`: Neutral, balanced voice
- `ash`: Male, calm and professional
- `ballad`: Male, narrative and expressive
- `coral`: Female, friendly and approachable
- `echo`: Male, deep and resonant
- `fable`: Child-like, youthful and storytelling-focused
- `onyx`: Male, strong and authoritative
- `nova`: Young female, energetic and clear
- `sage`: Female, wise and mature
- `shimmer`: Female, warm and melodic
- `verse`: Female, poetic and artistic

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
- `dotenv`: Environment variable loader
- `inquirer`: Interactive CLI prompts

## License

ISC
