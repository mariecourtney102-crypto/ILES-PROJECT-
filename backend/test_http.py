import urllib.request
import json

token = 'e8b4a3c52049ead8116db94ae1e2caa71d974f84'
headers = {
    'Authorization': f'Token {token}',
    'Content-Type': 'application/json'
}

payload = json.dumps({
    'student_id': 8,
    'supervisor_id': 5
}).encode('utf-8')

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/assign-supervisor/',
    data=payload,
    headers=headers,
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(json.load(response), indent=2)}")
except urllib.error.HTTPError as e:
    print(f"Status Code: {e.code}")
    print(f"Response: {json.dumps(json.load(e), indent=2)}")
