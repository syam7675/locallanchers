"""Actual V2.2 browser walkthrough; account segment uses isolated QA storage."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import subprocess,uuid,os
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/v2.2';BASE=os.environ.get('LL_V22_TEST_URL','http://127.0.0.1:4244')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 ctx=b.new_context(viewport={'width':1440,'height':1000},record_video_dir='/tmp/ll-v22-video',record_video_size={'width':1440,'height':1000})
 page=ctx.new_page()
 def caption(title,detail):
  page.evaluate('''([title,detail])=>{let el=document.getElementById('walkthrough-caption');if(!el){el=document.createElement('div');el.id='walkthrough-caption';el.style.cssText='position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:99999;background:#103c34f5;color:white;border:1px solid #69806a;border-radius:14px;padding:14px 28px;box-shadow:0 8px 35px #0003;font:14px "DM Sans",sans-serif;display:flex;align-items:center;gap:20px;max-width:94%;pointer-events:none;';document.body.append(el);}el.replaceChildren();let tag=document.createElement('strong');tag.textContent=title;tag.style.cssText='color:#d8eac6;white-space:nowrap';let text=document.createElement('span');text.textContent=detail;el.append(tag,text);}''',[title,detail])
 def pause(ms=1600):page.wait_for_timeout(ms)
 def goto(path,title,detail):page.goto(BASE+path,wait_until='networkidle');caption(title,detail);pause(900)
 goto('/','LOCAL LANCHERS 2.2','A new visual direction. Original logo, same navigation.');pause(1600)
 page.mouse.move(380,360);page.mouse.move(1040,450,steps=8);pause(1200)
 page.get_by_role('button',name='Solutions',exact=True).click();caption('FAMILIAR NAVIGATION','Your existing pages and growth pillars remain in place.');pause(1600);page.keyboard.press('Escape')
 goto('/workspace','ACTIVITY OVERVIEW','Fictional demo profiles + your practice actions.');page.get_by_role('grid').scroll_into_view_if_needed();pause(2000)
 page.get_by_label('Date range',exact=True).select_option('365');caption('CHOOSE YOUR RANGE','Explore 30, 90 or 365 days. Each square represents one day.');pause(1800)
 page.get_by_label('Date range',exact=True).select_option('90');page.get_by_label('Show',exact=True).select_option('arun');caption('FILTER BY PERSON','See a profile’s history, daily activity band and latest actions.');pause(1600)
 page.get_by_role('gridcell').nth(50).click();pause(1200);page.locator('.activity-lower').scroll_into_view_if_needed();pause(1900)
 page.get_by_role('button',name='Clear day',exact=True).click();page.get_by_label('Act as',exact=True).select_option('arun')
 page.get_by_role('button',name='Enquiry desk',exact=True).click();caption('DO THE WORK','Practice an enquiry action. No customer is contacted.');pause(1000);page.get_by_role('button',name='Mark example qualified',exact=True).first.click();pause(1300)
 page.get_by_role('button',name='Growth overview',exact=True).click();page.get_by_label('Show',exact=True).select_option('arun');page.locator('.activity-lower').scroll_into_view_if_needed();caption('SEE THE ACTIVITY','The selected demo profile’s history updates immediately.');pause(2200)
 page.get_by_role('button',name='My real activity',exact=True).click();caption('FULL SERVER DEMONSTRATION','The next steps use an isolated test account, not public-preview storage.');page.locator('.account-panel').scroll_into_view_if_needed();pause(2500)
 page.get_by_role('button',name='Create an account',exact=True).click();page.get_by_label('Your name',exact=True).fill('Walkthrough Example');email='walkthrough-'+uuid.uuid4().hex+'@example.test';pw='walkthrough-test-only-123'
 page.get_by_label('Email',exact=True).fill(email);page.get_by_label('Password',exact=True).fill(pw);page.locator('input[name=consent]').check();caption('CREATE A PRIVATE ACCOUNT','A password and explicit agreement to record workspace activity.');pause(1900);page.get_by_role('button',name='Create account',exact=True).click();expect(page.get_by_text('Signed in as Walkthrough Example',exact=True)).to_be_visible();page.get_by_role('grid').scroll_into_view_if_needed();caption('YOUR HISTORY STARTS HERE','A successful sign-in creates the first real account event.');pause(2400)
 page.get_by_role('button',name='Onboarding',exact=True).click();page.locator('.onboarding-task input').first.check();caption('RECORD AN INTERACTION','Checklist usage is recorded; it is not a completed customer onboarding.');pause(1600)
 page.get_by_role('button',name='Growth overview',exact=True).click();page.locator('.activity-lower').scroll_into_view_if_needed();caption('PRIVATE ACTIVITY RANGE','Only this account’s events. Daily bands describe action counts.');pause(2300)
 page.get_by_role('button',name='Sign out',exact=True).click();page.get_by_label('Email',exact=True).fill(email);page.get_by_label('Password',exact=True).fill(pw);caption('SIGN BACK IN','Your server-saved history stays with your account.');pause(1200);page.get_by_role('button',name='Sign in',exact=True).click();expect(page.get_by_text('Signed in as Walkthrough Example',exact=True)).to_be_visible();page.locator('.activity-lower').scroll_into_view_if_needed();pause(2000)
 page.get_by_role('button',name='Delete account',exact=True).click();page.get_by_role('button',name='Confirm deletion',exact=True).click()
 goto('/','LOCAL LANCHERS 2.2','Interactive preview available. Real accounts require persistent hosting.');pause(2800)
 video=page.video;ctx.close();source=video.path();b.close()
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(OUT/'Local-Lanchers-v2.2-Walkthrough.mp4')],check=True)
print(OUT/'Local-Lanchers-v2.2-Walkthrough.mp4',flush=True)
