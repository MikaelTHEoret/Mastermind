# Chat-GPT Sandbox Program

This is a standalone Windows PC program that mimics the Chat-GPT experience but runs locally through the OpenAI API. The program functions as a sandbox GUI with a framework for modular expansions and is capable of self-editing and adapting to implement new features based on user requests.

## Features

- Local execution of the Chat-GPT experience using the OpenAI API
- Sandbox environment with GUI
- Framework for modular expansions
- Self-editing and adapting capabilities to implement new features based on user requests
- Permission and restriction management for file operations
- User interface for interacting with Chat-GPT and managing permissions
- Logging of all interactions and file operations for audit purposes
- Basic error handling and rollback capabilities

## Setup and Usage

### Prerequisites

- Python 3.7+
- PyQt5
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatgpt_sandbox.git
   cd chatgpt_sandbox
Install the required Python packages:

bash
Copier le code
pip install pyqt5 openai
Run the application:

bash
Copier le code
python main.py
Configuration
OpenAI Configuration:

Open the "Settings" menu and select "OpenAI Configuration".
Enter your OpenAI API Key and the desired model.
Click "Save".
Permissions Configuration:

Open the "Settings" menu and select "Permissions".
Enter the file path and select the permissions (create, delete, edit).
Click "Save".
Directory Structure
api/: Contains the integration with the OpenAI API.
openai_integration.py: Handles the interaction with OpenAI API.
database/: Contains the database schema.
schema.sql: SQL schema for the application's database.
expansions/: Contains the framework for modular expansions.
expansion_framework.py: Manages the loading and execution of expansion modules.
logging/: Contains the logging system.
logging_system.py: Handles logging of interactions and file operations.
permissions/: Contains the permission management system.
permission_manager.py: Manages file operation permissions.
scripts/: Contains the script execution engine.
script_execution_engine.py: Executes user-defined scripts.
ui/: Contains the user interface components.
chat_interface.py: Handles the chat interface with Chat-GPT.
config_dialog.py: Manages the OpenAI configuration dialog.
main_window.py: Main window of the application, includes logging console.
permission_dialog.py: Manages the permissions configuration dialog.
config.txt: Stores the OpenAI API key and model configuration.
permissions.txt: Stores the file permissions configuration.
sandbox.log: Log file for all interactions and file operations.
main.py: Entry point of the application.
Technical Details
Logging:

The application logs all interactions and file operations.
Logs are displayed in the console within the GUI and saved to sandbox.log.
OpenAI Integration:

openai_integration.py handles the interaction with the OpenAI API.
Configuration is loaded from config.txt.
Permissions:

permission_manager.py manages file operation permissions.
Permissions are stored in permissions.txt.
Expansion Framework:

expansion_framework.py loads and executes expansion modules.
Expansion modules are Python scripts located in the expansions/ directory.
Troubleshooting
Ensure that you have provided the correct OpenAI API Key in the configuration.
Check the console log in the application for any errors.
Refer to sandbox.log for a detailed log of all interactions and file operations.
Contributing
Fork the repository.
Create a new branch.
Make your changes.
Submit a pull request.

### Technical Log

#### Project Overview
The Chat-GPT Sandbox Program is a local application that allows users to interact with the Chat-GPT model using the OpenAI API. It features a modular expansion framework, permission management, and a logging system for debugging and auditing purposes.

#### Key Components

1. **OpenAI Integration (`api/openai_integration.py`):**
   - Handles communication with the OpenAI API.
   - Loads configuration from `config.txt`.
   - Provides a method to generate responses from the Chat-GPT model.

2. **Permissions Management (`permissions/permission_manager.py`):**
   - Manages file operation permissions.
   - Loads and saves permissions to `permissions.txt`.
   - Provides methods to check and enforce permissions.

3. **Script Execution (`scripts/script_execution_engine.py`):**
   - Executes user-defined scripts.
   - Integrates with the permission manager to enforce permissions.

4. **Expansion Framework (`expansions/expansion_framework.py`):**
   - Loads and manages expansion modules.
   - Allows dynamic addition of new features through Python scripts.

5. **User Interface (`ui/`):**
   - `main_window.py`: Main application window, includes logging console.
   - `chat_interface.py`: Chat interface for interacting with Chat-GPT.
   - `config_dialog.py`: Dialog for configuring OpenAI API settings.
   - `permission_dialog.py`: Dialog for configuring file permissions.

6. **Logging System (`logging/logging_system.py`):**
   - Logs interactions and file operations.
   - Displays logs in the GUI and saves them to `sandbox.log`.

#### Adding a New Feature

1. **Create a New Expansion Module:**
   - Add a new Python script to the `expansions/` directory.
   - Ensure the script follows the format and conventions of existing modules.

2. **Update Permissions:**
   - Use the permissions dialog to update file permissions as needed.
   - Ensure the new feature respects the existing permission framework.

3. **Test and Debug:**
   - Run the application and use the console log to debug.
   - Check `sandbox.log` for detailed logging information.

4. **Submit Changes:**
   - Fork the repository, create a new branch, make changes, and submit a pull request.

#### Common Issues

- **Missing API Key:** Ensure the OpenAI API key is correctly entered in the configuration dialog.
- **Permission Denied:** Check the permissions configuration to ensure the required permissions are granted.
- **Logging Errors:** Verify that the logging system is correctly initialized and configured.

By following the above guidelines, future developers should be able to continue working on the application without requiring previous context. If there are any specific issues or further questions, please refer to the `README.md` and the technical log for detailed information.






