import requests
import json
from requests.auth import HTTPBasicAuth
import os

# CONFIG
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "config.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "tasks_raw.json")

with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

# Zugriff auf Werte
CLIENT_ID = config["toodledo"]["client_id"]
CLIENT_SECRET = config["toodledo"]["client_secret"]
REFRESH_TOKEN = config["toodledo"].get("refresh_token") or config["toodledo"].get("token")

TOKEN_URL = "https://api.toodledo.com/3/account/token.php"
TASKS_URL = "https://api.toodledo.com/3/tasks/get.php"

def get_access_token():
    if not REFRESH_TOKEN:
        raise RuntimeError(
            "Kein refresh_token in config.json gefunden. Bitte zuerst get_app_token.py ausfuehren."
        )

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": REFRESH_TOKEN
    }
    r = requests.post(
        TOKEN_URL,
        data=payload,
        auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    )
    try:
        r.raise_for_status()
    except requests.HTTPError as exc:
        raise RuntimeError(f"Token-Request fehlgeschlagen: {r.status_code} {r.text}") from exc
    data = r.json()

    new_refresh_token = data.get("refresh_token")
    if new_refresh_token and new_refresh_token != REFRESH_TOKEN:
        config["toodledo"]["refresh_token"] = new_refresh_token
        with open(CONFIG_PATH, "w") as f:
            json.dump(config, f, indent=2)

    return data["access_token"]


def fetch_tasks(access_token):
    params = {
        "access_token": access_token,
        "fields": "folder,star,priority,duedate,context,tag,completed",
        "comp": "0"  # nur offene Tasks
    }
    r = requests.get(TASKS_URL, params=params)
    try:
        r.raise_for_status()
    except requests.HTTPError as exc:
        raise RuntimeError(f"Tasks-Request fehlgeschlagen: {r.status_code} {r.text}") from exc

    return r.json()


def save_tasks(tasks):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


def main():
    try:
        token = get_access_token()
        tasks = fetch_tasks(token)
        save_tasks(tasks)
        print(f"{len(tasks)} tasks gespeichert in {OUTPUT_FILE}")
    except Exception as e:
        print("Fehler:", e)


if __name__ == "__main__":
    main()