from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import sys

class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)

        CLIENTID = sys.argv[1] 
        RANDOMSTRING = sys.argv[2] if len(sys.argv) > 2 else "randomstring2"

        mystring = f"https://api.toodledo.com/3/account/authorize.php?response_type=code&client_id={CLIENTID}&state={RANDOMSTRING}&scope=tasks%20lists%20write"

        if "code" in params:
            code = params["code"][0]
            print("AUTH CODE:", code)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Authorization erfolgreich. Du kannst das Fenster schliessen.")
        else: 
            print("NO AUTH CODE")
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'<a href="' + mystring.encode() + b'">Start Authorization</a>')

server = HTTPServer(("localhost", 8000), CallbackHandler)
print("Server läuft auf http://localhost:8000")
server.serve_forever()

