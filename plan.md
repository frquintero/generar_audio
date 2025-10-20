# Project Plan: Text-to-Speech Audio Generator

## Project Overview

This project involves creating a Node.js script that utilizes the Vercel AI SDK to generate speech audio from text using OpenAI's GPT-4o-mini-TTS model. The script produces an MP3 file with narration in a user-specified language and style determined at runtime. The goal is to deliver a flexible, cost-effective text-to-speech tool with clear configuration, error handling, and user-friendly output.

Key features:
- Uses experimental_generateSpeech API from Vercel AI SDK
- OpenAI GPT-4o-mini-TTS model for high-quality audio
- Runtime-configurable language and narration style
- Outputs to MP3 file format
- OpenAI API key retrieved from global environment variables

## Phases and Tasks

### Phase 1: Project Setup
- Install required dependencies (Vercel AI SDK, OpenAI SDK)
- Set up project directory structure
- Ensure OPENAI_API_KEY is set in global environment variables
- Initialize package.json with necessary scripts

### Phase 2: Core Implementation
- Implement the audio generation function using experimental_generateSpeech
- Configure the OpenAI speech model with appropriate parameters
- Add command-line interface for user input (text, language, style)
- Implement dynamic voice instructions based on user-selected language and style
- Implement file writing to output.mp3
- Add comprehensive error handling and logging

### Phase 3: Testing and Validation
- Test script execution with valid API credentials
- Verify audio output quality and file format
- Test error scenarios (invalid API key, network issues, invalid inputs)
- Validate narration accuracy across different languages and styles

### Phase 4: Refinement and Documentation
- Add input validation for text, language, and style parameters
- Implement configurable output file names and paths
- Refine command-line interface with help options and prompts
- Add progress indicators and user feedback
- Create README.md with setup and usage instructions
- Optimize for performance and reliability

### Phase 5: Deployment and Maintenance
- Set up CI/CD pipeline for automated testing
- Package the script for easy distribution
- Monitor API usage and costs
- Update dependencies as needed for compatibility

### Phase 6: TXT File Input Feature
- Define metadata structure as key-value pairs in first lines of TXT file (e.g., Language: Spanish, Style: surfer, Output: hello.mp3)
- Add command to generate a template TXT file with metadata headers for language, style, and output
- Implement reading TXT file input with text content and parsing metadata from first rows
- Use default values for language, style, and output if metadata is missing or incomplete
- Integrate TXT file reading into the command-line interface
- Update CLI to accept file path as input parameter
- Add validation for TXT file format and metadata

### Phase 7: Voice Selection Feature
- Research available voices in OpenAI GPT-4o-mini-TTS (alloy, echo, fable, onyx, nova, shimmer, etc.)
- Add -v, --voice CLI option with validation for allowed voices
- Add Voice to TXT file metadata parsing
- Update experimental_generateSpeech API call to include voice parameter
- Set default voice to 'alloy' if not specified
- Update README with voice options and usage examples

### Phase 8: Interactive CLI Interface
- Install inquirer.js for interactive prompts
- Implement --interactive flag to enable guided mode
- Create step-by-step prompts allowing user to choose: enter text directly or specify TXT file name from root directory
- Create prompts for language, style, voice (with list of valid voices), output file with default values offered
- Integrate interactive mode with existing CLI functionality
- Add help text and validation in interactive mode
- Update README with interactive usage instructions
