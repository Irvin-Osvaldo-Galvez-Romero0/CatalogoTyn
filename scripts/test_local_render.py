import http.server
import socketserver
import threading
import subprocess
import time
import os

PORT = 4173
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

httpd = socketserver.TCPServer(("", PORT), Handler)
server_thread = threading.Thread(target=httpd.serve_forever)
server_thread.daemon = True
server_thread.start()

print(f"Serving at http://localhost:{PORT}")
time.sleep(1)

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    '--virtual-time-budget=5000',
    f'http://localhost:{PORT}/'
]

proc = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
httpd.shutdown()

has_cards = 'kiosk-card' in proc.stdout
has_root = '<div id="root">' in proc.stdout
root_empty = '<div id="root"></div>' in proc.stdout

print(f"Has kiosk-card: {has_cards}")
print(f"Has root: {has_root}")
print(f"Is root empty: {root_empty}")
if has_cards:
    print("SUCCESS: React successfully rendered the catalog cards!")
else:
    print("STDOUT slice:", proc.stdout[:1000])
