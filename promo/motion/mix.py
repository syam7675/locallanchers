"""Mix the generated neural narration above an original, ducked score."""
from pathlib import Path
import json, subprocess
ROOT=Path(__file__).resolve().parent
D=json.loads((ROOT/'timing.json').read_text())['duration']
filters=(
 '[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo,loudnorm=I=-17:LRA=7:TP=-2,asplit=2[voice][side];'
 '[2:a]volume=0.7[bed];'
 '[bed][side]sidechaincompress=threshold=0.025:ratio=5:attack=15:release=320[ducked];'
 '[voice][ducked]amix=inputs=2:normalize=0,loudnorm=I=-16:LRA=9:TP=-1.1,'
 f'afade=t=in:d=0.08,afade=t=out:st={D-.65}:d=0.65,aresample=48000[out]'
)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','warning','-i',str(ROOT/'picture.mp4'),'-i',str(ROOT/'narration.wav'),'-i',str(ROOT/'score.wav'),'-filter_complex',filters,'-map','0:v:0','-map','[out]','-c:v','copy','-c:a','aac','-b:a','256k','-t',str(D),'-movflags','+faststart','-metadata','title=Local Lanchers — Your next customer','-metadata','comment=Original HTML/CSS motion design; Kokoro neural narration; original instrumental score',str(ROOT.parent/'final_promo.mp4')],check=True)
print('Mixed final_promo.mp4',flush=True)
