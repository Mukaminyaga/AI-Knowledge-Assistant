# app/utils/runpod_client.py
import os
import time
import requests
from typing import Any, Dict

RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY")
POD_ID = os.getenv("RUNPOD_POD_ID")
if not RUNPOD_API_KEY or not POD_ID:
    raise RuntimeError("Set RUNPOD_API_KEY and RUNPOD_POD_ID environment variables")

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {RUNPOD_API_KEY}"
}

# Base URL used in examples; change if RunPod's API base differs
BASE_URL = "https://api.runpod.io/v2"

def _url(path: str) -> str:
    return f"{BASE_URL}/{POD_ID}{path}"

def start_pod(timeout: int = 60) -> Dict[str, Any]:
    """Start the pod (if stopped). Returns pod info JSON. Waits until pod is running or raises."""
    resp = requests.post(_url("/start"), headers=HEADERS, timeout=30)
    resp.raise_for_status()
    # The start call may return immediately; poll status until it's running
    start = time.time()
    while True:
        status = get_pod_status()
        if status.get("state", "").lower() in ("running", "ready", "started"):
            return status
        if time.time() - start > timeout:
            raise TimeoutError("Pod did not become ready in time")
        time.sleep(2)

def stop_pod() -> Dict[str, Any]:
    """Stop the pod. Returns response JSON."""
    resp = requests.post(_url("/stop"), headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.json()

def get_pod_status() -> Dict[str, Any]:
    """Return pod status info."""
    resp = requests.get(_url("/status"), headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return resp.json()

def run_sync_on_pod(input_payload: Dict[str, Any], timeout: int = 120) -> Dict[str, Any]:
    """
    Run a synchronous job on the pod. The pod must be configured so that
    runsync triggers an internal handler (e.g., the gpu_search.py handler).
    Returns the pod response JSON.
    """
    payload = {"input": input_payload}
    resp = requests.post(_url("/runsync"), json=payload, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.json()
