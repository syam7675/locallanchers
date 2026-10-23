"""Browser validation of the production UI and an isolated operations test server.

Requires Python Playwright and Chromium. LL_BASE_URL defaults to 4173;
LL_OPS_TEST_URL defaults to a separately started test server on 4243.
Never point the operations test URL at a live business database.
"""
from pathlib import Path
import json,os,time
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/v2.1/verification';OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('LL_BASE_URL','http://127.0.0.1:4173')
OPS=os.environ.get('LL_OPS_TEST_URL','http://127.0.0.1:4243')
checks=[];errors=[];console_errors=[];expected_console_errors=[];network_fault={'active':False}
def passed(name):checks.append({'name':name,'passed':True});print('PASS',name,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1)
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:(expected_console_errors if network_fault['active'] and 'ERR_FAILED' in m.text else console_errors).append(m.text) if m.type=='error' else None)
 for route in ['/','/growth','/industries','/plans','/how-it-works','/audit','/workspace','/privacy','/build-notes','/ops']:
  response=page.goto(BASE+route,wait_until='networkidle');expect(page.locator('h1')).to_be_visible()
  assert response.status==200;assert page.evaluate('document.documentElement.scrollWidth')==1440
  assert page.locator('img').evaluate_all('(es)=>es.every(e=>e.complete&&e.naturalWidth>0)')
 passed('Production routes render without overflow or broken images')
 page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(700);page.screenshot(path=str(OUT/'01-home-desktop.png'))
 page.get_by_role('button',name='Solutions',exact=True).click();expect(page.locator('#mega-menu')).to_be_visible();page.screenshot(path=str(OUT/'02-mega-menu.png'))
 page.keyboard.press('Escape');expect(page.locator('#mega-menu')).not_to_be_visible();expect(page.get_by_role('button',name='Solutions',exact=True)).to_be_focused()
 passed('Desktop navigation opens, closes with Escape, and restores focus')
 page.get_by_role('tab',name='Get converted',exact=True).click();expect(page.locator('#pillar-panel')).to_contain_text('Make the next step feel effortless.')
 page.get_by_role('tab',name='Get converted',exact=True).press('ArrowRight');expect(page.get_by_role('tab',name='Bring customers back',exact=True)).to_have_attribute('aria-selected','true')
 page.locator('#pillar-panel').screenshot(path=str(OUT/'03-pillar-panel.png'))
 passed('Pillar tabs work by pointer and keyboard')
 page.goto(BASE+'/industries?industry=salon',wait_until='networkidle');expect(page.locator('#industry-panel')).to_contain_text('Make room for more meaningful bookings.')
 page.get_by_role('tab',name='Fitness studios',exact=True).click();expect(page.locator('#industry-panel')).to_contain_text('Turn local interest into a first visit.')
 passed('Industry links select the matching playbook')
 page.goto(BASE+'/how-it-works',wait_until='networkidle');page.get_by_role('tab',name='Your first 30 days').click();expect(page.locator('#process-panel')).to_contain_text('Understand your business');page.screenshot(path=str(OUT/'04-onboarding-desktop.png'))
 passed('Process switcher opens the first-month roadmap')
 page.goto(BASE+'/plans',wait_until='networkidle');page.get_by_role('link',name='Discuss Growth',exact=True).click();expect(page.locator('#audit-plan')).to_have_value('Growth')
 passed('Plan selection carries through to the audit request')
 page.goto(OPS+'/audit?plan=Growth',wait_until='networkidle');page.get_by_role('button',name='Continue',exact=True).click();expect(page.locator('#audit-businessName')).to_have_attribute('aria-invalid','true');expect(page.locator('#audit-businessName')).to_be_focused()
 passed('Audit form validates empty details and focuses the invalid field')
 page.locator('#audit-businessName').fill('V2.1 Verification Business');page.locator('#audit-vertical').select_option(label='Dental clinics');page.locator('#audit-city').fill('Hyderabad');page.locator('#audit-website').fill('https://example.test');page.locator('#audit-challenge').fill('Verification of a clear enquiry and follow-up process.');page.get_by_role('button',name='Continue',exact=True).click()
 expect(page.get_by_role('heading',name='How can we reach you?')).to_be_visible();page.locator('#audit-name').fill('Example Test Owner');page.locator('#audit-email').fill('owner@example.test');page.get_by_role('button',name='Continue',exact=True).click();expect(page.locator('#error-contactPermission')).to_be_visible();page.locator('#audit-contactPermission').check();page.get_by_role('button',name='Continue',exact=True).click()
 expect(page.get_by_role('heading',name='A quick check before we begin.')).to_be_visible();page.screenshot(path=str(OUT/'05-audit-review.png'))
 passed('Audit requires reply permission while marketing remains optional')
 network_fault['active']=True;page.route('**/api/audits',lambda route:route.abort());page.get_by_role('button',name='Save my audit request').click();expect(page.get_by_role('alert')).to_contain_text('couldn’t confirm');expect(page.locator('.audit-success')).to_have_count(0);expect(page.locator('.review-details')).to_contain_text('V2.1 Verification Business');page.screenshot(path=str(OUT/'06-audit-error.png'))
 passed('Network failure preserves details and never shows false success')
 network_fault['active']=False;page.unroute('**/api/audits');page.get_by_role('button',name='Save my audit request').click();expect(page.locator('.audit-success')).to_be_visible();expect(page.locator('.reference')).to_contain_text('LL-');page.screenshot(path=str(OUT/'07-audit-saved.png'))
 passed('Retry saves the audit and returns a real request reference')
 page.goto(OPS+'/ops',wait_until='networkidle');page.locator('#ops-password').fill(os.environ.get('LL_BROWSER_OPS_PASSWORD','test-only-password-123456'));page.get_by_role('button',name='Open the request desk').click();expect(page.get_by_role('heading',name='Conversations worth following up.')).to_be_visible();page.get_by_role('button').filter(has=page.get_by_text('V2.1 Verification Business',exact=True)).first.click();expect(page.locator('.request-detail')).to_contain_text('owner@example.test');page.locator('.request-detail select').select_option('Reviewing');page.locator('.request-detail textarea').fill('Verified local request intake and follow-up.');page.get_by_role('button',name='Save changes',exact=True).click();expect(page.get_by_text('Changes saved.',exact=True)).to_be_visible();page.reload(wait_until='networkidle');expect(page.get_by_role('heading',name='Conversations worth following up.')).to_be_visible();page.get_by_role('button').filter(has=page.get_by_text('V2.1 Verification Business',exact=True)).first.click();expect(page.locator('.request-detail textarea')).to_have_value('Verified local request intake and follow-up.');page.screenshot(path=str(OUT/'08-operations-desk.png'))
 passed('Private desk loads the saved request and retains updates after reload')
 with page.expect_download() as dl:page.get_by_role('button',name='Export CSV').click()
 assert dl.value.suggested_filename.endswith('.csv');passed('Private desk exports the authorized request list')
 page.get_by_role('button',name='Sign out',exact=True).click();expect(page.locator('#ops-password')).to_be_visible();passed('Team sign-out returns to the protected sign-in screen')
 page.goto(BASE+'/workspace?tab=enquiries',wait_until='networkidle');page.get_by_role('button',name='Reset demo').click();page.get_by_role('button',name='Add an example').click();page.get_by_label('Example name',exact=True).fill('Browser test example');page.get_by_label('Example message',exact=True).fill('A fictional enquiry for verification.');page.get_by_role('button',name='Add to demo',exact=True).click();row=page.locator('.enquiry-row').filter(has_text='Browser test example');row.get_by_role('button',name='Mark example booked').click();expect(row).to_contain_text('Booked');page.reload(wait_until='networkidle');expect(page.locator('.enquiry-row').filter(has_text='Browser test example')).to_contain_text('Booked');page.screenshot(path=str(OUT/'09-demo-enquiries.png'))
 passed('Demo enquiry changes persist locally and remain labeled fictional')
 page.get_by_role('button',name='Review drafts',exact=True).click();page.get_by_role('button',name='Create a template draft').first.click();page.get_by_role('textbox',name='Edit your template draft').fill('A test template saved in this demonstration.');page.get_by_role('button',name='Save demo reply',exact=True).click();expect(page.locator('.saved-reply').first).to_contain_text('A test template');passed('Review drafts save locally without publishing')
 page.get_by_role('button',name='Onboarding',exact=True).click();page.locator('.onboarding-task input').first.check();expect(page.get_by_role('progressbar',name='Demo onboarding progress')).to_have_attribute('value','1');page.get_by_role('button',name='Reset demo').click();expect(page.get_by_role('progressbar',name='Demo onboarding progress')).to_have_attribute('value','0');passed('Onboarding checklist and demo reset work')
 page.set_viewport_size({'width':390,'height':844});page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(700);page.screenshot(path=str(OUT/'10-home-mobile.png'));page.get_by_role('button',name='Open navigation',exact=True).click();expect(page.locator('#mobile-nav')).to_be_visible();page.screenshot(path=str(OUT/'11-mobile-menu.png'));page.locator('#mobile-nav').get_by_role('link',name='Plans',exact=True).click();expect(page.get_by_role('heading',name='The right next step. At the right stage.')).to_be_visible();expect(page.locator('#mobile-nav')).to_have_count(0);passed('Mobile navigation opens and changes routes')
 for route in ['/growth','/industries','/plans','/how-it-works','/audit','/workspace?tab=enquiries','/workspace?tab=reviews','/workspace?tab=onboarding','/ops']:
  page.goto(BASE+route,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth')==390,route
  name=route.strip('/').replace('?tab=','-') or 'home';page.screenshot(path=str(OUT/f'mobile-{name}.png'))
 passed('Mobile routes and workspace tabs fit at 390px without horizontal overflow')
 page.emulate_media(reduced_motion='reduce');page.goto(BASE+'/growth',wait_until='networkidle');expect(page.locator('#pillar-panel')).to_be_visible();page.get_by_role('tab',name='Get converted',exact=True).click();expect(page.locator('#pillar-panel')).to_contain_text('Make the next step feel effortless.');passed('Reduced-motion mode keeps core content and interactions available')
 page.goto(BASE+'/workspace',wait_until='networkidle');page.get_by_role('button',name='Reset demo').click()
 browser.close()
assert not errors,errors
assert not console_errors,console_errors
passed('Browser runtime and console checks are clear')
(OUT/'browser-checks.json').write_text(json.dumps({'checks':checks,'passed':len(checks),'pageErrors':errors,'consoleErrors':console_errors,'expectedNetworkFaultConsoleErrors':expected_console_errors,'productionBase':BASE,'isolatedOperationsBase':OPS},indent=2))
print('Browser checks passed:',len(checks),flush=True)
