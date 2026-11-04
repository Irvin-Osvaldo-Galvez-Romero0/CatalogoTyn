import subprocess

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    '--virtual-time-budget=10000',
    'https://catalogotyn.vercel.app/'
]
try:
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    print("STDOUT length:", len(proc.stdout))
    if '<div id="root">' in proc.stdout:
        idx = proc.stdout.find('<div id="root">')
        print("Root slice:", proc.stdout[idx:idx+400])
except Exception as e:
    print("Error:", e)
