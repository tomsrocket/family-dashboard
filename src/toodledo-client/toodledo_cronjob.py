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
CONTEXTS_URL = "https://api.toodledo.com/3/contexts/get.php"

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
        # id,title,modified,completed sind bereits Standardfelder und duerfen
        # laut API nicht extra in "fields" angefordert werden.
        "fields": "folder,star,priority,duedate,context,tag",
        "comp": "0"  # nur offene Tasks
    }
    r = requests.get(TASKS_URL, params=params)
    try:
        r.raise_for_status()
    except requests.HTTPError as exc:
        raise RuntimeError(f"Tasks-Request fehlgeschlagen: {r.status_code} {r.text}") from exc

    data = r.json()
    if isinstance(data, dict) and "errorCode" in data:
        raise RuntimeError(f"Toodledo API-Fehler {data['errorCode']}: {data.get('errorDesc', 'Unbekannt')}")

    return data


def fetch_context_map(access_token):
    params = {"access_token": access_token}
    r = requests.get(CONTEXTS_URL, params=params)
    try:
        r.raise_for_status()
    except requests.HTTPError as exc:
        raise RuntimeError(f"Contexts-Request fehlgeschlagen: {r.status_code} {r.text}") from exc

    data = r.json()
    if isinstance(data, dict) and "errorCode" in data:
        raise RuntimeError(f"Toodledo API-Fehler {data['errorCode']}: {data.get('errorDesc', 'Unbekannt')}")

    # Erwartet wird eine Liste von Context-Objekten: [{"id": "...", "name": "..."}]
    context_map = {}
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and "id" in item and "name" in item:
                context_map[str(item["id"])] = item["name"]

    return context_map


def replace_context_ids_with_names(tasks, context_map):
    if not isinstance(tasks, list):
        return tasks

    for task in tasks:
        if not isinstance(task, dict):
            continue
        context_value = task.get("context")
        if context_value is None:
            continue
        context_name = context_map.get(str(context_value))
        if context_name:
            task["context"] = context_name

    return tasks


def save_tasks(tasks):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


def main():
    try:
        token = get_access_token()
        tasks = fetch_tasks(token)
        context_map = fetch_context_map(token)
        tasks = replace_context_ids_with_names(tasks, context_map)
        save_tasks(tasks)
        print(f"{len(tasks)} tasks gespeichert in {OUTPUT_FILE}")
    except Exception as e:
        print("Fehler:", e)


if __name__ == "__main__":
    main()