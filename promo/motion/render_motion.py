"""Render deterministic HTML motion graphics through Chromium and FFmpeg."""
from pathlib import Path
import argparse, functools, http.server, json, math, subprocess, threading
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def run(preview=False):
    timing=json.loads((ROOT/'timing.json').read_text());duration=timing['duration'];frames=math.ceil(duration*30)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--hide-scrollbars','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda err: errors.append(str(err)))
        page.goto(f'http://127.0.0.1:{server.server_port}/index.html',wait_until='networkidle')
        page.evaluate('() => window.ready')
        page.evaluate('''async()=>{await Promise.all(['converted-crop.png','retention-crop.png'].map(async name=>{let im=new Image();im.src='assets/'+name;await im.decode()}))}''')
        if preview:
            thumbs=[]
            for scene in timing['scenes']:
                t=scene['start']+min(scene['duration']*.62,scene['duration']-.3)
                page.evaluate('(t)=>setTime(t)',t)
                name=ROOT/f'scene-{scene["index"]+1:02d}.png'
                page.screenshot(path=str(name))
                thumbs.append(Image.open(name).resize((640,360)))
            sheet=Image.new('RGB',(1920,1080))
            for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*360))
            sheet.save(ROOT/'design-review.jpg',quality=94)
        else:
            proc=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-threads','4','-pix_fmt','yuv420p','-movflags','+faststart',str(ROOT/'picture.mp4')],stdin=subprocess.PIPE)
            try:
                for i in range(frames):
                    page.evaluate('(t)=>setTime(t)',i/30)
                    jpg=page.screenshot(type='jpeg',quality=95,animations='allow')
                    proc.stdin.write(jpg)
                    if i%150==0:print(f'Rendered {i/30:.0f}/{duration:.1f}s',flush=True)
            finally:proc.stdin.close()
            if proc.wait()!=0:raise RuntimeError('FFmpeg picture render failed')
        browser.close();server.shutdown()
        if errors:raise RuntimeError('Browser errors: '+repr(errors))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--preview',action='store_true');args=p.parse_args();run(args.preview)
