import os
import requests

RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY")
print("API Key:", RUNPOD_API_KEY)
RUNPOD_POD_ID = os.getenv("RUNPOD_POD_ID")
RUNPOD_BASE = "https://rest.runpod.io/v1"

url = f"{RUNPOD_BASE}/pods/{RUNPOD_POD_ID}"
headers = {"Authorization": f"Bearer {RUNPOD_API_KEY}"}

resp = requests.get(url, headers=headers)
print("Status code:", resp.status_code)
print("Raw response text:", resp.text)

# only call .json() if response is non-empty
if resp.text:
    data = resp.json()
    print("Public IP:", data.get("publicIp"))
else:
    print("No response received from RunPod API.")
