# Final output validation

- Video: H.264, 1920 × 1080, 30 fps, 1,430 encoded frames, 47.667 seconds.
- Audio: AAC stereo, 48 kHz, 47.646 seconds.
- Full MP4 decode: passed using `ffmpeg -v error -i final_promo.mp4 -f null -`.
- Measured integrated loudness: -16.2 LUFS.
- Measured true peak: -1.1 dBFS.
- Visual review: frames extracted from all nine scenes of the encoded MP4 and inspected; see `contact-sheet.jpg`.
- Speech check: generated narration transcribed with faster-whisper tiny.en. All script passages were recovered. The recognizer spelled the brand as “local lancers”; this is an automated check, not a human listening claim.
- Source syntax: Python production scripts compiled successfully.

The new picture and voice mix replace the rejected silent version. The actual voice engine is Kokoro ONNX, not ElevenLabs. The motion design is editable HTML/CSS/JavaScript, not a Figma export. Those requested services were unavailable; the user authorized proceeding with the available tools.
