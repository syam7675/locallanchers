from pathlib import Path
import json, os
import numpy as np
import soundfile as sf
import onnxruntime as rt
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parent
MODELS=Path(os.environ.get('VOICE_MODEL_DIR','/workspace/voice-models'))
options=rt.SessionOptions();options.intra_op_num_threads=4;options.inter_op_num_threads=2
session=rt.InferenceSession(str(MODELS/'kokoro-v1.0.onnx'),sess_options=options,providers=['CPUExecutionProvider'])
k=Kokoro.from_session(session,str(MODELS/'voices-v1.0.bin'))
texts=[
 'Your next customer is already looking.',
 'For a clinic. A salon. A place they can trust.',
 'But being great at what you do is only the beginning.',
 'You need to be found. Make it easy to enquire. And give customers a reason to return.',
 'Meet Local Lanchers. Your digital growth partner.',
 'From local search and websites, to WhatsApp, booking, and automated follow-ups.',
 'One connected approach to visibility, conversion, and retention.',
 'Human strategy. AI execution. Built around your local business.',
 'Ready for your next chapter? Visit Local Lanchers. And start a conversation.'
]
clips=[];scenes=[];cursor=0;sr=24000
for i,text in enumerate(texts):
 samples,sr=k.create(text,voice='af_heart',speed=.88,lang='en-us',sentence_pause=.2)
 lead=.26 if i else .55;tail=.8 if i<8 else 2.2
 clip=np.concatenate([np.zeros(round(lead*sr)),samples,np.zeros(round(tail*sr))]).astype(np.float32)
 sf.write(ROOT/f'voice_{i:02d}.wav',clip,sr)
 dur=len(clip)/sr
 scenes.append({'index':i,'start':cursor,'duration':dur,'text':text,'voiceStart':cursor+lead,'voiceEnd':cursor+lead+len(samples)/sr})
 clips.append(clip);cursor+=dur
 print(i,round(dur,2),text,flush=True)
full=np.concatenate(clips)
sf.write(ROOT/'narration.wav',full,sr)
(ROOT/'timing.json').write_text(json.dumps({'provider':'Kokoro ONNX','voice':'af_heart','sampleRate':sr,'duration':len(full)/sr,'scenes':scenes},indent=2))
print('Total',len(full)/sr,flush=True)
