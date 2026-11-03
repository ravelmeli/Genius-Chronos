"""Génère compositions/captions.html (sous-titres mot par mot) depuis assets/words.json.

Usage (depuis le dossier de la vidéo) : python3 -I ../templates/gen_captions.py <durée en secondes>
Position : les sous-titres sont placés bas (CAPTION_TOP), à l'endroit demandé par l'utilisateur.
"""
import json, html, sys

LIMIT = float(sys.argv[1])
CAPTION_TOP = 1430  # px sur 1920 ; l'ancienne position était 1215
w = json.load(open('assets/words.json'))
toks = []
for x in w:
    t = x['word']
    if t == '000':
        toks[-1]['text'] += ' ' + t; toks[-1]['end'] = x['end']
    elif t.startswith("'") or t.startswith('-') or t in ('?', '!', ',', '.'):
        toks[-1]['text'] += t; toks[-1]['end'] = x['end']
    else:
        toks.append({'text': t, 'start': x['start'], 'end': x['end']})
toks = [t for t in toks if t['start'] < LIMIT]
groups, cur = [], []
for t in toks:
    cur.append(t)
    if len(cur) >= 4 or t['text'][-1] in '.?!':
        groups.append(cur); cur = []
if cur: groups.append(cur)
parts, script = [], []
for gi, g in enumerate(groups):
    start = max(0.1, g[0]['start'] - 0.05)
    nxt = groups[gi + 1][0]['start'] - 0.05 if gi + 1 < len(groups) else LIMIT
    end = min(nxt - 0.02, g[-1]['end'] + 0.35, LIMIT)
    spans = ''.join(f'<span class="cw" id="cw{gi}_{k}">{html.escape(t["text"])}</span> ' for k, t in enumerate(g))
    parts.append(f'    <div id="cg{gi}" class="cg clip" data-start="{start:.2f}" data-duration="{end-start:.2f}"><div class="cp">{spans.strip()}</div></div>')
    script.append(f'tl.fromTo("#cg{gi} .cp",{{opacity:0,y:14}},{{opacity:1,y:0,duration:0.14,ease:"power2.out"}},{start:.2f});')
    for k, t in enumerate(g):
        script.append(f'tl.to("#cw{gi}_{k}",{{color:"#ffffff",borderBottomColor:"#ffffff",duration:0.08}},{t["start"]:.2f});')
    script.append(f'tl.to("#cg{gi} .cp",{{opacity:0,duration:0.1,ease:"power2.in"}},{end-0.1:.2f});')
    script.append(f'tl.set("#cg{gi} .cp",{{opacity:0,visibility:"hidden"}},{end:.2f});')
doc = f'''<template>
  <style>
    #root {{ position:absolute; inset:0; font-family:"Inter",sans-serif; }}
    .cg {{ position:absolute; left:0; top:{CAPTION_TOP}px; width:1080px; text-align:center; overflow:visible; }}
    .cp {{ display:inline-block; max-width:900px; padding:14px 30px 16px; border-radius:22px; background:rgba(6,10,20,0.9); font-size:54px; font-weight:600; line-height:1.18; color:rgba(255,255,255,0.93); }}
    .cw {{ border-bottom:5px solid transparent; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
{chr(10).join(parts)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{chr(10).join('    ' + l for l in script)}
    window.__timelines["captions"] = tl;
  </script>
</template>
'''
open('compositions/captions.html', 'w').write(doc)
print(len(groups), 'groups')
