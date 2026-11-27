import sys
sys.path.insert(0,'/tmp/claude-0/gen')
from vidlib import *
v=V('moto',('assets/beads.js','assets/abs.js','assets/cab.js','assets/wd.js'))
TAGS=lambda p,a,b,txt: ["    "+tag(p,'a',a+0.1,round(b-a-0.2,2),txt),"    "+illu(p,a+0.1,round(b-a-0.1,2))]
LIB=r"""
      function cam(t, x, y, d, ly) { camera.position.set(x + 0.08 * Math.sin(t * 0.4), y, d); camera.lookAt(x, ly, 0); camera.updateMatrixWorld(); }
      var gd = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), HF.std(0x161c2c, { roughness: 0.4, metalness: 0.4 })); gd.rotation.x = -Math.PI / 2; gd.position.set(0, 0, 0); scene.add(gd);
      var gl = new THREE.Mesh(new THREE.BoxGeometry(14, 0.04, 0.05), new THREE.MeshBasicMaterial({ color: 0x6a7aa0 })); gl.position.set(0, 0.02, 0.0); scene.add(gl);
      function mkMoto() {
        var g = new THREE.Group(), o = { group: g };
        var tm = HF.std(0x151a26, { roughness: 0.9 }); o.tire = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.0, 0.5), tm); o.tire.position.y = 0.5; g.add(o.tire);
        o.pat = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.5), new THREE.MeshBasicMaterial({ color: 0xffc41a })); o.pat.position.y = 0.02; g.add(o.pat);
        var fr = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.55, 0.9), HF.std(0xc2412a, { metalness: 0.4, roughness: 0.4 })); fr.position.y = 1.2; g.add(fr);
        var sw = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.7), HF.std(0x2a3550)); sw.position.y = 0.85; g.add(sw);
        o.rider = new THREE.Group(); o.rider.position.y = 1.5; var tz = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 12), HF.std(0x2a6ad0)); tz.position.y = 0.45; o.rider.add(tz); var hl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), HF.std(0xf0f3fa)); hl.position.y = 1.1; o.rider.add(hl); g.add(o.rider);
        o.knee = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.2), new THREE.MeshBasicMaterial({ color: 0xffc41a })); o.knee.position.set(-0.42, 0.5, 0.0); o.rider.add(o.knee); o.knee.position.y = -0.95;
        return o;
      }
      var mt = mkMoto(); scene.add(mt.group);
      function setLean(a, rider) { mt.group.rotation.z = -a; mt.rider.rotation.z = -(rider || 0); }
      function mkArrow(col) { var b = HF.makeBeam(col); scene.add(b); var h = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 8), new THREE.MeshBasicMaterial({ color: col })); scene.add(h); return { b: b, h: h }; }
      function setArrow(A, x0, y0, x1, y1, op, rad) { var a = new THREE.Vector3(x0, y0, 0.4), b = new THREE.Vector3(x1, y1, 0.4), d = b.clone().sub(a); var L = d.length(); if (L < 0.02 || op <= 0.01) { A.b.visible = false; A.h.visible = false; return; } d.normalize(); var tip = b.clone(); var base = b.clone().addScaledVector(d, -0.25); HF.setBeam(A.b, a, base, rad || 0.05, op); A.h.visible = true; A.h.position.copy(b).addScaledVector(d, -0.12); A.h.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); A.h.material.opacity = op; }
      function com(a) { return new THREE.Vector3(Math.sin(a) * 1.5, Math.cos(a) * 1.5, 0); }
      var AW = mkArrow(0xff4a4a), AU = mkArrow(0x38d27a), AH = mkArrow(0x4aa8ff), AT = mkArrow(0xffc41a);
"""
def stage(n,p,T0,T1,txt,chips,render,extra='',tags=None):
    v.build(n,p,T0,T1,tags or TAGS(p,T0,T1,txt),chips,LIGHT+LIB+render,extra=extra+monocss(p))
CAM="cam(t, 0.2, 1.3, 9.5, 1.0);"
HIDE="[AW, AU, AH, AT].forEach(function (A) { A.b.visible = false; A.h.visible = false; });"
# A
chips=[("gp",0.4,10.1,"COURSE DE MOTOGP",'neon',290,'#4aa8ff'),("knee",1.4,5.2,"LE GENOU FRÔLE LE SOL",'s',370,Y),("nofall",5.4,7.1,"ELLES NE TOMBENT PAS",'s',450,G),("how",7.3,10.1,"ADHÉRENCE + ÉQUILIBRE PRÉCIS",'s',450,BL)]
stage('stageA','ma',0,10.3,"LE VIRAGE",chips,r"""
      function renderAt(t) {
        if (t > T1 + 0.05) return;
        """+CAM+r"""
        var a = 0.95 * ease(seg(t, 0.4, 2.2)) * (1 + 0.04 * Math.sin(t * 1.5)); if (t > 5.0) a = 0.95 * (0.85 + 0.15 * Math.sin((t - 5.0) * 0.9));
        setLean(a, 0.12); mt.group.position.x = 0; mt.group.position.z = 0;
        """+HIDE+r"""
        renderer.render(scene, camera);
      }
""")
# B
chips=[("turn",10.9,18.6,"POUR TOURNER",'neon',290,'#ffc41a'),("push",11.8,15.3,"POUSSÉE VERS L'INTÉRIEUR DU VIRAGE",'s',370,Y),("tyre",16.0,18.6,"ADHÉRENCE DES PNEUS",'s',370,G)]
stage('stageB','mb',10.3,18.7,"LA POUSSÉE",chips,r"""
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffc41a })); ring.position.set(0, 0.2, 0.3); scene.add(ring);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.5, 1.2, 9.0, 0.9);
        setLean(0, 0); """+HIDE+r"""
        var p = ease(seg(t, 11.8, 12.6)); setArrow(AH, 0.5, 0.9, 0.5 + 2.2 * p, 0.9, p, 0.07);
        var tv = ease(seg(t, 16.0, 16.6)); ring.visible = tv > 0.01; ring.scale.setScalar(1 + 0.12 * Math.sin(t * 6)); mt.pat.visible = t > 16.0;
        renderer.render(scene, camera);
      }
""")
# C
chips=[("lean",19.0,26.3,"MOTO PENCHÉE",'neon',290,'#ff8a2a'),("up",20.1,23.5,"VERS LE HAUT ET L'INTÉRIEUR",'s',370,Y),("side",24.0,26.3,"LA POUSSÉE DE CÔTÉ FAIT TOURNER",'s',370,G)]
stage('stageC','mc',18.7,26.4,"LES FORCES",chips,r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.8, 1.4, 9.5, 1.1);
        var a = 0.6; setLean(a, 0.0); var C = com(a);
        var w = ease(seg(t, 19.6, 20.2)), tt = ease(seg(t, 20.2, 21.2)), vh = ease(seg(t, 21.8, 22.8));
        setArrow(AW, C.x, C.y, C.x, C.y - 1.4 * w, w, 0.06);
        setArrow(AT, 0, 0.0, C.x * 1.0, C.y * 1.0 + 0.0, tt * (1 - vh * 0.7), 0.05);
        setArrow(AU, 0, 0.0, 0, 1.4 * vh, vh, 0.06);
        var hh = ease(seg(t, 23.2, 24.2)); setArrow(AH, 0, 0.9, 1.4 * hh + 0.2, 0.9, hh, 0.07);
        renderer.render(scene, camera);
      }
""")
# D
chips=[("faster",26.7,33.1,"PLUS VITE OU PLUS SERRÉ",'neon',290,'#ff4a4a'),("more",29.4,31.3,"PLUS DE POUSSÉE DE CÔTÉ",'s',370,Y),("lean2",31.2,33.1,"LE PILOTE PENCHE DAVANTAGE",'s',370,G)]
stage('stageD','md',26.4,33.2,"LA VITESSE",chips,r"""
      var SL = []; for (var i = 0; i < 10; i++) { var b = HF.makeBeam(0xcfd6e6); scene.add(b); SL.push(b); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.8, 1.4, 9.5, 1.1);
        var k = ease(seg(t, 28.0, 31.5)), a = lerp(0.55, 1.0, k); setLean(a, 0.0); var C = com(a);
        setArrow(AH, 0, 0.9, 0.3 + 1.0 + 1.6 * k, 0.9, ease(seg(t, 26.7, 27.3)), 0.07); setArrow(AU, 0, 0, 0, 1.4, 1, 0.05); setArrow(AW, C.x, C.y, C.x, C.y - 1.4, 1, 0.05); setArrow(AT, 0, 0, C.x, C.y, 0, 0.05);
        SL.forEach(function (b, i) { var u = (t * (0.8 + 1.4 * k) + i / 10) % 1; HF.setBeam(b, new THREE.Vector3(-3 + 7 * u, 0.4 + 0.2 * i, -0.5), new THREE.Vector3(-3 + 7 * u + 0.8 + 0.6 * k, 0.4 + 0.2 * i, -0.5), 0.02, 0.5 * ease(seg(t, 26.8, 27.6))); });
        renderer.render(scene, camera);
      }
""")
# E
chips=[("body",33.5,37.9,"LE PILOTE DÉPLACE SON CORPS",'neon',290,'#4aa8ff'),("bal",35.7,37.9,"ÉQUILIBRE DE LA MOTO",'s',370,G)]
stage('stageE','me',33.2,38.0,"LE PILOTE",chips,r"""
      var cm = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); scene.add(cm);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.8, 1.4, 9.5, 1.1);
        var k = ease(seg(t, 33.8, 35.6)), bike = lerp(0.95, 0.65, k), ri = 0.45 * k; setLean(bike, ri);
        var C = new THREE.Vector3(Math.sin(0.8) * 1.5, Math.cos(0.8) * 1.5, 0); cm.position.set(C.x, C.y, 0.5);
        """+HIDE+r"""
        setArrow(AT, 0, 0, C.x, C.y, 0.0, 0.05); mt.knee.material.color.setHex(0xffc41a);
        renderer.render(scene, camera);
      }
""")
# F
chips=[("limit",38.3,46.4,"LA LIMITE : L'ADHÉRENCE",'neon',290,'#ff4a4a'),("slide",40.6,43.6,"LE PNEU GLISSE, LA MOTO TOMBE",'s',370,R),("hot",44.0,46.4,"PNEUS CHAUFFÉS POUR MIEUX ADHÉRER",'s',370,Y)]
stage('stageF','mf',38.0,46.6,"LA LIMITE",chips,r"""
      var fc = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 8, 40), new THREE.MeshBasicMaterial({ color: 0xff4a4a })); fc.position.set(0, 0.9, 0.3); scene.add(fc);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.8, 1.4, 9.5, 1.1);
        var R0 = lerp(1.6, 2.6, ease(seg(t, 44.2, 45.2))), need = lerp(0.9, 2.0, ease(seg(t, 39.6, 41.8)));
        var slide = t > 42.0 && t < 44.0 ? ease(seg(t, 42.0, 43.4)) : 0; var back = ease(seg(t, 44.0, 44.6));
        var a = t < 39.6 ? 0.8 : lerp(0.8, 0.8 + 0.7 * slide, 1);
        setLean(t < 44.0 ? (0.8 + 0.8 * slide) : lerp(1.6, 0.9, back), 0.1); mt.group.position.x = t < 44.0 ? 0.6 * slide : lerp(0.6, 0, back); mt.group.position.y = -0.3 * slide * (t < 44.0 ? 1 : 1 - back);
        fc.scale.setScalar(R0 / 1.0 * 0.8); fc.material.color.setHex(t > 44.2 ? 0x38d27a : 0xff4a4a);
        setArrow(AH, mt.group.position.x, 0.9, mt.group.position.x + need * 0.8, 0.9, ease(seg(t, 39.6, 40.2)), 0.07);
        [AW, AU, AT].forEach(function (A) { A.b.visible = false; A.h.visible = false; });
        mt.tire.material.emissive.setRGB(0.8 * ease(seg(t, 44.0, 45.0)), 0.3 * ease(seg(t, 44.0, 45.0)), 0);
        renderer.render(scene, camera);
      }
""")
# G
chips=[("s1",47.0,52.0,"DES PNEUS QUI ADHÈRENT",'s',290,G),("s2",48.2,52.0,"UNE MOTO PENCHÉE",'s',370,Y),("s3",49.2,52.0,"UN PILOTE QUI COMPENSE",'s',450,BL)]
body=LIGHT+LIB+r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        """+CAM+r"""
        setLean(0.9 * Math.sin((t - 46.6) * 0.8), 0.1); """+HIDE+r"""
        renderer.render(scene, camera);
      }
"""
final_stage(v,'stageG','mg',46.6,56.86,("LE RÉSUMÉ",51.4),("ET TOI ?",51.6),chips,50.0,51.4,(51.5,"Tu as déjà essayé<br>une moto ou un scooter ?"),52.2,52.4,54.3,55.0,body)
st=[('stageA',0,10.3),('stageB',10.3,18.7),('stageC',18.7,26.4),('stageD',26.4,33.2),('stageE',33.2,38.0),('stageF',38.0,46.6),('stageG',46.6,56.86)]
make_index('moto',st,56.86,[],[9.8,11.5,16.2,20.5,27.0,31.5,34.0,41.0,44.2,47.5,52.0])
print('ok')
