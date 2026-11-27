import sys
sys.path.insert(0,'/tmp/claude-0/gen')
from vidlib import *
v=V('pompe',('assets/beads.js','assets/abs.js','assets/cab.js','assets/wd.js'))
TAGS=lambda p,a,b,txt: ["    "+tag(p,'a',a+0.1,round(b-a-0.2,2),txt),"    "+illu(p,a+0.1,round(b-a-0.1,2))]
CIRC=r"""
      function cam(t, px, py, d, lx, ly) { camera.position.set(px + 0.1 * Math.sin(t * 0.4), py, d); camera.lookAt(lx, ly, 0); camera.updateMatrixWorld(); }
      function mkLabel(txt, bg, fg, w) {
        var c = document.createElement("canvas"); c.width = 384; c.height = 128; var x = c.getContext("2d");
        x.fillStyle = bg; x.beginPath(); x.moveTo(24, 6); x.lineTo(360, 6); x.quadraticCurveTo(378, 6, 378, 24); x.lineTo(378, 104); x.quadraticCurveTo(378, 122, 360, 122); x.lineTo(24, 122); x.quadraticCurveTo(6, 122, 6, 104); x.lineTo(6, 24); x.quadraticCurveTo(6, 6, 24, 6); x.fill();
        x.fillStyle = fg; x.font = "700 44px monospace"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 192, 66);
        return new THREE.Mesh(new THREE.PlaneGeometry(w || 1.5, (w || 1.5) / 3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
      }
      function zig(x, y0, y1, a, n) { var o = []; for (var i = 0; i <= n; i++) o.push([x + (i === 0 || i === n ? 0 : (i % 2 ? a : -a)), y0 + (y1 - y0) * i / n]); return o; }
      var RAW = [[0.5, -2.0], [1.7, -2.0], [1.7, -1.5]].concat(zig(1.7, -1.5, 1.5, 0.35, 6)).concat([[1.7, 1.7], [0.2, 1.7], [-0.2, 1.7], [-1.7, 1.7], [-1.7, 1.5]]).concat(zig(-1.7, 1.5, -1.5, 0.35, 6)).concat([[-1.7, -2.0], [-0.5, -2.0], [0.5, -2.0]]);
      var PTS = RAW.map(function (q) { return new THREE.Vector3(q[0], q[1], 0.1); }), LEN = [0];
      for (var i = 1; i < PTS.length; i++) LEN.push(LEN[i - 1] + PTS[i].distanceTo(PTS[i - 1]));
      var TOT = LEN[LEN.length - 1];
      function uAt(k) { return LEN[k] / TOT; }
      var iCS = 2, iCE = 2 + 6, iV1 = 11, iV2 = 12, iES = 14, iEE = 14 + 6;
      var uCS = uAt(iCS), uCE = uAt(iCE + 1), uV = (uAt(iV1) + uAt(iV2)) / 2, uES = uAt(iES), uEE = uAt(iEE);
      var RED = new THREE.Color(0xff4a3a), ORG = new THREE.Color(0xff9a2a), BLU = new THREE.Color(0x3a8aff), PAL = new THREE.Color(0xaee6ff);
      var KEYS = [[0, RED], [uCS, RED], [uCE, ORG], [uV - 0.015, ORG], [uV + 0.015, BLU], [uES, BLU], [uEE, PAL], [0.985, PAL], [1, RED]];
      function colAt(u) { for (var i = 1; i < KEYS.length; i++) if (u <= KEYS[i][0]) { var a = KEYS[i - 1], b = KEYS[i], k = (u - a[0]) / Math.max(1e-6, b[0] - a[0]); return a[1].clone().lerp(b[1], k); } return RED.clone(); }
      function pathAt(u) { var s = ((u % 1) + 1) % 1 * TOT, i = 1; while (i < LEN.length - 1 && s > LEN[i]) i++; var k = (s - LEN[i - 1]) / (LEN[i] - LEN[i - 1]); return PTS[i - 1].clone().lerp(PTS[i], Math.max(0, Math.min(1, k))); }
      var zl = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 4.7), new THREE.MeshBasicMaterial({ color: 0x3a8aff, transparent: true, opacity: 0.14, depthWrite: false })); zl.position.set(-1.65, -0.2, -0.3); scene.add(zl);
      var zr = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 4.7), new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.16, depthWrite: false })); zr.position.set(1.7, -0.2, -0.3); scene.add(zr);
      var lzl = mkLabel("DEHORS", "#4aa8ff", "#04152a", 1.3), lzr = mkLabel("MAISON", "#ff8a2a", "#1a0c00", 1.3); lzl.position.set(-1.65, -0.2, -0.2); lzr.position.set(1.7, -0.2, -0.2); lzl.material.opacity = 0.7; lzr.material.opacity = 0.7; scene.add(lzl); scene.add(lzr);
      var PIPE = []; for (var i = 1; i < PTS.length; i++) { var b = HF.makeBeam(0x6a7aa0); b.userData.u = (LEN[i - 1] + LEN[i]) / 2 / TOT; scene.add(b); PIPE.push(b); }
      var comp = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.0, 20), HF.std(0x5a6a92, { metalness: 0.6, roughness: 0.4, emissive: 0xff3a1a, emissiveIntensity: 0 })); comp.rotation.z = Math.PI / 2; comp.position.set(0, -2.0, 0.1); scene.add(comp);
      var vmat = HF.std(0x9aa3b8, { metalness: 0.7 }); var vl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.2, 0.34, 12), vmat), vr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.06, 0.34, 12), vmat);
      vl.rotation.z = -Math.PI / 2; vr.rotation.z = -Math.PI / 2; vl.position.set(-0.17, 1.7, 0.1); vr.position.set(0.17, 1.7, 0.1); scene.add(vl); scene.add(vr);
      var NB = 40, BD = []; for (var i = 0; i < NB; i++) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff4a3a, transparent: true, opacity: 1 })); scene.add(m); BD.push(m); }
      var HA = []; for (var i = 0; i < 10; i++) { var b = HF.makeBeam(0xff8a2a); scene.add(b); HA.push(b); }
      var SN = []; for (var i = 0; i < 26; i++) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), new THREE.MeshBasicMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.8 })); scene.add(m); SN.push(m); }
      function circ(t, o) {
        PIPE.forEach(function (b, i) {
          var a = PTS[i], e = PTS[i + 1], u = b.userData.u, c = (u > uCS && u < uCE) ? 0xff9a2a : (u > uES && u < uEE) ? 0x4a9aff : 0x6a7aa0;
          b.material.color.setHex(c); HF.setBeam(b, a, e, 0.035, 0.75 * o.vis);
        });
        comp.visible = o.vis > 0.05; comp.material.emissiveIntensity = o.compGlow; comp.scale.set(1 + 0.04 * Math.sin(t * 14) * o.compGlow, 1, 1);
        vl.visible = vr.visible = o.vis > 0.05;
        BD.forEach(function (m, i) { var u = o.ph + i / NB; m.position.copy(pathAt(u)); var uu = ((u % 1) + 1) % 1; m.material.color.copy(colAt(uu)); var liq = uu > uCE && uu < uV; m.scale.setScalar(liq ? 1.2 : 1.0); m.visible = o.beads > 0.02; m.material.opacity = o.beads; });
        HA.forEach(function (b, i) {
          var side = i < 5 ? 1 : -1, y = -1.2 + 0.6 * (i % 5), p = (t * 0.6 + i * 0.21) % 1;
          if (side > 0) { var x0 = 2.15 + 0.5 * p; b.material.color.setHex(0xff8a2a); HF.setBeam(b, new THREE.Vector3(x0, y, 0.2), new THREE.Vector3(x0 + 0.18, y, 0.2), 0.045, o.heatC * Math.sin(p * 3.14)); }
          else { var x1 = -2.45 + 0.4 * p; b.material.color.setHex(0xff8a2a); HF.setBeam(b, new THREE.Vector3(x1, y, 0.2), new THREE.Vector3(x1 + 0.18, y, 0.2), 0.045, o.heatE * Math.sin(p * 3.14)); }
        });
        SN.forEach(function (m, i) { var u = (t * 0.25 + rnd(i, 1)) % 1; m.position.set(-2.5 + 1.7 * rnd(i, 2), 2.3 - 4.6 * u, 0.0); m.visible = o.snow > 0.02; m.material.opacity = 0.8 * o.snow; });
      }
"""
FULL="cam(t, 0.2, -0.2, 14.5, 0.2, -0.15);"
def stage(n,p,T0,T1,txt,chips,render,extra='',tags=None):
    v.build(n,p,T0,T1,tags or TAGS(p,T0,T1,txt),chips,LIGHT+CIRC+render,extra=extra+monocss(p))
# A
chips=[("cold",0.4,9.9,"IL FAIT FROID DEHORS",'neon',290,'#4aa8ff'),("heat",3.0,9.9,"ELLE CHAUFFE AVEC L'AIR EXTÉRIEUR",'s',370,Y),("fr",7.5,9.9,"COMME UN FRIGO, MAIS À L'ENVERS",'s',450,G)]
stage('stageA','pa',0,10.1,"L'HIVER",chips,r"""
      function renderAt(t) {
        if (t > T1 + 0.05) return;
        """+FULL+r"""
        var vis = ease(seg(t, 7.6, 8.8));
        circ(t, { vis: vis, beads: ease(seg(t, 8.6, 9.4)), ph: 0.12 * (t - 8.6), compGlow: 0, heatC: 0, heatE: ease(seg(t, 3.0, 3.8)) * (1 - vis * 0.5), snow: 1 });
        renderer.render(scene, camera);
      }
""")
# B
chips=[("out",10.6,20.0,"LA CHALEUR DEHORS",'neon',290,'#ff8a2a'),("air",12.5,15.2,"L'AIR CONTIENT DE LA CHALEUR",'s',370,Y),("fluid",15.5,20.0,"UN FLUIDE QUI CIRCULE EN BOUCLE",'s',370,BL)]
stage('stageB','pb',10.1,20.2,"LA CHALEUR",chips,r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, -0.9, 0.0, 12.5, -0.9, 0.0);
        circ(t, { vis: ease(seg(t, 15.4, 16.2)), beads: ease(seg(t, 16.4, 17.0)), ph: 0.12 * t, compGlow: 0.3, heatC: 0, heatE: ease(seg(t, 12.4, 13.2)), snow: 1 });
        renderer.render(scene, camera);
      }
""")
# C
chips=[("cold",20.5,27.4,"UN FLUIDE TRÈS FROID",'neon',290,'#4aa8ff'),("abs",23.7,27.4,"IL ABSORBE LA CHALEUR ET DEVIENT GAZ",'s',370,Y)]
stage('stageC','pc',20.2,27.5,"L'ÉVAPORATION",chips,r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, -1.3, 0.2, 10.8, -1.3, 0.0);
        circ(t, { vis: 1, beads: 1, ph: 0.12 * t, compGlow: 0.4, heatC: 0, heatE: ease(seg(t, 23.4, 24.2)), snow: 0.8 });
        renderer.render(scene, camera);
      }
""")
# D
chips=[("comp",28.0,32.8,"LE COMPRESSEUR",'neon',290,'#ff4a4a'),("hot",30.0,32.8,"LE GAZ DEVIENT CHAUD",'s',370,R)]
stage('stageD','pd',27.5,32.9,"LE COMPRESSEUR",chips,r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 0.5, -1.3, 9.0, 0.5, -1.4);
        circ(t, { vis: 1, beads: 1, ph: 0.12 * t, compGlow: 0.9 * ease(seg(t, 29.0, 31.5)), heatC: 0, heatE: 0, snow: 0 });
        renderer.render(scene, camera);
      }
""")
# E
chips=[("ex",33.2,42.4,"L'ÉCHANGEUR À L'INTÉRIEUR",'neon',290,'#ff8a2a'),("give",36.3,40.8,"IL CÈDE SA CHALEUR À L'AIR OU AUX RADIATEURS",'s',370,OR),("cyc",41.0,42.4,"LE CYCLE RECOMMENCE",'s',370,G)]
stage('stageE','pe',32.9,42.5,"LA MAISON",chips,r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        cam(t, 1.3, 0.3, 10.8, 1.3, 0.0);
        if (t > 41.0) cam(t, 0.2 + 1.1 * (1 - ease(seg(t, 41.0, 42.0))), -0.2 + 0.5 * (1 - ease(seg(t, 41.0, 42.0))), 10.8 + 3.7 * ease(seg(t, 41.0, 42.0)), 0.2 + 1.1 * (1 - ease(seg(t, 41.0, 42.0))), -0.15 + 0.15 * (1 - ease(seg(t, 41.0, 42.0))));
        circ(t, { vis: 1, beads: 1, ph: 0.12 * t, compGlow: 0.5, heatC: ease(seg(t, 36.3, 37.1)), heatE: 0, snow: 0 });
        renderer.render(scene, camera);
      }
""")
# F
chips=[("key",42.9,48.8,"LE POINT IMPORTANT",'neon',290,'#ffc41a'),("move",44.7,48.8,"L'ÉLECTRICITÉ DÉPLACE LA CHALEUR",'s',370,Y)]
stage('stageF','pf',42.5,48.9,"LE POINT CLÉ",chips,r"""
      var el = mkLabel("ÉLECTRICITÉ", "#ffc41a", "#1a1400", 1.6); el.position.set(0, -2.75, 0.3); scene.add(el);
      var eb = HF.makeBeam(0xffc41a); scene.add(eb);
      var HP = []; for (var i = 0; i < 6; i++) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff8a2a })); scene.add(m); HP.push(m); }
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        """+FULL+r"""
        circ(t, { vis: 1, beads: 1, ph: 0.12 * t, compGlow: 0.5, heatC: 0.5, heatE: 0.5, snow: 0.4 });
        var ev = ease(seg(t, 44.6, 45.2)); HF.setBeam(eb, new THREE.Vector3(0, -2.55, 0.2), new THREE.Vector3(0, -2.2, 0.2), 0.06, ev); el.visible = ev > 0.01;
        HP.forEach(function (m, i) { var u = (t * 0.3 + i / 6) % 1; m.position.set(lerp(-2.3, 2.3, u), 0.2 + 0.5 * Math.sin(u * 3.14), 0.3); m.visible = t > 45.5; });
        renderer.render(scene, camera);
      }
""")
# G bars
chips=[("more",49.3,52.9,"PLUS DE CHALEUR QUE D'ÉLECTRICITÉ",'neon',290,'#38d27a'),("cold2",53.1,55.8,"MOINS EFFICACE PAR GRAND FROID",'neon',290,'#4aa8ff')]
stage('stageG','pg',48.9,55.9,"LE RENDEMENT",chips,r"""
      var bk = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xffc41a })), bh = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xff8a2a })); bk.geometry.translate(0.5, 0, 0); bh.geometry.translate(0.5, 0, 0); scene.add(bk); scene.add(bh);
      var l1 = mkLabel("ÉLECTRICITÉ", "#ffc41a", "#1a1400", 1.6), l2 = mkLabel("CHALEUR", "#ff8a2a", "#1a0c00", 1.3); l1.position.set(0, 0.7, 0.2); l2.position.set(0, -0.3, 0.2); scene.add(l1); scene.add(l2);
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        """+FULL+r"""
        var k = ease(seg(t, 49.6, 50.8)), cold = ease(seg(t, 53.4, 54.6));
        circ(t, { vis: 0.25, beads: 0.3, ph: 0.12 * t, compGlow: 0.2, heatC: 0, heatE: 0, snow: 0.3 + 0.7 * cold });
        bk.position.set(-0.8, 0.3, 0.1); bk.scale.set(0.5 * k, 1, 1); bh.position.set(-0.8, -0.7, 0.1); bh.scale.set(lerp(1.6, 1.0, cold) * k, 1, 1);
        l1.visible = l2.visible = k > 0.1;
        renderer.render(scene, camera);
      }
""")
# H
chips=[("s1",56.3,61.4,"UN FLUIDE QUI CIRCULE",'s',290,BL),("s2",57.6,61.4,"UN COMPRESSEUR QUI CHAUFFE",'s',370,R),("s3",58.9,61.4,"UNE CHALEUR QU'ON DÉPLACE",'s',450,Y)]
body=LIGHT+CIRC+r"""
      function renderAt(t) {
        if (t < T0 - 0.05 || t > T1 + 0.05) return;
        """+FULL+r"""
        circ(t, { vis: 1, beads: 1, ph: 0.12 * t, compGlow: 0.5, heatC: 0.5, heatE: 0.5, snow: 0.6 });
        renderer.render(scene, camera);
      }
"""
final_stage(v,'stageH','ph',55.9,66.52,("LE RÉSUMÉ",61.6),("ET TOI ?",61.8),chips,60.3,61.6,(61.7,"Tu as déjà vu une<br>pompe à chaleur ?"),62.4,62.6,63.8,64.5,body)
st=[('stageA',0,10.1),('stageB',10.1,20.2),('stageC',20.2,27.5),('stageD',27.5,32.9),('stageE',32.9,42.5),('stageF',42.5,48.9),('stageG',48.9,55.9),('stageH',55.9,66.52)]
make_index('pompe',st,66.52,[],[8.0,12.8,16.0,23.8,30.5,37.0,41.2,45.0,50.0,56.5,61.8])
print('ok')
