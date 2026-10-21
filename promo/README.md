# Local Lanchers promotional video

[Download / view the finished MP4](final_promo.mp4)

A 54-second promotional film based on the actual public website, with original motion graphics and an original instrumental score. Output: H.264 video, 1920 × 1080, 30 fps, AAC stereo audio, MP4 with fast-start metadata.

## Files

- `final_promo.mp4`: finished video.
- `storyboard.md`: scene timings, copy, and sourcing boundaries.
- `render.py`: editable animation and music generator.
- `capture.py`: reproducible public website screenshot capture; does not submit forms.
- `assets/`: actual website captures and original site logo.
- `contact-sheet.jpg`: frames extracted from the final encoded MP4 for visual review.
- `validation.json`: final media metadata from ffprobe.
- `requirements.txt`: Python packages used by this project.

## Reproduce

Use Python 3.12, FFmpeg with libx264/AAC, and the DejaVu Sans fonts. Chromium is needed only to refresh screenshots. The supplied captures allow rendering offline after dependencies are installed.

```bash
cd promo
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python render.py --preview
python render.py
ffprobe -v error -show_streams -show_format -of json final_promo.mp4
ffmpeg -v error -i final_promo.mp4 -f null -
```

On Debian/Ubuntu, the relevant system packages are `ffmpeg fonts-dejavu-core chromium`. `capture.py` expects Chromium at `/usr/bin/chromium`; edit that path for another installation. To update website captures, run `python capture.py` with network access to the site before rendering. The website layout can change, so review crop coordinates and all scenes after refreshing captures. Download the logo from `https://locallanchers.vercel.app/brand/local-lanchers-logo.png` if replacing the provided copy.

Edit `STARTS`, scene text and layout inside `render.py`; adjust `DURATION` if changing the overall length. All source dimensions are 1920 × 1080. Website crops are specified in CSS pixels and scaled to match the capture resolution. `audio()` creates the score deterministically; `music.wav` is generated locally and is not needed in Git. The final video includes the music.

The site is a digital services business. The film shows its real service-card interaction and published services; it does not claim tested delivery of those services. Website artwork and branding remain the respective owner's assets. The production adds no third-party stock music.
