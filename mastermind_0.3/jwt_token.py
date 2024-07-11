import jwt
import datetime

def generate_token():
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': 'user_id'
    }
    return jwt.encode(payload, 'your_secret_key', algorithm='HS256')

token = generate_token()
print(token)
