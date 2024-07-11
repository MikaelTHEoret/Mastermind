from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import os
import subprocess
import re
from modules import load_modules
import logging

app = Flask(__name__)
CORS(app)

# Load secrets from secret.txt
def load_secrets():
    secrets = {}
    with open('secret.txt', 'r') as file:
        for line in file:
            if '=' in line:
                name, value = line.strip().split('=', 1)
                secrets[name] = value
    return secrets

secrets = load_secrets()
openai.api_key = secrets.get('OPENAI_API_KEY')

# Initialize user settings
app.user_settings = {
    "allowed_actions": ["chat", "run_script", "modify_file", "create_file", "list_files"],
    "permission_required": False,
    "system_message": "You are a helpful assistant",
    "desktop_variables": {
        "example_variable": "example_value"
    }
}

# Load modules
load_modules(app)

@app.route('/')
def home():
    return render_template('index.html')

# Function to create a file and add content
def create_file(file_name, content):
    try:
        with open(file_name, 'w') as file:
            file.write(content)
        return jsonify({'status': 'success', 'message': f'File {file_name} created successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Function to list files in the root directory
def list_files_in_root():
    try:
        files = os.listdir('.')
        return jsonify({'status': 'success', 'files': files})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Natural language command processing
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input')
    logging.debug(f"User input: {user_input}")

    if "chat" not in app.user_settings.get("allowed_actions", []) and app.user_settings.get("permission_required", False):
        return jsonify({"error": "Do you want to allow this action? [yes/no]"})

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": app.user_settings.get("system_message", "You are a helpful assistant")},
            {"role": "user", "content": user_input}
        ]
    )

    gpt_response = response.choices[0].message['content']
    logging.debug(f"GPT-4 response: {gpt_response}")

    # Determine the task from the response
    if "create a file" in gpt_response.lower():
        create_file_pattern = r'create a file named (\w+\.txt) in root'
        match = re.search(create_file_pattern, gpt_response.lower())

        if match:
            file_name = match.group(1)
            return create_file(file_name, "This is a test file created by the chatbot.")

    # List files in the root directory
    if "list the root directory" in gpt_response.lower() or "list all files in root" in gpt_response.lower():
        return list_files_in_root()

    # Respond to greetings
    if "hi" in user_input.lower() or "hello" in user_input.lower():
        return jsonify({"message": "Hello! How can I assist you today?"})

    # Add more natural language command handling as needed

    return jsonify({'message': gpt_response})

# Run script endpoint
@app.route('/run_script', methods=['POST'])
def run_script():
    script_content = request.json.get('script')
    script_path = 'temp_script.py'

    if "run_script" not in app.user_settings.get("allowed_actions", []) and app.user_settings.get("permission_required", False):
        return jsonify({"error": "Do you want to allow this action? [yes/no]"})

    with open(script_path, 'w') as script_file:
        script_file.write(script_content)

    try:
        result = subprocess.run(['python', script_path], capture_output=True, text=True)
        return jsonify({'output': result.stdout, 'error': result.stderr})
    finally:
        os.remove(script_path)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
