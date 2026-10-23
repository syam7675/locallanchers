"""Record an actual local UI walkthrough, not a simulated product video."""
from pathlib import Path
import os,subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/v2.1';BASE=os.environ.get('LL_BASE_URL','http://127.0.0.1:4173')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=b.new_context(viewport={'width':1440,'height':900},record_video_dir='/tmp/ll-v21-walkthrough',record_video_size={'width':1440,'height':900})
 page=context.new_page();page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(2600)
 page.get_by_role('button',name='Solutions',exact=True).click();page.wait_for_timeout(1500);page.keyboard.press('Escape')
 page.locator('#growth-system').scroll_into_view_if_needed();page.wait_for_timeout(1300);page.get_by_role('tab',name='Get converted',exact=True).click();page.wait_for_timeout(1300);page.get_by_role('tab',name='Bring customers back',exact=True).click();page.wait_for_timeout(1300)
 page.goto(BASE+'/industries?industry=salon',wait_until='networkidle');page.locator('#industry-panel').scroll_into_view_if_needed();page.wait_for_timeout(1900);page.get_by_role('tab',name='Fitness studios',exact=True).click();page.wait_for_timeout(1500)
 page.goto(BASE+'/plans',wait_until='networkidle');page.locator('.plans-grid').scroll_into_view_if_needed();page.wait_for_timeout(2400);page.get_by_role('link',name='Discuss Growth',exact=True).click();page.wait_for_timeout(1400)
 page.locator('#audit-businessName').fill('Example local business');page.locator('#audit-vertical').select_option(label='Dental clinics');page.locator('#audit-city').fill('Hyderabad');page.wait_for_timeout(700);page.get_by_role('button',name='Continue',exact=True).click();page.locator('#audit-name').fill('Example business owner');page.locator('#audit-email').fill('owner@example.test');page.locator('#audit-contactPermission').check();page.get_by_role('button',name='Continue',exact=True).click();page.wait_for_timeout(2100)
 page.goto(BASE+'/workspace?tab=enquiries',wait_until='networkidle');page.get_by_role('button',name='Reset demo').click();page.wait_for_timeout(1400);page.get_by_role('button',name='Mark example qualified').first.click();page.wait_for_timeout(1500);page.get_by_role('button',name='Review drafts',exact=True).click();page.get_by_role('button',name='Create a template draft').first.click();page.wait_for_timeout(1800);page.get_by_role('button',name='Growth overview',exact=True).click();page.wait_for_timeout(1800);page.get_by_role('button',name='Reset demo').click()
 page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(2200)
 video=page.video;context.close();source=video.path();b.close()
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(OUT/'visual-walkthrough.mp4')],check=True)
print(OUT/'visual-walkthrough.mp4')
