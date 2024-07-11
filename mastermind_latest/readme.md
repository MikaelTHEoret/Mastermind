# Flask Application with OpenAI Integration

## Overview

This Flask application integrates with the OpenAI GPT-4o model to execute various functionalities based on user commands. Users can chat with the AI, create files, modify files, and run scripts directly from the web interface.

## Features

- **Chat with AI**: Interact with the AI to perform various tasks.
- **Create Files**: Create new files with specified content.
- **Modify Files**: Modify existing files based on user commands.
- **Run Scripts**: Execute scripts pasted into the run script input box.

## Usage

### Chat with AI

- Type your command in the chat input box and click "Send".
- The AI will process your command and perform the corresponding action.

### Run Scripts

- Paste your script into the run script input box and click "Run".
- The script will be executed, and the output will be displayed below the input box.

### Example Commands

- "Create a file named `example.py` and add to it the codes for the `test_module`."
- "Modify the file `example.py` to include a new function `test_function`."

## Configuration

### Environment Variables

- **OPENAI_API_KEY**: Your OpenAI API key.

### Desktop Variables

- The application can access and configure desktop variables through the `app.user_settings["desktop_variables"]` dictionary.

## Installation

1. Clone the repository.
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
