"""Original stereo score and transition sounds, independent of speech service."""
from pathlib import Path
import json
import numpy as np
from scipy.io.wavfile import write
ROOT=Path(__file__).resolve().parent
timing=json.loads((ROOT/'timing.json').read_text());sr=48000;duration=timing['duration'];n=int(np.ceil(duration*sr));music=np.zeros((n,2),np.float64)
rng=np.random.default_rng(90210)
def put(start,tone,pan=0):
 pos=round(start*sr);end=min(n,pos+len(tone))
 if pos<0 or end<=pos:return
 v=tone[:end-pos]
 music[pos:end,0]+=v*np.sqrt((1-pan)/2)
 music[pos:end,1]+=v*np.sqrt((1+pan)/2)
# D minor / B-flat / F / C: warm suspended harmonic bed, long tails.
chords=[[146.832,220,293.665,349.228],[116.541,174.614,233.082,293.665],[130.813,174.614,261.626,349.228],[130.813,195.998,261.626,391.995]]
beat=60/104
for bar,start in enumerate(np.arange(0,duration,beat*8)):
 ch=chords[bar%4]
 for j,f in enumerate(ch):
  dur=beat*9;t=np.arange(round(sr*dur))/sr
  env=np.minimum(t/.8,1)*np.minimum((dur-t)/1.5,1)
  tone=(np.sin(2*np.pi*f*t)+.17*np.sin(2*np.pi*(f*2+.18)*t))*env*.055
  put(start,tone,(j-1.5)/2.3)
 for step in range(8):
  dur=1.35;t=np.arange(round(sr*dur))/sr;f=ch[[0,2,1,3,2,1,3,2][step]]*2
  tone=(np.sin(2*np.pi*f*t)+.20*np.sin(2*np.pi*f*3*t))*np.minimum(t/.006,1)*np.exp(-t*4.3)*.065
  put(start+step*beat,tone,(-1 if step%2 else 1)*.38)
for i,start in enumerate(np.arange(0,duration-2,beat)):
 t=np.arange(round(sr*.28))/sr
 kick=np.sin(2*np.pi*(46*t+1.6*(1-np.exp(-t*35))))*np.exp(-t*18)*.12
 put(start,kick)
 if i%2:
  t=np.arange(round(sr*.09))/sr
  noise=rng.normal(0,1,len(t));noise=np.r_[0,np.diff(noise)]
  put(start,noise*np.exp(-t*65)*.009,.3)
for scene in timing['scenes'][1:]:
 start=scene['start'];t=np.arange(round(sr*.55))/sr
 noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(20)/20,mode='same')
 put(max(0,start-.35),noise*np.sin(np.pi*t/.55)**2*.12,-.3)
t=np.arange(n)/sr;music*= (np.minimum(t/1.4,1)*np.minimum((duration-t)/1.8,1))[:,None]
write(ROOT/'score.wav',sr,(np.clip(music,-1,1)*32767).astype(np.int16))
# Captions carry each generated scene's exact speech interval.
def tc(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}'
text='\n\n'.join(f'{i+1}\n{tc(s["voiceStart"])} --> {tc(s["voiceEnd"])}\n{s["text"]}' for i,s in enumerate(timing['scenes']))
(ROOT.parent/'captions.srt').write_text(text+'\n')
print('Generated original stereo score and captions',flush=True)
