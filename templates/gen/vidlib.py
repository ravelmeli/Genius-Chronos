import sys, re, os, json
sys.path.insert(0,'/tmp/claude-0/gen')
from absshared import *
G=('#38d27a','#04230f'); Y=('#ffc41a','#1a1400'); R=('#ff4a4a','#fff'); C=('#38d6ff','#03242c'); BL=('#4aa8ff','#04152a'); OR=('#ff8a2a','#1a0c00')
HEAD=lambda T0,T1: "\n    (function () {\n      var HF = window.HF, lerp = HF.lerp, ease = HF.ease, easeOut = HF.easeOut, seg = HF.seg, $ = HF.el;\n      var T0 = %s, T1 = %s;\n      function w(t, a, b) { return ease(seg(t, a, a + 0.25)) * (1 - ease(seg(t, b - 0.25, b))); }\n      function rnd(i, k) { var x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); }\n" % (T0,T1)
TAIL=lambda n,ids,more='': r"""
      window.addEventListener("hf-seek", function (e) { renderAt(e.detail.time); });
      renderAt(T0);
      var tl = gsap.timeline({ paused: true });
      var popd = function (sel, at, dd) { tl.fromTo(sel, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: dd || 0.25, ease: "back.out(2)" }, at); };
      """ + popjs(ids) + more + r"""
      window.__timelines["%s"] = tl;
    })();
""" % n
LIGHT=r"""
      var fl = new THREE.PointLight(0xffffff, 0.5, 60); fl.position.set(0, 4, 10); scene.add(fl);
"""
def monocss(p): return f"    .{p}-mono {{ background: rgba(7,11,22,0.72); padding: 4px 14px; border-radius: 999px; }}\n"
def lab(p,i,t0,t1,text,kind,top,color='',left=70):
    if kind=='neon': return neon(p,i,t0,t1,text,color,left,top)
    if kind=='white': return chip(p,i,t0,t1,text,left,top)
    return solid(p,i,t0,t1,text,color[0],color[1],left,top)
class V:
    def __init__(s,folder,scripts):
        s.out=f'/home/user/Genius-Chronos/{folder}/compositions/'; s.sc=scripts
    def build(s,n,p,T0,T1,tags,chips,js_body,extra='',more='',extra_html=()):
        html="\n".join(tags+[lab(p,*c) for c in chips]+list(extra_html))
        js=HEAD(T0,T1)+SCENE_HEAD%{'p':p}+js_body+TAIL(n,["#%s-lab-%s|%s"%(p,c[0],c[1]) for c in chips],more)
        path=s.out+n+'.html'
        open(path,'w').write(doc(p,n,extra,html,js,scripts=s.sc))
        t=open(path).read(); head,tail=t.split('var tl = gsap.timeline',1)
        head=re.sub(r'data-start="(\d+\.\d+)"',lambda m:f'data-start="{float(m.group(1))-T0:.2f}"',head)
        tail=re.sub(r'"(#[a-z0-9-]+)\|(\d+\.\d+)"',lambda m:f'"{m.group(1)}|{float(m.group(2))-T0:.2f}"',tail)
        tail=re.sub(r'(popd|card|pop)\(("#[^"]+"), (\d+\.\d+)(, [^)]*)?\)',lambda m:f'{m.group(1)}({m.group(2)}, {float(m.group(3))-T0:.2f}{m.group(4) or ""})',tail)
        tail=re.sub(r'(\}, )(\d+\.\d+)\);',lambda m:f'{m.group(1)}{float(m.group(2))-T0:.2f});',tail)
        open(path,'w').write(head+'var tl = gsap.timeline'+tail)
def final_stage(v,n,p,T0,T1,tag_a,tag_b,chips,big,dim,bubble,q1,q2,b1,b2,body,qtop=(450,560)):
    extra=cta_css(p)+f"""
    #{p}-dim {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; background: rgba(7,11,22,0.5); }}
    .{p}-q {{ position: absolute; font-size: 150px; font-weight: 800; color: #ffc41a; text-shadow: 0 0 40px rgba(255,196,26,0.8); }}
"""+monocss(p)
    r=lambda a: round(T1-a,2)
    tags=["    "+tag(p,'a',T0+0.1,round(tag_a[1]-T0-0.1,2),tag_a[0]),"    "+tag(p,'b',tag_b[1],round(T1-tag_b[1]-0.1,2),tag_b[0]),"    "+illu(p,T0+0.1,round(T1-T0-0.2,2))]
    html=[
     f'    <div id="{p}-big" class="{p}-big clip" data-start="{big}" data-duration="1.4" style="top: 640px; font-size: 96px; text-shadow: 0 4px 24px rgba(0,0,0,0.8)">Voilà le secret.</div>',
     f'    <div id="{p}-dim" class="clip" data-start="{dim}" data-duration="{r(dim)}"></div>',
     f'    <div id="{p}-q1" class="{p}-q clip" data-start="{q1}" data-duration="{r(q1)}" style="left: 100px; top: {qtop[0]}px">?</div>',
     f'    <div id="{p}-q2" class="{p}-q clip" data-start="{q2}" data-duration="{r(q2)}" style="left: 850px; top: {qtop[1]}px">?</div>',
     f'    <div id="{p}-bubble" class="clip" data-start="{bubble[0]}" data-duration="{r(bubble[0])}" style="top: 700px">{bubble[1]}</div>',
     f'    <div id="{p}-b1" class="{p}-btn clip" data-start="{b1}" data-duration="{r(b1)}" style="left: 90px; top: 1100px; background: #fff; color: #0a0f1c">COMMENTE</div>',
     f'    <div id="{p}-b2" class="{p}-btn clip" data-start="{b2}" data-duration="{r(b2)}" style="left: 540px; top: 1100px; background: #ff3b3b; color: #fff">ABONNE-TOI</div>']
    more=f"""
      tl.fromTo("#{p}-big", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }}, {big});
      tl.fromTo("#{p}-dim", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, {dim});
      tl.fromTo("#{p}-bubble", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }}, {bubble[0]});
      popd("#{p}-q1", {q1}); popd("#{p}-q2", {q2}); popd("#{p}-b1", {b1}); popd("#{p}-b2", {b2});"""
    v.build(n,p,T0,T1,tags,chips,body,extra=extra,more=more,extra_html=html)
def make_index(folder,stages,D,sfx_extra_cuts,pings):
    base=f'/home/user/Genius-Chronos/{folder}/'
    ev=[]
    for n,a,b in stages:
        s=open(f'{base}compositions/{n}.html').read()
        for m in re.finditer(r'<div id="[a-z]+-(?:lab|tg|b|q|badge)[^"]*" class="[^"]*clip[^"]*" data-start="([\d.]+)"',s): ev.append(float(m.group(1))+a)
    ev=sorted(set(round(e,2) for e in ev)); keep=[]
    for e in ev:
        if not keep or e-keep[-1]>=0.7: keep.append(e)
    items=[]
    for t in [a for n,a,b in stages[1:]]+sfx_extra_cuts: items.append((max(0,t+0.033-0.162),'whoosh-short.mp3',0.575,0.3,f'w{int(t*10)}'))
    for t in keep: items.append((max(0,t+0.033-0.12),'pop.mp3',0.72,0.3,f'p{int(t*100)}'))
    for t in pings: items.append((t-0.1,'ping.mp3',1.32,0.28,f'g{int(t*100)}'))
    items.sort(); ends={}; out=[]
    for t,src,dur,vol,i in items:
        tr=next(k for k in range(4,30) if ends.get(k,-1)<=t+0.001); ends[tr]=t+dur+0.01
        out.append(f'      <audio id="sfx-{i}" class="clip" src="assets/sfx/{src}" data-start="{t:.3f}" data-duration="{dur}" data-track-index="{tr}" data-volume="{vol}"></audio>\n')
    sfx=''.join(out)
    st=''
    for n,a,b in stages: st+=f'      <div id="{n}" data-composition-id="{n}" data-composition-src="compositions/{n}.html" data-start="{a}" data-duration="{round(b-a,2)}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>\n'
    st+=f'      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{D}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div>\n'
    st+=f'      <audio id="voice" class="clip" src="assets/voice.wav" data-start="0" data-duration="{D}" data-track-index="3" data-volume="1" data-fade-out="0.25"></audio>\n'
    html=open('/home/user/Genius-Chronos/eolienne/index.html').read()
    head=html.split('<div id="root"')[0]
    root=f'<div id="root" data-composition-id="main" data-start="0" data-duration="{D}" data-width="1080" data-height="1920">\n{st}{sfx}    </div>\n'
    tail='    <script>\n      const tl = gsap.timeline({ paused: true });\n      window.__timelines["main"] = tl;\n      tl.seek(0);\n    </script>\n  </body>\n</html>\n'
    open(base+'index.html','w').write(head+'    '+root+tail)
