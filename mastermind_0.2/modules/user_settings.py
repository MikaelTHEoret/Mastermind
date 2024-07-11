from flask import Flask
app = Flask(__name__)

def init_app(app):
    @app.route('/user_settings', methods=['GET'])
    def get_user_settings():
        return "User settings route"

# Initialize user settings (add this somewhere in app.py)
app.user_settings = {
    "allowed_actions": ["chat", "run_script", "modify_file"],  # Example allowed actions
    "permission_required": False,  # Example setting
    "system_message": "System message example"  # Example system message
}
