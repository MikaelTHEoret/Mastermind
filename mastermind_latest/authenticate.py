import requests

# URL of the running Flask app
url = "http://127.0.0.1:5000/auth"

# User credentials to authenticate
data = {
    "username": "mastermind",
    "password": "IknowWhoyouare!!"
}

try:
    # Sending the POST request to the /auth endpoint
    response = requests.post(url, json=data)
    
    # Checking the response
    if response.status_code == 200:
        print("Authentication successful")
        print("Token:", response.json().get("token"))
    else:
        print("Authentication failed")
        print("Error:", response.json().get("message"))
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
