from flask import Blueprint, request, jsonify, current_app

modify_file_bp = Blueprint('modify_file', __name__)

@modify_file_bp.route('/modify_file', methods=['POST'])
def modify_file():
    file_path = request.json.get('file_path')
    modifications = request.json.get('modifications')

    if "modify_file" not in current_app.user_settings["allowed_actions"] and current_app.user_settings["permission_required"]:
        return jsonify("Do you want to allow this action? [yes/no]")

    try:
        with open(file_path, 'r') as file:
            content = file.readlines()

        for mod in modifications:
            line_num, new_content = mod
            if 0 <= line_num < len(content):
                content[line_num] = new_content + "\n"

        with open(file_path, 'w') as file:
            file.writelines(content)

        return jsonify({'status': 'success', 'message': 'File modified successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def init_app(app):
    app.register_blueprint(modify_file_bp)
