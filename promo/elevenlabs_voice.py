"""Generate real ElevenLabs narration with alignment. Requires secure API binding.

Usage: python elevenlabs_voice.py [--voice-id ID]
With no voice ID, select an available premade English voice, preferring Indian accent.
No credential values are printed, persisted, or passed via command-line arguments.
"""
import argparse
import base64
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent
API = 'https://api.elevenlabs.io'

def request(path, key, payload=None):
    headers = {'xi-api-key': key, 'Accept': 'application/json'}
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(API + path, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=180) as response:
            return json.load(response)
    except urllib.error.HTTPError as err:
        # Response bodies can contain account details. Report only the status.
        raise RuntimeError(f'ElevenLabs returned HTTP {err.code}; check credential, voice access, and account quota.') from None
    except urllib.error.URLError:
        raise RuntimeError('ElevenLabs could not be reached; check network access to api.elevenlabs.io.') from None

def choose_voice(voices):
    eligible = [v for v in voices if v.get('category') == 'premade']
    if not eligible:
        raise RuntimeError('No premade voice is available. Rerun with an authorized --voice-id from your account.')
    def score(v):
        labels = v.get('labels', {})
        desc = ' '.join(str(x).lower() for x in labels.values())
        return (5 * ('indian' in desc) + 2 * ('narration' in desc) + ('professional' in desc), v.get('name', ''))
    return max(eligible, key=score)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--voice-id', help='Optional authorized ElevenLabs stock voice ID')
    args = parser.parse_args()
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        parser.exit(2, 'Missing ELEVENLABS_API_KEY. Add it securely in Environment settings; do not paste it in chat or Git.\n')
    voice_id = args.voice_id
    if voice_id is not None and not all(c.isalnum() or c in '_-' for c in voice_id):
        parser.error('Voice ID must contain only letters, digits, underscores, or hyphens.')
    if not voice_id:
        voice = choose_voice(request('/v1/voices', key).get('voices', []))
        voice_id = voice['voice_id']
        print('Selected available stock voice:', voice.get('name', voice_id))
    payload = {
        'text': (ROOT / 'narration.txt').read_text().strip(),
        'model_id': 'eleven_multilingual_v2',
        'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.15, 'use_speaker_boost': True},
    }
    result = request(f'/v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128', key, payload)
    encoded = result.get('audio_base64')
    alignment = result.get('normalized_alignment') or result.get('alignment')
    if not encoded or not alignment:
        raise RuntimeError('ElevenLabs did not return both audio and alignment; no completion claimed.')
    audio = base64.b64decode(encoded, validate=True)
    if len(audio) < 1024:
        raise RuntimeError('Returned audio is unexpectedly small; no completion claimed.')
    (ROOT / 'voiceover.mp3').write_bytes(audio)
    (ROOT / 'voiceover-alignment.json').write_text(json.dumps(alignment, indent=2))
    (ROOT / 'voiceover-metadata.json').write_text(json.dumps({'provider': 'ElevenLabs', 'model_id': payload['model_id'], 'voice_id': voice_id}, indent=2))
    print('Saved voiceover.mp3 and alignment. Listen to the actual audio and validate duration before editing.')

if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, ValueError) as err:
        print(str(err), file=sys.stderr)
        sys.exit(1)
