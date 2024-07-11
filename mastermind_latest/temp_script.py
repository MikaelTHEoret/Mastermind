import os
import shutil
import sys

# Define paths
MASTERMIND_TARGET_DIR = "C:\\Users\\Mik\\flask_app"  # Target directory for Mastermind application
GPT_PILOT_SRC_DIR = "C:\\Users\\Mik\\flask_app\\modules\\gpt-pilot-main\\pilot"  # Source directory for Gpt-Pilot

def setup_directories():
    os.makedirs(os.path.join(MASTERMIND_TARGET_DIR, 'modules', 'gpt_pilot'), exist_ok=True)

# List directory contents for debugging
def list_directory_contents(path):
    for root, dirs, files in os.walk(path):
        level = root.replace(path, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{sub_indent}{f}")

# Step 2: Copy necessary Gpt-Pilot files to Mastermind modules
def copy_gpt_pilot_files():
    items_to_copy = ['const', 'database', 'helpers', 'templates', 'utils', 'main.py', 'logger']

    for item in items_to_copy:
        src = os.path.join(GPT_PILOT_SRC_DIR, item)
        dst = os.path.join(MASTERMIND_TARGET_DIR, 'modules', 'gpt_pilot', item)

        print(f"Attempting to copy {src} to {dst}")
        if os.path.exists(src):
            if os.path.isdir(src):
                shutil.copytree(src, dst, dirs_exist_ok=True)
                print(f"Copied directory {src} to {dst}")
            else:
                shutil.copy2(src, dst)
                print(f"Copied file {src} to {dst}")
        else:
            print(f"Error: The source path '{src}' does not exist.")

# Step 3: Create __init__.py for Gpt-Pilot module
def create_init_py():
    init_content = '''
# Import necessary components
from .utils import files, settings, task

def initialize():
    print("Gpt-Pilot module initialized")

def create_or_edit_file(file_path, content):
    if settings.DISABLE_RESTRICTIONS:
        with open(file_path, 'w') as f:
            f.write(content)
    else:
        # Handle restricted mode
        pass
    '''
    with open(os.path.join(MASTERMIND_TARGET_DIR, 'modules', 'gpt_pilot', '__init__.py'), 'w') as f:
        f.write(init_content)

# Step 4: Update Mastermind module manager to load and initialize the Gpt-Pilot module
def update_module_manager():
    module_manager_content = '''
import importlib.util
import os
import sys

class ModuleManager:
    def __init__(self):
        self.modules = []

    def load_module(self, module_name):
        module_path = os.path.join('modules', module_name)
        if os.path.isdir(module_path):
            spec = importlib.util.spec_from_file_location(module_name, os.path.join(module_path, '__init__.py'))
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)
            self.modules.append(module)
            return module
        else:
            raise FileNotFoundError(f"Module {module_name} not found")

    def initialize_modules(self):
        for module in self.modules:
            if hasattr(module, 'initialize'):
                module.initialize()

# Initialize the module manager and load modules
module_manager = ModuleManager()
module_manager.load_module('gpt_pilot')
module_manager.initialize_modules()
    '''
    with open(os.path.join(MASTERMIND_TARGET_DIR, 'modules', 'module_manager.py'), 'w') as f:
        f.write(module_manager_content)

# Step 5: Create the main application script integrating the GUI and the new module
def create_main_app():
    main_app_content = '''
from modules.module_manager import ModuleManager
from tkinter import Tk, filedialog, Text, Button
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the module manager and load modules
module_manager = ModuleManager()
module_manager.load_module('gpt_pilot')
module_manager.initialize_modules()

gpt_pilot = module_manager.modules[0]  # Assuming gpt_pilot is the first loaded module

def edit_file():
    file_path = filedialog.askopenfilename()
    if file_path:
        content = get_file_content(file_path)
        display_content_in_editor(content)

def save_file():
    file_path = filedialog.asksaveasfilename()
    if file_path:
        content = get_content_from_editor()
        gpt_pilot.create_or_edit_file(file_path, content)

def get_file_content(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def display_content_in_editor(content):
    global editor
    editor = Text(root)
    editor.insert(1.0, content)
    editor.pack()

def get_content_from_editor():
    return editor.get(1.0, "end-1c")

if __name__ == "__main__":
    root = Tk()
    root.title("Mastermind - File Editor")
    root.geometry("800x600")

    edit_button = Button(root, text="Edit File", command=edit_file)
    edit_button.pack()

    save_button = Button(root, text="Save File", command=save_file)
    save_button.pack()

    root.mainloop()
    '''
    with open(os.path.join(MASTERMIND_TARGET_DIR, 'app.py'), 'w') as f:
        f.write(main_app_content)

# Ensure the 'modules' directory has an __init__.py file
modules_init_path = os.path.join(MASTERMIND_TARGET_DIR, 'modules', '__init__.py')
if not os.path.exists(modules_init_path):
    open(modules_init_path, 'w').close()

# Add the target directory to the system path for module loading
sys.path.append(MASTERMIND_TARGET_DIR)
print("Updated sys.path:", sys.path)

# Execute the steps
setup_directories()
print("Listing contents of GPT_PILOT_SRC_DIR for debugging:")
list_directory_contents(GPT_PILOT_SRC_DIR)  # List contents of the source directory for debugging
copy_gpt_pilot_files()
create_init_py()
update_module_manager()
create_main_app()

print("Integration complete.")
