from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)
auth_bp = Blueprint('auth', __name__)

users = {
    'admin': generate_password_hash('secret')
}

@auth_bp.route('/auth', methods=['POST'])
def authenticate():
    data = request.json
    return jsonify({'status': 'success', 'message': 'Authenticated'})

def init_app(app):
    app.register_blueprint(auth_bp)
    
@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username in users and check_password_hash(users[username], password):
        session['user'] = username
        print(f'User {username} logged in successfully.')
        return jsonify({'status': 'success', 'message': 'Logged in successfully!'})
    print(f'Invalid login attempt for username: {username}')
    return jsonify({'status': 'failure', 'message': 'Invalid credentials!'}), 401

@auth.route('/logout', methods=['POST'])
def logout():
    if 'user' in session:
        print(f'User {session["user"]} logged out.')
        session.pop('user', None)
        return jsonify({'status': 'success', 'message': 'Logged out successfully!'})
    return jsonify({'status': 'failure', 'message': 'No user logged in!'}), 401

@auth.before_request
def before_request():
    print(f'Handling request to {request.endpoint}, user in session: {"user" in session}')
    if request.endpoint not in ['auth.login', 'auth.logout', 'static'] and 'user' not in session:
        print('Unauthorized access attempt.')
        return jsonify({'status': 'failure', 'message': 'Unauthorized'}), 401

def init_app(app):
    app.register_blueprint(auth_bp)