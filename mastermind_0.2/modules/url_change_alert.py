from flask import Blueprint, request, jsonify, current_app

url_change_alert_bp = Blueprint('url_change_alert', __name__)

@url_change_alert_bp.route('/url_change_alert', methods=['POST'])
def url_change_alert():
    # URL change alert logic here
    data = request.json
    # Example logic
    return jsonify({'status': 'success', 'message': 'URL change alert triggered'})

def init_app(app):
    app.register_blueprint(url_change_alert_bp)
