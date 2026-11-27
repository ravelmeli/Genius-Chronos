import sys,os
sys.path.insert(0,'/tmp/claude-0/gen')
from shared import *
def cta_css(p):
    return f"""
    #{p}-bubble {{ position: absolute; left: 130px; top: 700px; width: 820px; padding: 36px 40px; border-radius: 40px; background: #1c2b52; border: 4px solid #4aa8ff; box-shadow: 0 0 40px rgba(74,168,255,0.5); color: #fff; font-weight: 800; font-size: 60px; line-height: 1.15; text-align: center; }}
    #{p}-bubble::after {{ content: ""; position: absolute; left: 90px; bottom: -34px; width: 0; height: 0; border-left: 28px solid transparent; border-right: 28px solid transparent; border-top: 36px solid #4aa8ff; }}
    .{p}-btn {{ position: absolute; padding: 20px 40px; border-radius: 999px; font-weight: 800; font-size: 40px; white-space: nowrap; }}
    .{p}-big {{ position: absolute; left: 0; width: 1080px; text-align: center; color: #fff; font-weight: 800; letter-spacing: -0.02em; text-shadow: 0 6px 40px rgba(0,0,0,0.7); }}
"""
def chip(p,i,t0,t1,text,left=70,top=1010,cls='',style=''):
    return f'    <div id="{p}-lab-{i}" class="{p}-chip {cls} clip" data-start="{t0}" data-duration="{round(t1-t0,2)}" style="left: {left}px; top: {top}px;{style}">{text}</div>'
def neon(p,i,t0,t1,text,color,left=70,top=1010):
    return chip(p,i,t0,t1,text,left,top,f'{p}-neon',f' --c: {color};')
def solid(p,i,t0,t1,text,bg,fg,left=70,top=1010):
    return chip(p,i,t0,t1,text,left,top,'',f' background: {bg}; color: {fg};')
def popjs(ids):
    import json
    return "["+", ".join(json.dumps(x) for x in ids)+'].forEach(function (q) { var a = q.split("|"); popd(a[0], parseFloat(a[1])); });'
SCENE_HEAD = r"""
      var renderer = HF.makeRenderer($("%(p)s-canvas"));
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x070b16);
      scene.fog = new THREE.Fog(0x070b16, 12, 34);
      var camera = new THREE.PerspectiveCamera(38, HF.W / HF.H, 0.1, 80);
      scene.add(new THREE.HemisphereLight(0x6f8cff, 0x120c08, 0.6));
      var key = new THREE.DirectionalLight(0xffe2c0, 1.0); key.position.set(3, 5, 3); scene.add(key);
      var rim = new THREE.DirectionalLight(0x5aa0ff, 0.9); rim.position.set(-3, 3, -4); scene.add(rim);
"""
