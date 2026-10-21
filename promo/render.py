"""Editable, deterministic 54-second Local Lanchers promo. Pillow + NumPy + FFmpeg."""
from pathlib import Path
import argparse, math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT=Path(__file__).resolve().parent
W,H,FPS,DURATION=1920,1080,30,54
NAVY=(7,21,37); WHITE=(242,247,252); MUTED=(153,176,195); TEAL=(12,218,178); BLUE=(52,116,255)
FONTS='/usr/share/fonts/truetype/dejavu/'
fonts={}
def font(size,bold=False):
    key=(size,bold)
    if key not in fonts: fonts[key]=ImageFont.truetype(FONTS+('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'),size)
    return fonts[key]
def ease(x):
    x=max(0,min(1,x)); return 1-(1-x)**3
Y,X=np.mgrid[0:H,0:W]
glow=np.exp(-(((X-1550)/1050)**2+((Y-350)/800)**2))
glow2=np.exp(-(((X-250)/600)**2+((Y-1100)/600)**2))
a=np.zeros((H,W,3),dtype=np.uint8)
for c,v in enumerate(NAVY): a[:,:,c]=np.clip(v+glow*[1,17,26][c]+glow2*[0,12,12][c],0,255)
BG=Image.fromarray(a)
assets={p.stem:Image.open(p).convert('RGB') for p in (ROOT/'assets').glob('*.png') if p.stem not in ['brand-logo','home','logo']}
logo=Image.open(ROOT/'assets/brand-logo.png').convert('RGBA')
logo=logo.crop(logo.getbbox())
def txt(im,s,x,y,size=32,color=WHITE,bold=False):
    ImageDraw.Draw(im).text((int(x),int(y)),s,font=font(size,bold),fill=color)
def lines(im,ss,x,y,size=72,color=WHITE,gap=1.16):
    for i,s in enumerate(ss):txt(im,s,x,y+i*size*gap,size,color,True)
def base(t,index):
    im=BG.copy();d=ImageDraw.Draw(im)
    d.line((100,100,1820,100),fill=(40,65,81),width=1)
    txt(im,'LOCAL LANCHERS',100,50,23,WHITE,True)
    txt(im,'DIGITAL GROWTH / LOCAL BUSINESS',1280,53,19,MUTED)
    d.line((100,1000,1820,1000),fill=(40,65,81),width=2)
    d.line((100,1000,100+1720*t/DURATION,1000),fill=TEAL,width=3)
    txt(im,f'{index+1:02d} / 08',100,1021,17,MUTED)
    txt(im,'DISCOVER  /  CONVERT  /  GROW',1400,1021,17,MUTED)
    return im

def screen(im,asset,box,zoom=1.0,crop=None):
    src=assets[asset]
    if crop:
        scale=src.width/1440
        src=src.crop(tuple(int(v*scale) for v in crop))
    x,y,w,h=map(int,box)
    # Preserve aspect ratio; fit inside the requested bounds.
    r=min(w/src.width,h/src.height)*zoom
    sw,sh=round(src.width*r),round(src.height*r)
    scaled=src.resize((sw,sh),Image.Resampling.LANCZOS)
    cx=x+(w-sw)//2;cy=y+(h-sh)//2
    radius=38 if asset in ['found','converted','retention','growth'] and crop else 14
    mask=Image.new('L',(sw,sh),0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,sw-1,sh-1),radius=radius,fill=255)
    im.paste(scaled,(cx,cy),mask)
    ImageDraw.Draw(im).rounded_rectangle((cx-1,cy-1,cx+sw,cy+sh),radius=radius,outline=(63,94,114),width=2)

def pill(im,s,x,y,w):
    d=ImageDraw.Draw(im);d.rounded_rectangle((x,y,x+w,y+54),radius=27,fill=(15,54,63),outline=(25,100,100))
    txt(im,s,x+22,y+13,21,TEAL)

def logo_panel(im,x,y,w):
    h=round(w*logo.height/logo.width)
    l=logo.resize((w,h),Image.Resampling.LANCZOS)
    ImageDraw.Draw(im).rounded_rectangle((x-34,y-22,x+w+34,y+h+22),radius=20,fill=(247,250,253))
    im.paste(l,(x,y),l)

STARTS=[0,5,10,17,24,31,38,46,54]
def scene(idx,t):
    local=t-STARTS[idx];dur=STARTS[idx+1]-STARTS[idx];p=max(0,min(1,local/dur));e=ease(local/1.1)
    im=base(t,idx);d=ImageDraw.Draw(im);dy=round((1-e)*42)
    if idx==0:
        txt(im,'YOUR NEXT CUSTOMER IS SEARCHING.',104,196+dy,25,TEAL,True)
        lines(im,['Your local business','deserves to','be found.'],100,280+dy,105)
        d.line((105,700,105+int(640*ease((local-.4)/1.4)),700),fill=TEAL,width=7)
        txt(im,'Make the journey from discovery to return.',105,766+dy,31,MUTED)
        for k,r in enumerate([160,235,310]):
            d.ellipse((1490-r,520-r,1490+r,520+r),outline=(18,61+k*10,77+k*11),width=2)
        theta=local*.65
        xx=1490+235*math.cos(theta);yy=520+235*math.sin(theta)
        d.ellipse((xx-9,yy-9,xx+9,yy+9),fill=TEAL)
        d.ellipse((1435,465,1545,575),outline=TEAL,width=7);d.line((1527,560,1580,612),fill=TEAL,width=8)
    elif idx==1:
        txt(im,'THE OPPORTUNITY',100,190+dy,24,TEAL,True)
        lines(im,['They search. They enquire.','Give them a reason to return.'],100,270+dy,66)
        items=[('01','DISCOVERY','Can they find you?'),('02','CONVERSION','Can they reach you?'),('03','RETENTION','Will they come back?')]
        for k,(n,title,sub) in enumerate(items):
            x=100+k*585;yy=540+int((1-ease((local-.3-k*.22)/.8))*65)
            d.rounded_rectangle((x,yy,x+550,yy+290),radius=20,fill=(12,37,53),outline=(29,75,87),width=2)
            txt(im,n,x+35,yy+28,30,TEAL)
            txt(im,title,x+35,yy+105,29,WHITE,True)
            txt(im,sub,x+35,yy+190,27,MUTED)
    elif idx==2:
        txt(im,'MEET YOUR DIGITAL GROWTH PARTNER',100,160+dy,24,TEAL,True)
        lines(im,['Local Lanchers.'],100,211+dy,76)
        screen(im,'hero',(140,338+dy,1640,575),1+.015*p,crop=(0,110,1440,790))
    elif idx in [3,4,5]:
        k=idx-3
        title=[['Get found.'],['Turn enquiries','into conversations.'],['Bring customers','back.']][k]
        label=['01 / VISIBILITY','02 / CONVERSION','03 / RETENTION'][k]
        points=[['Google Business Profile','Local SEO & website SEO','Content & business listings'],['Websites & WhatsApp','Lead forms & booking','AI website assistant'],['Automated follow-ups','Review requests & rebooking','Offers & referrals']][k]
        txt(im,label,100,220+dy,24,TEAL,True)
        lines(im,title,100,300+dy,65)
        for j,s in enumerate(points):
            yy=545+j*74+dy
            d.ellipse((104,yy+12,114,yy+22),fill=TEAL)
            txt(im,s,138,yy,29,MUTED)
        pill(im,'Explore the services',100,836,290)
        crop=[(119,402,406,704),(424,402,711,704),(729,402,1016,704)][k]
        # Actual before/after hover captures, with a corresponding pointer movement.
        asset=['found','converted','retention'][k] if local>1.5 else 'growth'
        screen(im,asset,(1100,220+dy,620,650),1+.025*p,crop=crop)
        cx=1740-180*ease((local-.5)/1.0);cy=880-140*ease((local-.5)/1.0)
        d=ImageDraw.Draw(im);d.polygon([(cx,cy),(cx+4,cy+35),(cx+13,cy+25),(cx+29,cy+28)],fill=WHITE,outline=NAVY)
        txt(im,'ACTUAL WEBSITE / SERVICE CARD',1100,919,17,MUTED)
    elif idx==6:
        txt(im,'ONE CONNECTED APPROACH',100,180+dy,24,TEAL,True)
        lines(im,['Human strategy.','AI execution.','Managed growth.'],100,265+dy,71)
        txt(im,'Built for local, in-person businesses.',105,650+dy,29,MUTED)
        for k,s in enumerate(['AUDIT','PLAN','BUILD','LAUNCH','MEASURE','IMPROVE']):
            x=105+(k%3)*240;yy=752+(k//3)*72
            txt(im,f'{k+1:02d}',x,yy,18,TEAL)
            txt(im,s,x+40,yy-2,20,WHITE,True)
        screen(im,'industries',(1000,220,800,630),1+.02*p,crop=(110,105,1325,850))
    else:
        logo_panel(im,720,180+dy,480)
        s='Let’s grow your local business.'
        tw=ImageDraw.Draw(im).textlength(s,font=font(65,True))
        txt(im,s,(W-tw)/2,500+dy,65,WHITE,True)
        s='Visibility. Enquiries. Repeat customers.'
        tw=ImageDraw.Draw(im).textlength(s,font=font(32))
        txt(im,s,(W-tw)/2,603+dy,32,MUTED)
        d.rounded_rectangle((635,706+dy,1285,784+dy),radius=39,fill=TEAL)
        txt(im,'Start a conversation',709,722+dy,36,NAVY,True)
        s='locallanchers.vercel.app';tw=d.textlength(s,font=font(32))
        txt(im,s,(W-tw)/2,840+dy,32,WHITE)
    return im

def frame(t):
    idx=max(i for i in range(8) if t>=STARTS[i])
    im=scene(idx,t)
    if idx>0 and t-STARTS[idx]<.45:
        im=Image.blend(scene(idx-1,t),im,ease((t-STARTS[idx])/.45))
    fade=min(1,t/.55,(DURATION-t)/.8)
    if fade<1: im=Image.blend(Image.new('RGB',(W,H),NAVY),im,max(0,fade))
    return im

def audio():
    sr=48000;n=sr*DURATION;mix=np.zeros(n,dtype=np.float64)
    def add(start,dur,freq,amp,pluck=False):
        count=int(dur*sr);t=np.arange(count)/sr
        env=np.minimum(t/.12,1)*np.minimum((dur-t)/.7,1)
        if pluck:env=np.minimum(t/.008,1)*np.exp(-t*4)
        tone=(np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*2*t)+.06*np.sin(2*np.pi*freq*3*t))*env*amp
        pos=int(start*sr);end=min(n,pos+count)
        if end>pos:mix[pos:end]+=tone[:end-pos]
    chords=[[146.83,220,293.66,349.23],[130.81,196,261.63,329.63],[174.61,220,261.63,349.23],[130.81,196,293.66,392]]
    for bar,start in enumerate(np.arange(0,54,4)):
        chord=chords[bar%4]
        for f in chord:add(start,4.5,f,.032)
        add(start,3.8,chord[0]/2,.07)
        for j in range(8):add(start+j*.5,1.3,chord[[0,2,1,3,2,1,3,2][j]]*2,.045,True)
    for start in np.arange(0,52,.5):
        dur=.18;t=np.arange(int(sr*dur))/sr
        kick=np.sin(2*np.pi*(48*t+8*(1-np.exp(-t*32))))*np.exp(-t*24)*.09
        pos=int(start*sr);mix[pos:pos+len(kick)]+=kick
    for start in STARTS[1:-1]:
        rng=np.random.default_rng(int(start));dur=.5;t=np.arange(int(sr*dur))/sr
        noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(32)/32,mode='same')
        mix[int((start-.4)*sr):int((start-.4)*sr)+len(t)]+=noise*np.sin(np.pi*t/dur)**2*.10
    tm=np.arange(n)/sr;mix*=np.minimum(tm/2,1)*np.minimum((DURATION-tm)/2.4,1)
    left=mix.copy();right=mix.copy();delay=int(.23*sr)
    left[delay:]+=.16*mix[:-delay];right[delay*2:]+=.13*mix[:-delay*2]
    stereo=np.stack([left,right],axis=1);stereo*=.72/max(.72,np.abs(stereo).max())
    with wave.open(str(ROOT/'music.wav'),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((stereo*32767).astype('<i2').tobytes())

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--preview',action='store_true');args=parser.parse_args()
    if args.preview:
        thumbs=[]
        for i,t in enumerate([2.5,7.5,13.5,20.5,27.5,34.5,42,50]):
            im=frame(t);im.save(ROOT/f'preview_{i+1:02d}.jpg',quality=92);thumbs.append(im.resize((640,360)))
        contact=Image.new('RGB',(1280,1440))
        for i,im in enumerate(thumbs):contact.paste(im,((i%2)*640,(i//2)*360))
        contact.save(ROOT/'contact-sheet.jpg',quality=92)
    else:
        audio()
        cmd=['ffmpeg','-y','-v','warning','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(ROOT/'music.wav'),'-c:v','libx264','-preset','fast','-crf','19','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-t',str(DURATION),str(ROOT/'final_promo.mp4')]
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
        try:
            for i in range(DURATION*FPS):
                proc.stdin.write(frame(i/FPS).tobytes())
                if i%(FPS*5)==0: print(f'Rendered {i//FPS}/{DURATION}s',flush=True)
        finally:proc.stdin.close()
        if proc.wait()!=0:raise SystemExit('FFmpeg failed')
        print('Finished final_promo.mp4',flush=True)
