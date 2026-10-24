from pathlib import Path
import re,hashlib,zipfile,shutil,json
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import fitz
ROOT=Path(__file__).resolve().parents[3];HERE=Path(__file__).resolve().parent
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
styles={
 'h1':ParagraphStyle('h1',fontName='Bold',fontSize=21,leading=25,textColor=HexColor('#173e36'),spaceAfter=12),
 'h2':ParagraphStyle('h2',fontName='Bold',fontSize=12,leading=16,textColor=HexColor('#173e36'),spaceBefore=10,spaceAfter=6,keepWithNext=True),
 'body':ParagraphStyle('body',fontName='Body',fontSize=9.2,leading=12.6,textColor=HexColor('#263e35'),spaceAfter=8)}
def markup(s):
 s=escape(s);s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s);s=re.sub(r'`([^`]+)`',r'\1',s);return s
story=[]
for block in HERE.joinpath('HISTORY.md').read_text().split('\n\n'):
 if not block.strip():continue
 kind='h1' if block.startswith('# ') else 'h2' if block.startswith('## ') else 'body'
 if kind=='h1':block=block[2:]
 elif kind=='h2':block=block[3:]
 # Each numbered milestone is independently laid out, preserving order.
 for part in re.split(r'\n(?=\d+\. )',block):
  paragraph=Paragraph(markup(part.replace('\n',' ')),styles[kind])
  story.append(KeepTogether([paragraph]) if re.match(r'^\d+\. ',part) else paragraph)
def header(c,d):
 c.setFillColor(HexColor('#173e36'));c.rect(0,811,595,31,fill=1,stroke=0);c.setFont('Bold',9);c.setFillColor(HexColor('#ffffff'));c.drawString(40,822,'LOCAL LANCHERS  /  VERIFIED HISTORY & HANDOFF')
 c.setFillColor(HexColor('#53645b'));c.setFont('Body',8);c.drawString(40,24,'18–24 October 2026 coverage • dates shown in IST • prepared 24 October');c.drawRightString(555,24,str(d.page))
SimpleDocTemplate(str(HERE/'HISTORY.pdf'),pagesize=(595,842),topMargin=52,bottomMargin=42,leftMargin=40,rightMargin=40,title='Local Lanchers — chronological work brief',author='Local Lanchers').build(story,onFirstPage=header,onLaterPages=header)
files={
 'docs/v2.1/Local-Lanchers-Version-2.1-Build-and-Design.pdf':'supporting/01-V2.1-Build-and-Design.pdf',
 'docs/v2.2/journeys/Local-Lanchers-v2.2-Customer-Admin-Guide.pdf':'supporting/02-V2.2-Customer-Admin-Guide.pdf',
 'docs/v2.2/journeys/Local-Lanchers-v2.2-Journey-Presentation.pdf':'supporting/03-V2.2-Journey-Presentation.pdf',
 'docs/v2.2/journeys/Local-Lanchers-v2.2-Journey-Presentation.pptx':'supporting/04-V2.2-Journey-Presentation.pptx',
 'promo/README.md':'supporting/05-Promo-Production-Notes.md',
 'docs/v2.1/verification/summary.json':'evidence/v2.1-verification-summary.json',
 'docs/v2.2/verification/browser-checks.json':'evidence/v2.2-browser-checks.json',
 'docs/v2.2/verification/tests.txt':'evidence/v2.2-api-tests.txt',
 'docs/v2.2/verification/walkthrough-media.json':'evidence/v2.2-walkthrough-media.json'}
for src,dest in files.items():
 p=HERE/dest;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/src,p)
package_files=[p for p in sorted(HERE.rglob('*')) if p.is_file() and p.name not in {'MANIFEST.sha256','build_bundle.py'} and p.suffix!='.png' and '__pycache__' not in p.parts]
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(HERE))+'\n' for p in package_files)
(HERE/'MANIFEST.sha256').write_text(manifest)
package_files.append(HERE/'MANIFEST.sha256')
out=Path('/workspace/downloads/Local-Lanchers-History-and-Skill-2026-10-24.zip');out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for p in package_files:z.write(p,'Local-Lanchers-Handoff-2026-10-24/'+str(p.relative_to(HERE)))
with zipfile.ZipFile(out) as z:
 assert z.testzip() is None
 for p in package_files:assert z.read('Local-Lanchers-Handoff-2026-10-24/'+str(p.relative_to(HERE)))==p.read_bytes()
 assert not any(s in n for n in z.namelist() for s in ['/node_modules/','/.env','/.vercel/','.sqlite'])
for rel in re.findall(r'\]\((references/[^)]+)\)',(HERE/'SKILL.md').read_text()):assert (HERE/rel).exists(),rel
skill=(HERE/'SKILL.md').read_text();assert skill.startswith('---\nname: local-lanchers-maintenance\ndescription:') and '\n---\n' in skill[4:]
pdf=fitz.open(HERE/'HISTORY.pdf');assert 1<=len(pdf)<=4
for page in pdf:assert page.get_text().strip()
pdf[0].get_pixmap(matrix=fitz.Matrix(1.4,1.4)).save('/tmp/local-lanchers-history-first-page.png')
print(json.dumps({'zip':str(out),'files':len(package_files),'bytes':out.stat().st_size,'historyPages':len(pdf),'zipIntegrity':'passed','skillReferences':'passed','fileHashes':'passed'},indent=2))
