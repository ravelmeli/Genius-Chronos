import sys
sys.path.insert(0,'/tmp/claude-0/gen')
from vidlib import *
v=V('sel',('assets/beads.js','assets/abs.js','assets/cab.js','assets/wd.js'))
TAGS=lambda p,a,b,txt: ["    "+tag(p,'a',a+0.1,round(b-a-0.2,2),txt),"    "+illu(p,a+0.1,round(b-a-0.1,2))]
LIB=r"""
      function cam(t, x, y, d, ly) { camera.position.set(x + 0.06 * Math.sin(t * 0.4), y, d); camera.lookAt(x, ly, 0); camera.updateMatrixWorld(); }
      function mkLabel(txt, bg, fg, w) {
        var c = document.createElement("canvas"); c.width = 384; c.height = 128; var x = c.getContext("2d");
        x.fillStyle = bg; x.beginPath(); x.moveTo(24, 6); x.lineTo(360, 6); x.quadraticCurveTo(378, 6, 378, 24); x.lineTo(378, 104); x.quadraticCurveTo(378, 122, 360, 122); x.lineTo(24, 122); x.quadraticCurveTo(6, 122, 6, 104); x.lineTo(6, 24); x.quadraticCurveTo(6, 6, 24, 6); x.fill();
        x.fillStyle = fg; x.font = "700 44px monospace"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 192, 66);
        return new THREE.Mesh(new THREE.PlaneGeometry(w || 1.5, (w || 1.5) / 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
      }
      function mkMols(n, col, r) { var a = []; for (var i = 0; i < n; i++) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 9), HF.std(col, { roughness: 0.4 })); scene.add(m); a.push(m); } return a; }
      function latXY(i, cols, sp, ox, oy) { var row = Math.floor(i / cols), c = i % cols; return [ox + (c + (row % 2) * 0.5) * sp, oy + row * sp * 0.87]; }
      function placeMols(M, cols, sp, ox, oy, W, H, f, t, seed) { M.forEach(function (m, i) { var L = latXY(i, cols, sp, ox, oy), fi = (typeof f === "function") ? f(i, L) : f; var lx = ox + rnd(i, 1 + seed) * W + 0.22 * Math.sin(t * 1.6 + i * 2.1), ly = oy + rnd(i, 2 + seed) * H + 0.22 * Math.cos(t * 1.3 + i * 1.9); m.position.set(lerp(lx, L[0], fi) + 0.02 * fi * Math.sin(t * 9 + i), lerp(ly, L[1], fi) + 0.02 * fi * Math.cos(t * 8 + i), 0); }); }
      function mkBonds(n) { var a = []; for (var i = 0; i < n; i++) { var b1 = HF.makeBeam(0x9fc4ff), b2 = HF.makeBeam(0x9fc4ff); scene.add(b1); scene.add(b2); a.push([b1, b2]); } return a; }
      function setBonds(B, M, cols, amt) { B.forEach(function (p, i) { var c = i % cols, right = (c < cols - 1) ? i + 1 : -1, up = i + cols; if (right >= 0 && right < M.length && amt > 0.01) HF.setBeam(p[0], M[i].position, M[right].position, 0.02, amt * 0.8); else p[0].visible = false; if (up < M.length && amt > 0.01) HF.setBeam(p[1], M[i].position, M[up].position, 0.02, amt * 0.8); else p[1].visible = false; }); }
      function mkTherm() { var g = new THREE.Group(); var tb = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.0, 14), new THREE.MeshStandardMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.35 })); g.add(tb); var bu = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), new THREE.MeshBasicMaterial({ color: 0xff4a4a })); bu.position.y = -1.6; g.add(bu); var lq = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 10), new THREE.MeshBasicMaterial({ color: 0xff4a4a })); lq.geometry.translate(0, 0.5, 0); lq.position.y = -1.5; g.add(lq); var zr = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xffffff })); zr.position.y = 0.0; g.add(zr); return { group: g, liq: lq, zero: zr }; }
"""
def stage(n,p,T0,T1,txt,chips,render,extra='',tags=None):
    v.build(n,p,T0,T1,tags or TAGS(p,T0,T1,txt),chips,LIGHT+LIB+render,extra=extra+monocss(p))
TRUCK=r"""
      var road = new THREE.Mesh(new THREE.BoxGeometry(9, 0.3, 2.2), HF.std(0x1d2234, { roughness: 0.6 })); road.position.set(0, -0.15, 0); scene.add(road);
      var tr = new THREE.Group(); var bd = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 1.0), HF.std(0xff8a2a, { roughness: 0.5 })); bd.position.set(-0.5, 0.95, 0); tr.add(bd); var cb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.95), HF.std(0xe9ecf4)); cb.position.set(0.95, 0.85, 0); tr.add(cb);
      [-1.0, 0.0, 0.95].forEach(function (x) { var w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), HF.std(0x151a26)); w2.rotation.x = Math.PI / 2; w2.position.set(x, 0.3, 0.5); tr.add(w2); var w3 = w2.clone(); w3.position.z = -0.5; tr.add(w3); });
      var fn = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 4), HF.std(0x9aa3b8)); fn.rotation.z = Math.PI; fn.position.set(-1.7, 0.7, 0); tr.add(fn); scene.add(tr);
      var ICE = []; [-2.6, -1.2, 0.2, 1.6, 3.0].forEach(function (x) { var m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.14, 1.6), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.8, roughness: 0.1 })); m.position.set(x, 0.07, 0); m.userData.x = x; scene.add(m); ICE.push(m); });
      var GR = []; for (var i = 0; i < 26; i++) { var g = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff3c0 })); scene.add(g); GR.push(g); }
      function truckAt(t, x0, sp) { var x = x0 + sp * Math.max(0, t - 2.0); tr.position.set(x, 0, 0); ICE.forEach(function (m) { var k = ease(seg(x, m.userData.x - 1.4, m.userData.x - 0.2)); m.scale.set(1, Math.max(0.02, 1 - k), 1); m.material.opacity = 0.8 * (1 - 0.6 * k); }); GR.forEach(function (g, i) { var u = (t * 1.5 + i / 26) % 1, fall = u < 0.5; var bx = x - 1.7 - 0.7 * u; g.position.set(bx, fall ? 0.7 - 0.6 * u * 2 : 0.1, (rnd(i, 3) - 0.5) * 0.9); g.visible = t > 2.2; }); }
"""
chips=[("salt",0.4,9.7,"DU SEL SUR LA ROUTE",'neon',290,'#4aa8ff'),("ice",2.6,9.7,"LA GLACE DISPARAÎT",'s',370,G),("cold",5.9,7.6,"LE SEL N'EST PAS CHAUD",'s',450,R),("how",8.0,9.7,"COMMENT FOND-IL LA GLACE ?",'s',450,Y)]
stage('stageA','sa',0,9.9,"LA ROUTE",chips,TRUCK+r"""
      function renderAt(t) {
        if (t > T1 + 0.05) return;
        cam(t, 0, 1.6, 10.5, 0.6); truckAt(t, -4.0, 0.7);
        renderer.render(scene, camera);
      }
""")
chips=[("ice",10.4,18.5,"LA GLACE",'neon',290,'#4aa8ff'),("zero",12.0,14.7,"L'EAU GÈLE À ZÉRO DEGRÉ",'s',370,BL),("crys",15.2,18.5,"LES MOLÉCULES FORMENT DES CRISTAUX",'s',370,G)]
stage('stageB','sb',9.9,18.6,"LA GLACE",chips,r"""
      var M = mkMols(42, 0x4aa8ff, 0.14), B = mkBonds(42), th = mkTherm(); th.group.position.set(-2.0, 0.6, 0); scene.add(th.group);
      var zl = mkLabel("0 °", "#ffffff", "#0a1020", 0.9); zl.position.set(-1.5, 0.6, 0.3); scene.add(zl);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0.6, 12.5, 0.6);
        var temp = lerp(1.2, 0.0, ease(seg(t, 11.5, 14.7))); th.liq.scale.set(1, 1.5 + temp * 0.9, 1);
        var f = ease(seg(t, 14.9, 17.6)); placeMols(M, 7, 0.5, -0.9, -0.4, 3.0, 2.4, f, t, 0); setBonds(B, M, 7, ease(seg(t, 16.5, 17.6)));
        renderer.render(scene, camera);
      }
""")
chips=[("salt",19.0,29.3,"LE SEL",'neon',290,'#ffc41a'),("dis",20.6,24.4,"IL SE DISSOUT DANS LA FINE COUCHE D'EAU",'s',370,Y),("part",24.9,29.3,"PETITES PARTICULES ENTRE LES MOLÉCULES",'s',370,G)]
stage('stageC','sc',18.6,29.4,"LE SEL",chips,r"""
      var IC = mkMols(28, 0xbfe6ff, 0.16), IB = mkBonds(28); IC.forEach(function (m, i) { var L = latXY(i, 7, 0.5, -1.5, -1.9); m.position.set(L[0], L[1], 0); }); setBonds(IB, IC, 7, 1);
      var FM = mkMols(16, 0x4aa8ff, 0.14);
      var gr = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xfff3c0 })); scene.add(gr);
      var NA = mkMols(10, 0xffc41a, 0.1), CL = mkMols(10, 0x38d27a, 0.12);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0.0, 11.5, 0.0);
        placeMols(FM, 8, 0.4, -1.5, -0.85, 3.4, 0.7, 0, t, 5);
        var dr = ease(seg(t, 20.7, 21.9)), gv = (t > 20.7 && t < 22.4) ? 1 : 0; gr.visible = gv > 0; gr.position.set(0, lerp(2.2, -0.3, dr), 0.2); gr.rotation.set(t * 3, t * 2, 0);
        var sp = ease(seg(t, 22.4, 24.9)), ev = ease(seg(t, 22.3, 22.9));
        NA.forEach(function (m, i) { m.position.set(lerp(0, -1.5 + rnd(i, 7) * 3.4, sp) + 0.1 * Math.sin(t * 2 + i), lerp(-0.3, -0.85 + rnd(i, 8) * 0.7, sp), 0.1); m.visible = t > 22.3; m.scale.setScalar(Math.max(0.01, ev)); });
        CL.forEach(function (m, i) { m.position.set(lerp(0, -1.5 + rnd(i, 9) * 3.4, sp) + 0.1 * Math.cos(t * 2 + i), lerp(-0.3, -0.85 + rnd(i, 10) * 0.7, sp), 0.1); m.visible = t > 22.3; m.scale.setScalar(Math.max(0.01, ev)); });
        renderer.render(scene, camera);
      }
""")
SPLIT=r"""
      var M = mkMols(30, 0x4aa8ff, 0.14), B = mkBonds(30), P1 = mkMols(8, 0xffc41a, 0.1), P2 = mkMols(8, 0x38d27a, 0.12);
      var th = mkTherm(); th.group.position.set(-2.1, 0.4, 0); scene.add(th.group);
      function salts(t) { P1.forEach(function (m, i) { m.position.set(0.25 + rnd(i, 4) * 1.4 + 0.1 * Math.sin(t * 2 + i), -0.5 + rnd(i, 5) * 2.0 + 0.1 * Math.cos(t * 2 + i), 0.1); }); P2.forEach(function (m, i) { m.position.set(0.25 + rnd(i, 6) * 1.4 + 0.1 * Math.cos(t * 2 + i), -0.5 + rnd(i, 7) * 2.0 + 0.1 * Math.sin(t * 2 + i), 0.1); }); }
      function leftBonds(amt) { B.forEach(function (p, i) { var L = latXY(i, 6, 0.5, -1.4, -0.6), c = i % 6, right = c < 5 ? i + 1 : -1; if (L[0] < 0.0 && amt > 0.01) { if (right >= 0 && right < 30 && latXY(right, 6, 0.5, -1.4, -0.6)[0] < 0.0) HF.setBeam(p[0], M[i].position, M[right].position, 0.02, 0.8 * amt); else p[0].visible = false; if (i + 6 < 30) HF.setBeam(p[1], M[i].position, M[i + 6].position, 0.02, 0.8 * amt); else p[1].visible = false; } else { p[0].visible = false; p[1].visible = false; } }); }
"""
chips=[("block",29.8,37.1,"LES PARTICULES GÊNENT",'neon',290,'#ff4a4a'),("noRe",31.2,33.6,"ELLES EMPÊCHENT DE SE RATTACHER",'s',370,Y),("colder",34.0,37.1,"IL FAUT PLUS FROID POUR GELER",'s',370,BL)]
stage('stageD','sd',29.4,37.2,"LE BLOCAGE",chips,SPLIT+r"""
      var l1 = mkLabel("EAU", "#4aa8ff", "#04152a", 0.9), l2 = mkLabel("EAU SALÉE", "#ffc41a", "#1a1400", 1.4); l1.position.set(-0.7, 1.7, 0.3); l2.position.set(1.0, 1.7, 0.3); scene.add(l1); scene.add(l2);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0.3, 13.5, 0.3);
        var cold = ease(seg(t, 34.2, 36.2)); th.liq.scale.set(1, 2.4 - 0.7 * cold, 1);
        var fl = ease(seg(t, 31.0, 33.0)), fr = ease(seg(t, 35.6, 36.8));
        placeMols(M, 6, 0.5, -1.4, -0.6, 3.2, 2.0, function (i, L) { return L[0] < 0.0 ? fl : fr; }, t, 3); leftBonds(fl); salts(t);
        renderer.render(scene, camera);
      }
""")
chips=[("same",37.5,42.9,"À LA MÊME TEMPÉRATURE",'neon',290,'#38d27a'),("melt",39.8,42.9,"LA GLACE FOND, L'EAU SALÉE RESTE LIQUIDE",'s',370,Y)]
stage('stageE','se',37.2,43.0,"LE RÉSULTAT",chips,SPLIT+r"""
      th.liq.scale.set(1, 1.7, 1);
      var l1 = mkLabel("EAU : GLACE", "#bfe6ff", "#04152a", 1.5), l2 = mkLabel("SALÉE : LIQUIDE", "#ffc41a", "#1a1400", 1.7); l1.position.set(-0.7, 1.7, 0.3); l2.position.set(1.2, 1.4, 0.3); scene.add(l1); scene.add(l2);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0.3, 13.5, 0.3);
        placeMols(M, 6, 0.5, -1.4, -0.6, 3.2, 2.0, function (i, L) { return L[0] < 0.0 ? 1 : 0; }, t, 3); leftBonds(1); salts(t);
        renderer.render(scene, camera);
      }
""")
chips=[("limit",43.3,49.5,"LE SEL A UNE LIMITE",'neon',290,'#ff4a4a'),("cold2",45.0,47.6,"TRÈS FROID : MÊME L'EAU SALÉE GÈLE",'s',370,BL),("noeff",47.9,49.5,"SEL INEFFICACE",'s',370,R)]
stage('stageF','sf',43.0,49.6,"LA LIMITE",chips,r"""
      var M = mkMols(30, 0x4aa8ff, 0.14), B = mkBonds(30), P1 = mkMols(6, 0xffc41a, 0.1), P2 = mkMols(6, 0x38d27a, 0.12);
      var th = mkTherm(); th.group.position.set(-2.1, 0.4, 0); scene.add(th.group);
      var gr = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xfff3c0 })); gr.position.set(1.8, 1.9, 0.2); scene.add(gr);
      var xx = HF.makeCross(0xff3a3a); xx.position.set(1.8, 1.9, 0.5); scene.add(xx);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 0.3, 13.5, 0.3);
        th.liq.scale.set(1, 1.7 - 0.9 * ease(seg(t, 43.6, 45.4)), 1);
        var f = ease(seg(t, 45.4, 47.4)); placeMols(M, 6, 0.5, -1.4, -0.6, 3.2, 2.0, f, t, 3); setBonds(B, M, 6, f);
        P1.forEach(function (m, i) { var L = latXY(i * 5 + 2, 6, 0.5, -1.4, -0.6); m.position.set(L[0] + 0.2, L[1] + 0.1, 0.2); }); P2.forEach(function (m, i) { var L = latXY(i * 5 + 4, 6, 0.5, -1.4, -0.6); m.position.set(L[0] + 0.2, L[1] - 0.1, 0.2); });
        var xv = ease(seg(t, 47.9, 48.5)); xx.visible = xv > 0.01; xx.scale.setScalar(Math.max(0.01, xv));
        renderer.render(scene, camera);
      }
""")
chips=[("s1",50.2,56.0,"DES PARTICULES QUI GÊNENT",'s',290,Y),("s2",51.5,56.0,"UNE EAU QUI GÈLE PLUS DIFFICILEMENT",'s',370,BL),("s3",53.2,56.0,"UNE LIMITE QUAND IL FAIT TRÈS FROID",'s',450,R)]
body=LIGHT+LIB+TRUCK+r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0, 1.6, 10.5, 0.6); var tt = (t - 49.6) % 6; truckAt(tt + 2.0, -4.0, 0.9);
        renderer.render(scene, camera);
      }
"""
final_stage(v,'stageG','sg',49.6,62.47,("LE RÉSUMÉ",56.4),("ET TOI ?",56.6),chips,55.2,56.4,(56.5,"Tu as déjà glissé<br>sur une plaque<br>de verglas ?"),57.2,57.4,59.6,60.4,body)
st=[('stageA',0,9.9),('stageB',9.9,18.6),('stageC',18.6,29.4),('stageD',29.4,37.2),('stageE',37.2,43.0),('stageF',43.0,49.6),('stageG',49.6,62.47)]
make_index('sel',st,62.47,[],[7.0,10.6,15.5,21.0,24.9,31.3,34.2,38.0,44.0,47.9,50.6,56.7])
print('ok')
