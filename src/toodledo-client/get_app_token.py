import json
import requests
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
from requests.auth import HTTPBasicAuth
import os
import secrets

# CONFIG LADEN
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "config.json")

with open(CONFIG_PATH) as f:
    config = json.load(f)

CLIENT_ID = config["toodledo"]["client_id"]
CLIENT_SECRET = config["toodledo"]["client_secret"]

REDIRECT_URI = "http://localhost:8000/callback"
TOKEN_URL = "https://api.toodledo.com/3/account/token.php"

# GLOBAL (für Callback → Token Flow)
auth_code = None
expected_state = None


class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code

        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)

        callback_state = params.get("state", [None])[0]

        if "code" in params and callback_state == expected_state:
            auth_code = params["code"][0]
            print("✅ AUTH CODE erhalten:", auth_code)

            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Authorization erfolgreich! Du kannst das Fenster schliessen.")

        elif "code" in params and callback_state != expected_state:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Ungueltiger state Parameter.")

        else:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Kein Code erhalten.")


def get_tokens(code):
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }

    r = requests.post(
        TOKEN_URL,
        data=payload,
        auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    )

    r.raise_for_status()
    return r.json()


def save_refresh_token(refresh_token):
    config["toodledo"]["refresh_token"] = refresh_token
    # Rueckwaertskompatibel mit bestehender config-Struktur
    config["toodledo"]["token"] = refresh_token

    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)

    print("💾 refresh_token gespeichert in config.json")


def main():
    global expected_state
    # 1. Server starten
    server = HTTPServer(("localhost", 8000), CallbackHandler)
    expected_state = secrets.token_urlsafe(24)

    # 2. Browser öffnen
    redirect_uri_encoded = urllib.parse.quote(REDIRECT_URI, safe="")
    auth_url = (
        "https://api.toodledo.com/3/account/authorize.php"
        f"?response_type=code&client_id={CLIENT_ID}&redirect_uri={redirect_uri_encoded}"
        f"&state={expected_state}"
        "&scope=tasks%20lists%20write"
    )

    print("🌐 Öffne Browser für Login...")
    webbrowser.open(auth_url)

    # 3. Auf Callback warten
    print("⏳ Warte auf Authorization Code...")
    while auth_code is None:
        server.handle_request()

    # 4. Token holen
    print("🔄 Tausche Code gegen Tokens...")
    tokens = get_tokens(auth_code)

    print("✅ Tokens erhalten:")
    print(tokens)

    # 5. refresh_token speichern
    save_refresh_token(tokens["refresh_token"])

    # Optional: auch Access-Token/TTL speichern, damit Debugging leichter ist
    if "access_token" in tokens:
        config["toodledo"]["access_token"] = tokens["access_token"]
    if "expires_in" in tokens:
        config["toodledo"]["expires_in"] = tokens["expires_in"]
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)

    print("🎉 Setup abgeschlossen! Dein Cronjob kann jetzt laufen.")


if __name__ == "__main__":
    main()