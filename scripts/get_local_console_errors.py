import http.server
import socketserver
import threading
import subprocess
import time

PORT = 4174
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

httpd = socketserver.TCPServer(("", PORT), Handler)
server_thread = threading.Thread(target=httpd.serve_forever)
server_thread.daemon = True
server_thread.start()

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--enable-logging=stderr',
    '--v=1',
    '--dump-dom',
    f'http://localhost:{PORT}/'
]

proc = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
httpd.shutdown()

for line in proc.stderr.splitlines():
    if any(k in line.lower() for k in ['console', 'uncaught', 'syntaxerror', 'referenceerror', 'typeerror']):
        print(line)
