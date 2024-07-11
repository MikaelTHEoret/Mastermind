
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
    