import sys
sys.path.insert(0,'/tmp/claude-0/gen')
from vidlib import *
v=V('ia',('assets/beads.js','assets/abs.js','assets/cab.js','assets/wd.js'))
TAGS=lambda p,a,b,txt: ["    "+tag(p,'a',a+0.1,round(b-a-0.2,2),txt),"    "+illu(p,a+0.1,round(b-a-0.1,2))]
VI=('#b26bff','#fff')
LIB=r"""
      function cam(t, x, y, d, ly) { camera.position.set(x + 0.06 * Math.sin(t * 0.4), y, d); camera.lookAt(x, ly, 0); camera.updateMatrixWorld(); }
      function mkCP(w, h, pw, ph) { var c = document.createElement("canvas"); c.width = pw; c.height = ph; var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); return { m: m, c: c.getContext("2d"), w: pw, h: ph }; }
      function upd(p) { p.m.material.map.needsUpdate = true; }
      function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); }
      function wrap(c, txt, x, y, mw, lh) { var words = txt.split(" "), line = "", yy = y; for (var i = 0; i < words.length; i++) { var t2 = line + words[i] + " "; if (c.measureText(t2).width > mw && line) { c.fillText(line, x, yy); line = words[i] + " "; yy += lh; } else line = t2; } c.fillText(line, x, yy); }
      function drawChat(p, q, a, caret) {
        var c = p.c; c.clearRect(0, 0, p.w, p.h);
        c.fillStyle = "#2a5ac8"; rr(c, p.w - 520, 30, 490, 130, 36); c.fill(); c.fillStyle = "#fff"; c.font = "600 40px sans-serif"; c.textBaseline = "top"; wrap(c, q, p.w - 490, 52, 430, 50);
        if (a !== null) { c.fillStyle = "#e4e8f2"; rr(c, 30, 210, p.w - 160, 620, 36); c.fill(); c.fillStyle = "#1d2230"; c.font = "600 42px sans-serif"; wrap(c, a + (caret ? "▌" : ""), 62, 236, p.w - 230, 56); }
        upd(p);
      }
      var ANS = "Le ciel est bleu parce que l'air diffuse davantage la lumière bleue du soleil.";
"""
def stage(n,p,T0,T1,txt,chips,render,extra='',tags=None):
    v.build(n,p,T0,T1,tags or TAGS(p,T0,T1,txt),chips,LIGHT+LIB+render,extra=extra+monocss(p))
CHAT=r"""
      var ch = mkCP(3.6, 4.0, 720, 800); ch.m.position.set(0, -0.6, 0); scene.add(ch.m);
"""
# A
chips=[("ask",0.4,9.3,"UNE QUESTION À UNE IA",'neon',290,'#4aa8ff'),("sens",2.2,5.0,"UNE RÉPONSE QUI A L'AIR RÉFLÉCHIE",'s',370,Y),("how",5.2,6.6,"COMMENT FONCTIONNE-T-ELLE ?",'s',450,R),("guess",6.8,9.3,"ELLE DEVINE, MOT APRÈS MOT",'s',450,G)]
stage('stageA','ia',0,9.5,"L'IA",chips,CHAT+r"""
      function renderAt(t) {
        if (t > T1 + 0.05) return;
        cam(t, 0, -0.2, 12, -0.2);
        var n = Math.floor(ANS.length * ease(seg(t, 6.9, 9.3)));
        drawChat(ch, "Pourquoi le ciel est bleu ?", t > 2.0 ? ANS.slice(0, n) : null, Math.floor(t * 2) % 2 === 0);
        renderer.render(scene, camera);
      }
""")
# B
chips=[("train",9.9,16.9,"L'ENTRAÎNEMENT",'neon',290,'#ffc41a'),("read",11.3,13.5,"D'ÉNORMES QUANTITÉS DE TEXTES",'s',370,Y),("learn",13.7,16.8,"QUELS MOTS SUIVENT QUELS AUTRES",'s',370,G)]
stage('stageB','ib',9.5,17.0,"L'ENTRAÎNEMENT",chips,r"""
      var box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 0.8), HF.std(0x5a6a92, { metalness: 0.5 })); box.position.set(1.4, 0.4, 0); scene.add(box);
      var bl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshBasicMaterial({ color: 0xffc41a })); bl.position.set(1.4, 0.4, 0.42); scene.add(bl);
      var PG = []; for (var i = 0; i < 12; i++) { var g = new THREE.Group(), pg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.03), new THREE.MeshBasicMaterial({ color: 0xe9ecf4 })); g.add(pg); for (var k = 0; k < 4; k++) { var ln = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x8a93a8 })); ln.position.set(0, 0.2 - k * 0.14, 0.03); g.add(ln); } scene.add(g); PG.push(g); }
      var ex = mkCP(3.3, 1.9, 800, 460); ex.m.position.set(0, -1.9, 0); scene.add(ex.m);
      var PAIRS = [["le", "ciel"], ["ciel", "est"], ["est", "bleu"]], COL = ["#4a86f0", "#38d27a", "#ffc41a", "#ff6b6b"];
      function drawPairs(t) { var c = ex.c; c.clearRect(0, 0, ex.w, ex.h); c.font = "700 54px monospace"; c.textBaseline = "middle"; for (var i = 0; i < 3; i++) { var a = ease(seg(t, 13.8 + i * 0.8, 14.5 + i * 0.8)); c.globalAlpha = a; var y = 20 + i * 145; c.fillStyle = COL[i]; rr(c, 30, y, 250, 110, 24); c.fill(); c.fillStyle = "#0a1020"; c.textAlign = "center"; c.fillText(PAIRS[i][0], 155, y + 56); c.strokeStyle = "#fff"; c.lineWidth = 8; c.beginPath(); c.moveTo(310, y + 55); c.lineTo(430, y + 55); c.lineTo(405, y + 30); c.moveTo(430, y + 55); c.lineTo(405, y + 80); c.stroke(); c.fillStyle = COL[(i + 1) % 4]; rr(c, 470, y, 250, 110, 24); c.fill(); c.fillStyle = "#0a1020"; c.fillText(PAIRS[i][1], 595, y + 56); } c.globalAlpha = 1; upd(ex); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0, 12, 0);
        PG.forEach(function (g, i) { var u = ((t - 10.0) * 0.28 + i / 12) % 1; g.position.set(lerp(-2.6, 0.8, u), 1.4 - (i % 4) * 0.55 + 0.0, 0.2); g.scale.setScalar(1 - 0.5 * u); g.visible = t > 10.2 && t < 13.7; });
        bl.material.color.setRGB(1, 0.77 + 0.2 * Math.sin(t * 8), 0.1);
        drawPairs(t); ex.m.visible = t > 13.7;
        renderer.render(scene, camera);
      }
""")
# C
chips=[("params",17.4,22.1,"RÉGLAGES INTERNES : LES PARAMÈTRES",'neon',290,'#b26bff'),("many",18.5,20.7,"UN TRÈS GRAND NOMBRE",'s',370,BL)]
stage('stageC','ic',17.0,22.2,"LES PARAMÈTRES",chips,r"""
      var NX = 8, NY = 10, DL = []; for (var i = 0; i < NX; i++) for (var j = 0; j < NY; j++) { var g = new THREE.Group(), d = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 18), HF.std(0x5a6a92, { metalness: 0.6 })); d.rotation.x = Math.PI / 2; g.add(d); var pt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.03), new THREE.MeshBasicMaterial({ color: 0xffc41a })); pt.position.set(0, 0.07, 0.06); g.add(pt); g.position.set((i - (NX - 1) / 2) * 0.42, (j - (NY - 1) / 2) * 0.42, 0); g.userData.a0 = rnd(i * 13 + j, 1) * 6.2832; g.userData.a1 = rnd(i * 13 + j, 2) * 6.2832; scene.add(g); DL.push(g); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0, 12.5, -0.1);
        var k = ease(seg(t, 17.6, 20.8));
        DL.forEach(function (g, i) { g.rotation.z = lerp(g.userData.a0 + 2.0 * Math.sin(t * 3 + i), g.userData.a1, k); g.visible = true; g.scale.setScalar(Math.max(0.01, ease(seg(t, 17.2 + 0.01 * i, 17.6 + 0.01 * i)))); });
        renderer.render(scene, camera);
      }
""")
# D
chips=[("q",22.4,30.2,"TA QUESTION",'neon',290,'#4aa8ff'),("cut",23.8,25.8,"DÉCOUPÉE EN PETITS MORCEAUX",'s',370,Y),("prob",26.0,30.2,"PROBABILITÉ DE CHAQUE MORCEAU SUIVANT",'s',370,G)]
stage('stageD','id',22.2,30.3,"LES MORCEAUX",chips,r"""
      var tk = mkCP(3.8, 1.2, 900, 280); tk.m.position.set(0, 0.9, 0); scene.add(tk.m);
      var bs = mkCP(3.8, 2.4, 900, 570); bs.m.position.set(0, -1.15, 0); scene.add(bs.m);
      var TOK = ["Pourquoi", "le", "ciel", "est", "bleu", "?"], CAND = [["Parce", 0.46], ["Le", 0.2], ["La", 0.15], ["Car", 0.1], ["Il", 0.09]];
      function drawTok(t) { var c = tk.c; c.clearRect(0, 0, tk.w, tk.h); c.font = "700 46px sans-serif"; c.textBaseline = "middle"; var gap = 12 + 20 * ease(seg(t, 23.8, 24.8)), x = 20, cols = ["#4a86f0", "#38d27a", "#ffc41a", "#ff6b6b", "#b26bff", "#38d6ff"]; for (var i = 0; i < 6; i++) { var w2 = c.measureText(TOK[i]).width + 36; if (x + w2 > tk.w - 10) break; c.fillStyle = cols[i]; rr(c, x, 90, w2, 90, 20); c.fill(); c.fillStyle = "#0a1020"; c.fillText(TOK[i], x + 18, 136); x += w2 + gap; } upd(tk); }
      function drawBars(t) { var c = bs.c; c.clearRect(0, 0, bs.w, bs.h); c.font = "700 46px monospace"; c.textBaseline = "middle"; c.fillStyle = "#e4e8f2"; c.fillText("SUITE ?", 20, 40); for (var i = 0; i < 5; i++) { var a = ease(seg(t, 26.2 + i * 0.35, 26.8 + i * 0.35)); c.globalAlpha = a; var y = 70 + i * 96; c.fillStyle = "#e4e8f2"; c.fillText(CAND[i][0], 20, y + 36); c.fillStyle = i === 0 ? "#38d27a" : "#4a86f0"; c.fillRect(260, y + 8, 600 * CAND[i][1] * a / 0.5, 56); } c.globalAlpha = 1; upd(bs); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0, 12, -0.1); drawTok(t); drawBars(t); bs.m.visible = t > 26.0;
        renderer.render(scene, camera);
      }
""")
# E
chips=[("pick",30.6,38.1,"ELLE EN CHOISIT UN",'neon',290,'#ffc41a'),("luck",31.2,33.4,"AVEC UN PEU DE HASARD",'s',370,Y),("loop",33.5,38.1,"ELLE L'AJOUTE ET RECOMMENCE",'s',370,G)]
stage('stageE','ie',30.3,38.2,"LA BOUCLE",chips,r"""
      var an = mkCP(3.8, 1.4, 900, 330); an.m.position.set(0, 1.0, 0); scene.add(an.m);
      var bs = mkCP(3.8, 2.3, 900, 540); bs.m.position.set(0, -1.2, 0); scene.add(bs.m);
      var SEQ = ["Parce", "que", "la", "lumière", "bleue", "est", "diffusée"], NAMES = [["Parce", "Car", "Le"], ["que", "qu'", "—"], ["la", "l'", "le"], ["lumière", "couleur", "teinte"], ["bleue", "du", "—"], ["est", "se", "—"], ["diffusée", "dispersée", "—"]];
      function draw(t) {
        var k = Math.max(0, Math.min(6, Math.floor((t - 31.2) / 0.95))), f = ((t - 31.2) % 0.95) / 0.95, c = an.c; c.clearRect(0, 0, an.w, an.h); c.font = "700 44px sans-serif"; c.textBaseline = "middle"; var x = 20, y = 60;
        for (var i = 0; i < 7; i++) { if (i > k - (f < 0.6 ? 1 : 0) || t < 31.2) break; var w2 = c.measureText(SEQ[i]).width + 32; if (x + w2 > an.w - 10) { x = 20; y += 110; } c.fillStyle = "#38d27a"; rr(c, x, y - 40, w2, 80, 18); c.fill(); c.fillStyle = "#04230f"; c.fillText(SEQ[i], x + 16, y); x += w2 + 12; }
        upd(an);
        var d = bs.c; d.clearRect(0, 0, bs.w, bs.h); d.font = "700 44px monospace"; d.textBaseline = "middle"; if (t > 30.8) { var nm = NAMES[k]; for (var j = 0; j < 3; j++) { var yy = 40 + j * 150, ln = [0.5, 0.25, 0.15][j] * (0.8 + 0.2 * Math.sin(t * 7 + j)); d.fillStyle = "#e4e8f2"; d.fillText(nm[j], 20, yy + 40); d.fillStyle = (j === 0 ? (f > 0.4 ? "#38d27a" : "#ffc41a") : "#4a86f0"); d.fillRect(300, yy + 8, 560 * ln / 0.5, 64); } } upd(bs);
      }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0, 12, -0.1); draw(t);
        renderer.render(scene, camera);
      }
""")
# F
chips=[("nodb",38.6,41.7,"PAS DE BASE DE DONNÉES",'neon',290,'#ff4a4a'),("likely",41.8,44.2,"LE PLUS PROBABLE",'s',370,Y),("err",44.4,48.2,"ELLE PEUT SE TROMPER OU INVENTER",'neon',290,'#ff8a2a'),("sure",46.8,48.2,"AVEC ASSURANCE",'s',370,R)]
stage('stageF','if',38.2,48.3,"LES LIMITES",chips,r"""
      var db = new THREE.Group(); var cy = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 24), HF.std(0x5a6a92, { metalness: 0.6 })); db.add(cy); [-0.4, 0, 0.4].forEach(function (y) { var r = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.03, 6, 28), new THREE.MeshBasicMaterial({ color: 0xc9cfdd })); r.rotation.x = Math.PI / 2; r.position.y = y; db.add(r); }); db.position.set(-1.1, 0.8, 0); scene.add(db);
      var xx = HF.makeCross(0xff3a3a); xx.position.set(-1.1, 0.8, 0.9); xx.scale.setScalar(2.0); scene.add(xx);
      var ans = mkCP(3.8, 1.7, 900, 400); ans.m.position.set(0, -1.4, 0); scene.add(ans.m);
      var pm = mkCP(1.6, 1.2, 400, 300); pm.m.position.set(1.5, 0.8, 0); scene.add(pm.m);
      function draw(t) { var c = ans.c; c.clearRect(0, 0, ans.w, ans.h); c.font = "700 44px sans-serif"; c.textBaseline = "middle"; var W = ["La", "réponse", "paraît", "sûre", "mais", "est", "fausse"], x = 20, y = 60; var n = Math.floor(7 * ease(seg(t, 44.6, 47.2))); for (var i = 0; i < 7; i++) { if (i >= n) break; var w2 = c.measureText(W[i]).width + 30; if (x + w2 > ans.w - 10) { x = 20; y += 100; } c.fillStyle = i === 6 ? "#ff4a4a" : "#38d27a"; rr(c, x, y - 36, w2, 72, 16); c.fill(); c.fillStyle = i === 6 ? "#fff" : "#04230f"; c.fillText(W[i], x + 15, y); x += w2 + 10; } upd(ans);
        var d = pm.c; d.clearRect(0, 0, pm.w, pm.h); d.fillStyle = "#e4e8f2"; d.font = "700 34px monospace"; d.fillText("PROBABLE", 10, 40); d.fillStyle = "rgba(255,255,255,0.18)"; d.fillRect(10, 80, 380, 50); d.fillStyle = "#ffc41a"; d.fillRect(10, 80, 380 * ease(seg(t, 41.8, 43.4)), 50); upd(pm); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0, 12.5, -0.1); db.rotation.y = 0.4 * Math.sin(t * 0.6); draw(t);
        var xv = ease(seg(t, 38.8, 39.4)); xx.visible = xv > 0.01; xx.scale.setScalar(2.0 * Math.max(0.01, xv));
        pm.m.visible = t > 41.7; ans.m.visible = t > 44.5;
        renderer.render(scene, camera);
      }
""")
# G
chips=[("s1",48.8,53.3,"BEAUCOUP DE TEXTES LUS",'s',290,BL),("s2",50.0,53.3,"DES PROBABILITÉS",'s',370,Y),("s3",51.3,53.3,"UN MOT APRÈS L'AUTRE",'s',450,G)]
body=LIGHT+LIB+CHAT+r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, -0.2, 12, -0.2);
        var tt = (t - 48.3) % 6, n = Math.floor(ANS.length * ease(seg(tt, 0.3, 3.2)));
        drawChat(ch, "Pourquoi le ciel est bleu ?", ANS.slice(0, n), Math.floor(t * 2) % 2 === 0);
        renderer.render(scene, camera);
      }
"""
final_stage(v,'stageG','ig',48.3,58.86,("LE RÉSUMÉ",53.6),("ET TOI ?",53.8),chips,52.2,53.6,(53.7,"Tu utilises une IA<br>au quotidien ?"),54.4,54.6,56.2,57.1,body)
st=[('stageA',0,9.5),('stageB',9.5,17.0),('stageC',17.0,22.2),('stageD',22.2,30.3),('stageE',30.3,38.2),('stageF',38.2,48.3),('stageG',48.3,58.86)]
make_index('ia',st,58.86,[],[8.0,10.5,13.9,17.6,24.0,26.3,31.3,34.0,38.8,44.6,49.0,53.9])
print('ok')
