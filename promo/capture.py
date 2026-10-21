"""Capture authentic public website assets; never submit forms."""
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(__file__).parent/'assets'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=2)
    page.goto('https://locallanchers.vercel.app',wait_until='networkidle')
    page.wait_for_timeout(1000)
    (OUT/'site-text.txt').write_text(page.locator('body').inner_text())
    for name,sel in [('hero','#home'),('growth','#why-us'),('services','#services'),('industries','#industries'),('process','section:has-text("A clear process, start to finish.")'),('contact','#contact')]:
        page.locator(sel).first.evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-90,behavior:"instant"})')
        page.mouse.move(10,10);page.wait_for_timeout(900)
        page.screenshot(path=str(OUT/(name+'.png')))
    page.locator('#why-us').evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-90,behavior:"instant"})')
    page.wait_for_timeout(900)
    for name,x in [('found',260),('converted',565),('retention',870)]:
        page.mouse.move(x,550);page.wait_for_timeout(700)
        page.screenshot(path=str(OUT/(name+'.png')))
    browser.close()
