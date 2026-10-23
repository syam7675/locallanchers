"""V2.2 browser checks. Run only against an isolated database with accounts enabled."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,uuid,os
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/v2.2/verification';BASE=os.environ.get('LL_V22_TEST_URL','http://127.0.0.1:4244');checks=[];errors=[];a11y=[]
def passed(s):checks.append(s);print('PASS',s,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce');page.on('pageerror',lambda e:errors.append(str(e)))
 for route in ['/','/growth','/industries','/plans','/how-it-works','/audit','/workspace','/ops','/privacy','/build-notes']:
  r=page.goto(BASE+route,wait_until='networkidle');expect(page.locator('h1')).to_be_visible();assert r.status==200;assert page.evaluate('document.documentElement.scrollWidth')==1440
 passed('All existing routes render at desktop width')
 page.goto(BASE+'/workspace',wait_until='networkidle');page.get_by_role('button',name='Reset demo',exact=True).click()
 page.get_by_label('Date range').select_option('30');expect(page.get_by_role('grid')).to_have_attribute('aria-label','Demo activity over 30 days');assert page.get_by_role('gridcell').count()==30
 page.get_by_label('Date range').select_option('365');assert page.get_by_role('gridcell').count()==365
 page.get_by_label('Date range').select_option('90');page.get_by_label('Show',exact=True).select_option('maya');passed('Range and user filters update calendar')
 cell=page.get_by_role('gridcell').last;cell.focus();page.keyboard.press('ArrowLeft');page.keyboard.press('Enter');expect(page.get_by_role('button',name='Clear day',exact=True)).to_be_visible();page.get_by_role('button',name='Clear day',exact=True).click();passed('Calendar supports keyboard movement and selection')
 count=int(page.locator('.activity-metrics strong').first.inner_text().replace(',',''))
 page.get_by_role('button',name='Enquiry desk',exact=True).click();page.get_by_role('button',name='Mark example qualified',exact=True).first.click();page.get_by_role('button',name='Growth overview',exact=True).click();page.get_by_label('Show',exact=True).select_option('maya');assert int(page.locator('.activity-metrics strong').first.inner_text().replace(',',''))>count;passed('Practice actions update the active demo profile')
 page.get_by_role('button',name='My real activity',exact=True).click();page.get_by_role('button',name='Create an account',exact=True).click()
 email='browser-'+uuid.uuid4().hex+'@example.test';password='test-only-passphrase-123'
 page.get_by_label('Your name',exact=True).fill('Example QA Owner');page.get_by_label('Email',exact=True).fill(email);page.get_by_label('Password',exact=True).fill(password);page.locator('input[name=consent]').check();page.get_by_role('button',name='Create account',exact=True).click();expect(page.get_by_text('Signed in as Example QA Owner',exact=True)).to_be_visible();expect(page.locator('.activity-metrics strong').first).to_have_text('1');passed('Account registration starts a private history with a sign-in event')
 page.get_by_role('button',name='Onboarding',exact=True).click();page.locator('.onboarding-task input').first.check();page.get_by_role('button',name='Growth overview',exact=True).click();page.wait_for_timeout(500);expect(page.locator('.activity-metrics strong').first).to_have_text('4');page.get_by_role('grid').scroll_into_view_if_needed();page.screenshot(path=str(OUT/'real-account-activity.png'));passed('Authenticated feature actions appear in the real activity range')
 page.get_by_role('button',name='Sign out',exact=True).click();expect(page.get_by_role('heading',name='Welcome back.',exact=True)).to_be_visible();page.get_by_label('Email',exact=True).fill(email);page.get_by_label('Password',exact=True).fill(password);page.get_by_role('button',name='Sign in',exact=True).click();expect(page.locator('.activity-metrics strong').first).to_have_text('5');passed('Sign-out and sign-in preserve history and count successful logins')
 page.get_by_role('button',name='Clear history',exact=True).click();page.get_by_role('button',name='Confirm clear',exact=True).click();expect(page.locator('.activity-metrics strong').first).to_have_text('0');page.get_by_role('button',name='Delete account',exact=True).click();page.get_by_role('button',name='Confirm deletion',exact=True).click();expect(page.get_by_role('button',name='Sign in',exact=True)).to_be_visible();passed('History clearing and account deletion work')
 for width in [390,768,1440]:
  page.set_viewport_size({'width':width,'height':1000})
  for route in ['/','/workspace','/workspace?tab=enquiries','/workspace?tab=reviews','/workspace?tab=onboarding']:
   page.goto(BASE+route,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth')==width,(width,route)
  passed('Responsive routes fit '+str(width)+'px')
 for route in ['/','/workspace','/audit','/privacy']:
  page.goto(BASE+route,wait_until='networkidle');page.add_script_tag(path=str(ROOT/'app/node_modules/axe-core/axe.min.js'));result=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}");a11y.append({'route':route,'violations':result});print('AXE',route,len(result),flush=True)
 page.goto(BASE+'/workspace',wait_until='networkidle');page.get_by_role('grid').scroll_into_view_if_needed();page.wait_for_timeout(1200);page.screenshot(path=str(OUT/'heatmap-desktop.png'))
 b.close()
(OUT/'browser-checks.json').write_text(json.dumps({'checks':checks,'errors':errors,'accessibility':a11y},indent=2))
assert not errors,errors
assert not any(r['violations'] for r in a11y),'Review accessibility report'
