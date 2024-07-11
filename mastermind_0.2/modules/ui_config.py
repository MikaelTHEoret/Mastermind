from flask import Blueprint, request, jsonify, current_app

ui_config_bp = Blueprint('ui_config', __name__)
user_settings = {
    "system_message": "You are a helpful assistant.",
    "allowed_actions": ["chat", "run_script", "modify_file"]
}
@ui_config_bp.route('/ui_config', methods=['POST'])
def ui_config():
    # UI config logic here
    data = request.json
    # Example logic
    return jsonify({'status': 'success', 'message': 'UI configured'})

def init_app(app):
    @app.route('/ui_config/set_system_message', methods=['POST'])
    def set_system_message():
        system_message = request.json.get('system_message')
        app.user_settings["system_message"] = system_message
        return jsonify({'status': 'success', 'system_message': system_message})

    @app.route('/ui_config/set_allowed_actions', methods=['POST'])
    def set_allowed_actions():
        allowed_actions = request.json.get('allowed_actions')
        app.user_settings["allowed_actions"] = allowed_actions
        return jsonify({'status': 'success', 'allowed_actions': allowed_actions})

    app.user_settings.update(user_settings)

def init_app(app):
    app.register_blueprint(ui_config_bp)