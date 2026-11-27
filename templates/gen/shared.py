def css(p):
    return f"""
    #root {{ position: absolute; inset: 0; background: #070b16; font-family: "Inter", sans-serif; overflow: hidden; }}
    #{p}-canvas, #{p}-leaders {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }}
    #{p}-leaders {{ pointer-events: none; }}
    .{p}-chip {{ position: absolute; padding: 14px 26px; border-radius: 999px; background: rgba(255,255,255,0.96); color: #0a0f1c; font-weight: 700; font-size: 34px; white-space: nowrap; box-shadow: 0 6px 24px rgba(0,0,0,0.35); }}
    .{p}-neon {{ background: rgba(10,16,32,0.92); color: #fff; border: 3px solid var(--c); box-shadow: 0 0 30px var(--c); }}
    .{p}-mono {{ position: absolute; font-family: "Space Mono", monospace; font-size: 28px; letter-spacing: 0.14em; color: rgba(255,255,255,0.82); white-space: nowrap; }}
    .{p}-dot {{ display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: #ff8a2a; margin-right: 14px; }}
    .{p}-card {{ position: absolute; left: 90px; width: 900px; background: rgba(10,16,32,0.86); border: 3px solid rgba(255,255,255,0.2); border-radius: 28px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); color: #fff; }}
    .{p}-row {{ position: absolute; left: 36px; font-family: "Space Mono", monospace; font-size: 28px; letter-spacing: 0.1em; }}
"""
def tag(p,i,t0,dur,text):
    return f'<div id="{p}-tag-{i}" class="{p}-mono clip" data-start="{t0}" data-duration="{dur}" style="left: 60px; top: 200px"><span class="{p}-dot"></span>{text}</div>'
def illu(p,t0,dur):
    return f'<div id="{p}-illu" class="{p}-mono clip" data-start="{t0}" data-duration="{dur}" style="right: 60px; top: 190px; padding: 6px 16px; border-radius: 999px; background: rgba(10,16,32,0.6)">ILLUSTRATIF</div>'
def doc(p, cid, extra_css, html, js, scripts=('assets/face.js',)):
    extra_scripts = "\n".join(f'  <script src="{x}"></script>' for x in scripts)
    return f"""<template>
  <style>{css(p)}{extra_css}  </style>
  <div id="root" data-composition-id="{cid}" data-width="1080" data-height="1920">
    <canvas id="{p}-canvas" width="1080" height="1920"></canvas>
{html}
  </div>
  <script src="assets/vendor/three.min.js"></script>
  <script src="assets/common.js"></script>
{extra_scripts}
  <script>
{js}
  </script>
</template>
"""
