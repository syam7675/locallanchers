"""Create the user-requested standalone version folder and downloadable archive."""
from pathlib import Path
import shutil,hashlib,json,zipfile
root=Path(__file__).resolve().parents[1];dest=root/'versions/v2.2';dest.mkdir(parents=True,exist_ok=True)
def ignored(directory,names):
 return [n for n in names if n in {'node_modules','dist','data','__pycache__','.vercel'} or n.startswith('.env') and n!='.env.example']
shutil.copytree(root/'app',dest/'app',dirs_exist_ok=True,ignore=ignored)
shutil.copytree(root/'api',dest/'api',dirs_exist_ok=True)
shutil.copytree(root/'docs/v2.2',dest/'docs/v2.2',dirs_exist_ok=True)
for f in ['vercel.json','.vercelignore','.gitignore','.gitattributes']:
 shutil.copy2(root/f,dest/f)
(dest/'README.md').write_text('''# Local Lanchers — Version 2.2 snapshot

A standalone source snapshot of the updated existing application. The active deployment builds the root `app/` directory; this version folder preserves the 2.2 design, source and walkthrough together.

Run with Node.js 24+: `cd app`, `npm ci`, then `npm run dev`. For a local production build: `npm run build` then `npm start`.

See [design, account flows and verification](docs/v2.2/README.md) and [the actual walkthrough](docs/v2.2/Local-Lanchers-v2.2-Walkthrough.mp4). Real accounts require the full backend with persistent storage and `ENABLE_USER_ACCOUNTS=true`. The public Vercel demo does not collect accounts or audit requests.

No runtime databases, account credentials, environment secrets, build output or dependencies are included.
''')
files={str(p.relative_to(dest)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(dest.rglob('*')) if p.is_file() and p.name!='MANIFEST.json'}
(dest/'MANIFEST.json').write_text(json.dumps({'version':'2.2.0','files':files},indent=2)+'\n')
out=Path('/workspace/downloads');out.mkdir(exist_ok=True)
with zipfile.ZipFile(out/'Local-Lanchers-v2.2-Complete-Project.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(dest.rglob('*')):
  if p.is_file():z.write(p,'Local-Lanchers-v2.2/'+str(p.relative_to(dest)))
shutil.copy2(root/'docs/v2.2/Local-Lanchers-v2.2-Walkthrough.mp4',out/'Local-Lanchers-v2.2-Walkthrough.mp4')
print('Packaged',len(files),'files into',dest)
