"""Automated WCAG A/AA checks on representative rendered routes; not a compliance certification."""
from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];APP=ROOT/'app';OUT=ROOT/'docs/v2.1/verification';OUT.mkdir(parents=True,exist_ok=True)
base=os.environ.get('LL_BASE_URL','http://127.0.0.1:4173')
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 for route in ['/','/audit','/plans','/workspace','/workspace?tab=enquiries','/workspace?tab=reviews','/ops','/privacy']:
  page.goto(base+route,wait_until='networkidle');page.evaluate('document.fonts.ready');page.add_script_tag(path=str(APP/'node_modules/axe-core/axe.min.js'))
  r=page.evaluate('''async()=>{let r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,impact:v.impact}))}}''')
  results.append({'route':route,**r});print(route,'violations',len(r['violations']),flush=True)
 b.close()
(OUT/'accessibility-checks.json').write_text(json.dumps({'engine':'axe-core','scope':'representative desktop routes, automated WCAG A/AA rules only','results':results},indent=2))
if any(r['violations'] for r in results):raise SystemExit('Accessibility violations need review; see report.')
print('No automated A/AA violations on checked routes.',flush=True)
