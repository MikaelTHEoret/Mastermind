import sys
import os
import shutil

# Define paths
MASTERMIND_TARGET_DIR = "C:\\Users\\Mik\\flask_app"
GPT_PILOT_SRC_DIR = "C:\\Users\\Mik\\flask_app\\modules\\gpt-pilot-main\\pilot"

# Function to copy directory contents
def copy_directory_contents(src_dir, dst_dir):
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dst_dir, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)

# Step 1: Copy GPT-Pilot files to Mastermind modules
copy_directory_contents(GPT_PILOT_SRC_DIR, os.path.join(MASTERMIND_TARGET_DIR, 'modules', 'gpt_pilot'))

# Step 2: Add the target directory to the system path for module loading
sys.path.append(os.path.join(MASTERMIND_TARGET_DIR, 'modules'))
print("Updated sys.path:", sys.path)

# Step 3: Print the directory structure for debugging
for root, dirs, files in os.walk(os.path.join(MASTERMIND_TARGET_DIR, 'modules')):
    level = root.replace(os.path.join(MASTERMIND_TARGET_DIR, 'modules'), '').count(os.sep)
    indent = ' ' * 4 * (level)
    print(f"{indent}{os.path.basename(root)}/")
    sub_indent = ' ' * 4 * (level + 1)
    for f in files:
        print(f"{sub_indent}{f}")

# Step 4: Trying to import to verify
try:
    from gpt_pilot.database.database import save_user_app
    print("Import successful!")
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current sys.path: {sys.path}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Files in the current directory: {os.listdir(os.getcwd())}")
