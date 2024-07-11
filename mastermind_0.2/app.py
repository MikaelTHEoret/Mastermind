from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import os
import subprocess
import re
from modules import load_modules

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
    "allowed_actions": ["chat", "run_script", "modify_file", "create_file"],
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

# Chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input')

    if "chat" not in app.user_settings.get("allowed_actions", []) and app.user_settings.get("permission_required", False):
        return jsonify({"error": "Do you want to allow this action? [yes/no]"})

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": app.user_settings.get("system_message", "You are a helpful assistant")},
            {"role": "user", "content": user_input}
        ]
    )

    gpt_response = response.choices[0].message['content'].strip()
    command_response = process_command(gpt_response)
    return command_response

def process_command(command):
    # Match the "create a file" command
    create_file_pattern = r'create a file named (\w+\.py) and add to it the codes for the (\w+)'
    match = re.search(create_file_pattern, command)

    if match:
        file_name = match.group(1)
        module_name = match.group(2)
        module_content = get_module_content(module_name)

        if module_content == 'Module not found':
            return jsonify({'status': 'error', 'message': 'Module not found'})

        return create_file(file_name, module_content)

    # Match the "list all files in root" command
    if command.strip().lower() == 'list all files in root':
        return list_files_in_root()

    return jsonify({'status': 'error', 'message': 'Unknown command'})

def list_files_in_root():
    try:
        files = os.listdir('.')
        return jsonify({'status': 'success', 'files': files})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def get_module_content(module_name):
    # Define the module contents here
    modules = {
        "test_module": """
def test_function():
    print('This is a test function')
"""
    }
    return modules.get(module_name, 'Module not found')

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
    app.run(debug=True)
