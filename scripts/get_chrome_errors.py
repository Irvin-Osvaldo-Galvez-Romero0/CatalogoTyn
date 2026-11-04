import subprocess

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--enable-logging=stderr',
    '--v=1',
    '--dump-dom',
    'https://catalogotyn.vercel.app/'
]

proc = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
print("STDERR:\n", proc.stderr)
