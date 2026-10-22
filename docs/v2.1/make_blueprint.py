"""Create the final Version 2.1 build and complete design document."""
from pathlib import Path
from xml.sax.saxutils import escape
import re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,Image,KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("LLRegular","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("LLBold","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("LLMono","/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"))
pdfmetrics.registerFontFamily("LLRegular",normal="LLRegular",bold="LLBold",italic="LLRegular",boldItalic="LLBold")
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]
INK=colors.HexColor('#071b29');TEAL=colors.HexColor('#008b79');GRAY=colors.HexColor('#536571')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='CoverTitleLL',fontName='LLBold',fontSize=33,leading=39,textColor=INK,spaceAfter=22))
styles.add(ParagraphStyle(name='LLH1',fontName='LLBold',fontSize=21,leading=27,textColor=INK,spaceBefore=20,spaceAfter=13))
styles.add(ParagraphStyle(name='LLH2',fontName='LLBold',fontSize=14,leading=19,textColor=INK,spaceBefore=18,spaceAfter=8,keepWithNext=True))
styles.add(ParagraphStyle(name='LLH3',fontName='LLBold',fontSize=11,leading=16,textColor=TEAL,spaceBefore=12,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='LLBody',fontName='LLRegular',fontSize=9.5,leading=14.8,textColor=INK,spaceAfter=7))
styles.add(ParagraphStyle(name='LLCell',fontName='LLRegular',fontSize=8,leading=11,textColor=INK))
styles.add(ParagraphStyle(name='LLNote',fontName='LLRegular',fontSize=9,leading=14,textColor=GRAY,spaceAfter=10))
def markup(s):
 s=escape(s).replace('₹','INR ').replace('→',' / ').replace('–','-').replace('—','-').replace('×','x')
 s=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s)
 s=re.sub(r'`([^`]+)`',r'<font face="LLMono">\1</font>',s)
 return s
story=[]
logo=REPO/'app/public/images/original-logo.png'
story += [Spacer(1,20),Image(str(logo),width=250,height=125),Spacer(1,42),Paragraph('Local Lanchers<br/>Version 2.1',styles['CoverTitleLL']),Paragraph('BUILD & COMPLETE DESIGN',styles['LLH3']),Paragraph('22 October 2026',styles['LLNote']),Spacer(1,25),Paragraph('Two versions. One clearer product. A complete modular build.',styles['LLH2']),Paragraph('Original Version 1 logo preserved. Useful Version 2 interactions retained. Grounded in the supplied business plan and verified in the browser.',styles['LLBody']),Spacer(1,20),Paragraph('<b>Implemented and verified locally.</b><br/>25 API checks, 20 browser checks and automated accessibility checks. Public deployment and provider connections remain separate launch steps.',styles['LLNote']),PageBreak()]
def add_markdown(path):
 lines=path.read_text().splitlines();i=0
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  if line.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):
    raw=[c.strip() for c in lines[i].strip().strip('|').split('|')]
    if not all(re.fullmatch(r'[:\- ]+',c) for c in raw):rows.append(raw)
    i+=1
   cols=max(len(r) for r in rows);widths=[475/cols]*cols
   if cols==3:widths=[102,174,199]
   elif cols==4:widths=[67,145,140,123]
   data=[[Paragraph(markup(c),styles['LLCell']) for c in row] for row in rows]
   t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
   t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e5f1ed')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,0),.8,TEAL),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#dbe2e4'))]))
   story.extend([t,Spacer(1,12)]);continue
  if line.startswith('### '):style=styles['LLH3'];line=line[4:]
  elif line.startswith('## '):style=styles['LLH2'];line=line[3:]
  elif line.startswith('# '):style=styles['LLH1'];line=line[2:]
  else:style=styles['LLBody']
  if line.startswith('- '):line='• '+line[2:]
  story.append(Paragraph(markup(line),style));i+=1
add_markdown(ROOT/'BUILD-AND-DESIGN.md')
story.append(PageBreak())
story.append(Paragraph('Complete design — actual application',styles['LLH1']))
story.append(Paragraph('The following images are captured from the implemented application. They are not generated interface mockups. Test identities appear only in the isolated verification flow.',styles['LLBody']))
from PIL import Image as PILImage
def shot(name,title,maxheight=295):
 path=ROOT/'verification'/name
 w,h=PILImage.open(path).size
 scale=min(475/w,maxheight/h)
 story.append(Paragraph(title,styles['LLH3']))
 story.append(Image(str(path),width=w*scale,height=h*scale))
 story.append(Spacer(1,14))
shot('01-home-desktop.png','1. Public homepage — original logo and immediate audit action')
shot('03-pillar-panel.png','2. Growth pillar — explicit selection and supplied sculpture artwork',230)
story.append(PageBreak())
shot('05-audit-review.png','3. Audit request — review before server-side storage')
shot('07-audit-saved.png','4. Audit request — confirmation after actual storage')
story.append(PageBreak())
shot('08-operations-desk.png','5. Private team desk — isolated test records only')
shot('workspace-final.png','6. Workspace — fictional data and explicit connection state')
story.append(PageBreak())
shot('industries-final.png','7. Industry playbooks')
shot('plans-final.png','8. Indicative plans, setup and recurring costs')
story.append(PageBreak())
story.append(Paragraph('Mobile design',styles['LLH1']))
story.append(Paragraph('390 × 844 CSS-pixel captures. Navigation, content and controls were exercised on mobile. The workspace navigation scrolls inside its own width; the page does not overflow.',styles['LLBody']))
ims=[]
for name in ['10-home-mobile.png','mobile-workspace-enquiries.png']:
 path=ROOT/'verification'/name
 ims.append(Image(str(path),width=220,height=220*844/390))
story.append(Table([ims],colWidths=[237.5,237.5],hAlign='LEFT'))
story.append(Spacer(1,17))
story.append(Paragraph('Left: public entry and visible primary action. Right: responsive workspace and local-demo notice.',styles['LLNote']))
story.append(PageBreak())
story.append(Paragraph('Version 2 to Version 2.1',styles['LLH1']))
shot('comparison-home-desktop.jpg','Source and implemented homepages, at matched viewport scale',220)
shot('comparison-navigation.jpg','Focused navigation comparison',130)
story.append(Paragraph('The original logo, simpler action hierarchy, generated editorial hero and clearer product claims are intentional changes. Warm surfaces, typography and interactive structure remain grounded in the supplied project.',styles['LLBody']))
story.append(PageBreak())
add_markdown(ROOT/'SOURCE-REVIEW.md')
def page(c,d):
 c.setStrokeColor(TEAL);c.setLineWidth(1);c.line(60,805,535,805)
 c.setFont('LLRegular',8);c.setFillColor(GRAY);c.drawString(60,820,'LOCAL LANCHERS  /  VERSION 2.1  /  BUILD & DESIGN')
 c.drawString(60,34,'Implemented locally / public launch requirements documented')
 c.drawRightString(535,34,str(d.page))
output=ROOT/'Local-Lanchers-Version-2.1-Build-and-Design.pdf'
doc=SimpleDocTemplate(str(output),pagesize=(595,842),rightMargin=60,leftMargin=60,topMargin=57,bottomMargin=55,title='Local Lanchers Version 2.1 — Build and Complete Design',author='Local Lanchers')
doc.build(story,onFirstPage=page,onLaterPages=page)
# Preserve the earlier download path as an alias to the completed document.
import shutil
shutil.copyfile(output,ROOT/'Local-Lanchers-Version-2.1-Blueprint.pdf')
print(output)
