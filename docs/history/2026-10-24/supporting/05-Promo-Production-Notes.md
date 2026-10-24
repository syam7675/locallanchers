# Local Lanchers — Your next customer

Replacement motion graphics film using a new visual direction, a neural voiceover, and an original stereo score. The rejected silent version has been removed from the current branch. The earlier version remains only in Git history.

## Deliverables

- `final_promo.mp4`: finished H.264/AAC video.
- `captions.srt`: optional narration captions using the generated speech intervals.
- `storyboard.md`: shot plan and source boundaries.
- `narration.txt`: spoken script.
- `motion/index.html`: editable HTML/CSS/JavaScript motion design and deterministic timeline.
- `motion/timing.json`: actual scene timings from the generated voice clips.
- `motion/narration.wav`: generated neural voice source.
- `motion/assets/`: original website photos, branding, interface captures and licensed Inter font.
- `motion/render_motion.py`: Chromium-to-FFmpeg renderer.
- `motion/score.py` and `motion/mix.py`: original score generator and voice-first mix.
- `validation.json`, `speech-check.json`, and `contact-sheet.jpg`: output metadata, automated speech check and encoded-frame review.

## Tools actually used

The user authorized proceeding with the available tools. Figma and ElevenLabs were not connected, so this version uses editable HTML/CSS motion design and local **Kokoro ONNX, af_heart** neural narration. It is not a Figma export or an ElevenLabs voice. The optional `elevenlabs_voice.py` is available for a future authorized ElevenLabs generation; it requires a securely configured API key and has not been used to generate this film.

## Reproduce the picture and mix

Prerequisites: Python 3.12, Chromium at `/usr/bin/chromium`, FFmpeg with libx264 and AAC. Use the existing repository checkout; no worktree is required. From the repository root:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r promo/motion/requirements.txt
python promo/motion/render_motion.py --preview
python promo/motion/render_motion.py
python promo/motion/score.py
python promo/motion/mix.py
ffmpeg -v error -i promo/final_promo.mp4 -f null -
```

The checked-in narration WAV and timing JSON are sufficient for picture rendering and mixing; regenerating the voice or downloading models is optional. No credentials are required to reproduce this version. An embedded local HTTP server runs only during render and shuts down afterward.

## Edit

Open `motion/index.html` through an HTTP server rooted at `motion/`, or use `render_motion.py --preview`. The renderer calls `window.setTime(seconds)` at exactly 30 frames per second. Style, copy, transforms, camera angles and scene animations are editable in the HTML file. Scene timing is driven by the actual voice lengths in `timing.json`. Do not merely change scene durations without editing the corresponding narration.

To regenerate the local narration, download the two official Kokoro ONNX model assets listed in `motion/voice-models.json`, preserving TLS verification. The manifest records the source URLs and hashes of the files used. Set `VOICE_MODEL_DIR` to the model directory and run `python promo/motion/synthesize.py`. The model files are large and excluded from Git. This changes timings, so regenerate the picture, score, captions and mix afterward.

The supplied narration uses a licensed stock synthetic voice model, not a clone of a real individual. The score is composed algorithmically in `score.py`, with no external stock music. Kokoro model weights are Apache 2.0; kokoro-onnx is MIT. Inter's redistribution license is included beside its font file. Website imagery and trademarks remain their respective owners' material.

## Validation boundaries

The video must pass a full FFmpeg decode check, media metadata checks and extracted-frame review before delivery. `speech-check.json` is an automated transcription check and may respell brand names; it is not an assertion of human listening review. No numerical business outcomes, placeholder testimonials or fabricated application screens are included. The website describes a local digital services business, so the film promotes those published services.
