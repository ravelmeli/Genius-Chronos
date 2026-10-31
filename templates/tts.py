"""Génère la voix off d'un script avec Gemini TTS (voix Koda, style Promote).

Usage : GEMINI_API_KEY=... python3 templates/tts.py script.txt voice.wav
La clé API ne doit jamais être écrite dans le dépôt.
Les consignes de style vont dans speech_metadata.style : dans le texte, elles seraient lues à voix haute.
"""
import sys, os, json, base64, urllib.request

MODEL = "gemini-3.8-flash-tts"
VOICE = "Koda"
STYLE = "High energy, elongated vowels"  # style « Promote » d'AI Studio

text = open(sys.argv[1], encoding="utf-8").read().strip()
body = {
    "contents": [{"parts": [{"text": text, "speech_metadata": {"style": STYLE}}]}],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}},
    },
}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
    data=json.dumps(body).encode(),
    headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"},
)
res = json.load(urllib.request.urlopen(req, timeout=300))
part = res["candidates"][0]["content"]["parts"][0]["inlineData"]
open(sys.argv[2], "wb").write(base64.b64decode(part["data"]))  # déjà un WAV avec en-tête
print(part["mimeType"])
