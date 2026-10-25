/* Pin tumbler lock cutaway: plug, housing, pin stacks, springs, key, pick and tension wrench. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.LOCK = { xs: [-2.0, -1.0, 0.0, 1.0, 2.0], r: [0.45, 0.25, 0.55, 0.35, 0.15], PIN: 0.9, DRV: 0.45, TOP: 1.5 };
  HF.makeLock = function () {
    var L = HF.LOCK, g = new THREE.Group(), o = {};
    o.group = g;
    o.hMat = std(0x2a4f9a, { roughness: 0.4, metalness: 0.4, transparent: true, opacity: 0.3, emissive: 0x4aa8ff, emissiveIntensity: 0, depthWrite: false });
    var house = new THREE.Mesh(new THREE.BoxGeometry(6.6, 3.0, 1.3), o.hMat); house.position.set(0, 0.3, 0); g.add(house);
    var upper = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.5, 1.3), std(0x1a2b52, { roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.3, depthWrite: false })); upper.position.set(0, 0.75, 0); g.add(upper);
    o.pMat = std(0xc99a4a, { roughness: 0.35, metalness: 0.8, transparent: true, opacity: 0.55, emissive: 0xff8a2a, emissiveIntensity: 0, depthWrite: false });
    var plugG = new THREE.Group(); plugG.position.set(0, -0.55, 0); g.add(plugG); o.plug = plugG;
    var plug = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 6.0, 40), o.pMat); plug.rotation.z = Math.PI / 2; plugG.add(plug);
    for (var k = 0; k < 3; k++) {
      var a = (k / 3) * 6.2832, st = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.05, 0.05), std(0xfff0c0, { emissive: 0xffd27a, emissiveIntensity: 0.8 }));
      st.position.set(0, Math.cos(a) * 0.56, Math.sin(a) * 0.56); st.rotation.x = a; plugG.add(st);
    }
    // shear line
    o.shearMat = new THREE.MeshBasicMaterial({ color: 0x38d6ff, transparent: true, opacity: 0 });
    var sh = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.04, 0.04), o.shearMat); sh.position.set(0, 0, 0.66); g.add(sh);
    var sh2 = sh.clone(); sh2.position.z = -0.66; g.add(sh2); o.shear = [sh, sh2];
    o.pins = L.xs.map(function (x, i) {
      var ps = new THREE.Group(); ps.position.x = x; g.add(ps);
      var kh = L.PIN - L.r[i];
      var kMat = std(0xdfe4f0, { metalness: 0.85, roughness: 0.3, emissive: 0x38d27a, emissiveIntensity: 0 });
      var key = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.15, kh, 16), kMat); ps.add(key);
      var dMat = std(0xe8b22a, { metalness: 0.85, roughness: 0.3, emissive: 0xff8a2a, emissiveIntensity: 0 });
      var drv = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, L.DRV, 16), dMat); ps.add(drv);
      var sMat = std(0xb9a8e8, { metalness: 0.6, roughness: 0.4, emissive: 0xb26bff, emissiveIntensity: 0 });
      var pts = []; for (var n = 0; n <= 80; n++) { var s = n / 80, an = s * 6.2832 * 6; pts.push(new THREE.Vector3(0.15 * Math.cos(an), s, 0.15 * Math.sin(an))); }
      var spring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.035, 6), sMat); ps.add(spring);
      return { g: ps, key: key, drv: drv, spring: spring, kMat: kMat, dMat: dMat, sMat: sMat, kh: kh };
    });
    // key blade
    o.keyMat = std(0xd9b24a, { metalness: 0.9, roughness: 0.3 });
    o.keyG = new THREE.Group(); g.add(o.keyG);
    var base = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.1, 0.16), o.keyMat); base.position.set(0, -1.05, 0); o.keyG.add(base);
    o.keySegs = L.xs.map(function (x, i) {
      var h = 0.15 + L.r[i], m = new THREE.Mesh(new THREE.BoxGeometry(0.62, h, 0.16), o.keyMat);
      m.position.set(x, -1.0 + h / 2, 0); o.keyG.add(m); return m;
    });
    var bow = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 6), o.keyMat); bow.rotation.x = Math.PI / 2; bow.position.set(-3.9, -1.0, 0); o.keyG.add(bow);
    // pick and tension wrench
    o.pickMat = std(0xcfd6e6, { metalness: 0.9, roughness: 0.3 });
    o.pick = new THREE.Group(); g.add(o.pick);
    var rod = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.07, 0.07), o.pickMat); rod.position.set(-2.5, 0, 0); o.pick.add(rod);
    var hook = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), o.pickMat); hook.position.set(0, 0.07, 0); o.pick.add(hook);
    var grip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.22), std(0x3a7bff, { roughness: 0.6 })); grip.position.set(-5.2, 0, 0); o.pick.add(grip);
    o.wrench = new THREE.Group(); g.add(o.wrench);
    var wr = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.07, 0.07), o.pickMat); wr.position.set(-0.4, 0, 0); o.wrench.add(wr);
    var wl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.8, 0.07), o.pickMat); wl.position.set(-0.8, -0.4, 0); o.wrench.add(wl);
    o.wrench.position.set(-2.95, -0.9, 0);
    // torque arrow
    o.arrowMat = new THREE.MeshBasicMaterial({ color: 0x38d6ff, transparent: true, opacity: 0 });
    var arc = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.035, 8, 40, 3.6), o.arrowMat); arc.rotation.y = Math.PI / 2; arc.position.set(-3.5, -0.55, 0); g.add(arc);
    var cone = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 12), o.arrowMat); cone.position.set(-3.5, -0.55 - 0.85 * Math.sin(3.6) * 1, 0); g.add(cone);
    o.arrow = [arc, cone];
    return o;
  };
  var ease = HF.ease, seg = HF.seg, lerp = HF.lerp;
  /* st: plugAng, keyDx (null = hidden), pickOn, pickX, pickY, wrenchOn, arrowOn, pin: [{s, set, bind}] */
  HF.updateLock = function (o, st) {
    var L = HF.LOCK;
    o.plug.rotation.x = st.plugAng || 0;
    var bigRot = (st.plugAng || 0) > 0.4;
    o.keyG.visible = st.keyDx != null;
    if (st.keyDx != null) o.keyG.position.x = st.keyDx;
    var edge = 0.12;
    o.pins.forEach(function (p, i) {
      var x = L.xs[i], r = L.r[i], s = (st.pin[i] && st.pin[i].s) || 0, setF = (st.pin[i] && st.pin[i].set) || 0;
      if (st.keyDx != null) {
        var top = -1.05;
        o.keySegs.forEach(function (m, j) {
          var cx = L.xs[j] + st.keyDx, c = ease(seg(0.31 - Math.abs(x - cx), 0, edge));
          top = Math.max(top, lerp(-1.05, -0.9 + r_(j), c));
        });
        s = Math.max(s, Math.min(r, Math.max(0, top + 0.9)));
      }
      var keyTop = -r + s * (1 - setF), drvBottom = -r + Math.max(s, setF * r);
      var kb = keyTop - p.kh;
      p.key.position.y = (kb + keyTop) / 2; p.key.visible = !bigRot;
      p.drv.position.y = drvBottom + L.DRV / 2;
      var dtop = drvBottom + L.DRV;
      p.spring.position.y = dtop; p.spring.scale.y = L.TOP - dtop;
      var bind = (st.pin[i] && st.pin[i].bind) || 0, glow = (st.pin[i] && st.pin[i].glow) || 0;
      p.dMat.emissiveIntensity = 0.25 + 0.9 * bind + 0.9 * (st.hlDrv || 0);
      p.dMat.emissive.setHex(bind > 0 ? 0xff5a1a : 0xff8a2a);
      p.kMat.emissiveIntensity = 0.12 + 0.9 * setF + 0.9 * (st.hlKey || 0);
      p.sMat.emissiveIntensity = 0.2 + 0.9 * (st.hlSpring || 0);
    });
    function r_(j) { return L.r[j]; }
    o.hMat.emissiveIntensity = 0.5 * (st.hlHouse || 0);
    o.pMat.emissiveIntensity = 0.5 * (st.hlPlug || 0);
    o.shearMat.opacity = (st.shear || 0) * (0.7 + 0.3 * Math.sin((st.t || 0) * 6));
    o.pick.visible = !!st.pickOn; if (st.pickOn) o.pick.position.set(st.pickX, st.pickY, 0);
    o.wrench.visible = !!st.wrenchOn;
    o.wrench.rotation.x = (st.plugAng || 0) * 1.0;
    o.arrowMat.opacity = 0.9 * (st.arrowOn || 0) * (0.7 + 0.3 * Math.sin((st.t || 0) * 5));
  };
})();
