/* Wind turbine, airfoil, gears and a face-on alternator for the wind-turbine video. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.makeTurbine = function () {
    var g = new THREE.Group();
    var tower = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 3.6, 18), std(0xdfe4f0, { roughness: 0.5 })); tower.position.y = 1.8; g.add(tower);
    var nac = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 1.1), std(0xeef1f8, { roughness: 0.4 })); nac.position.set(0, 3.75, 0); g.add(nac);
    var rotor = new THREE.Group(); rotor.position.set(0, 3.75, 0.62); g.add(rotor);
    var hub = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), std(0xeef1f8)); rotor.add(hub);
    for (var i = 0; i < 3; i++) {
      var sh = new THREE.Shape(); sh.moveTo(-0.1, 0.1); sh.lineTo(0.1, 0.1); sh.lineTo(0.035, 1.9); sh.lineTo(-0.035, 1.9); sh.closePath();
      var b = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false }), std(0xf3f5fb, { roughness: 0.4 }));
      var pv = new THREE.Group(); pv.rotation.z = (i / 3) * 6.2832; b.rotation.y = 0.25; pv.add(b); rotor.add(pv);
    }
    return { group: g, rotor: rotor };
  };
  HF.makeAirfoil = function () {
    var s = new THREE.Shape(); s.moveTo(-0.9, 0); s.quadraticCurveTo(-0.5, 0.42, 0.9, -0.03); s.quadraticCurveTo(-0.2, -0.13, -0.9, 0);
    var m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false }), std(0xdfe4f0, { roughness: 0.4 })); m.position.z = -0.2; m.rotation.z = -0.15;
    return m;
  };
  HF.makeGear = function (r, teeth, color) {
    var g = new THREE.Group(), m = std(color, { metalness: 0.8, roughness: 0.35, emissive: 0xffa23a, emissiveIntensity: 0.05 });
    var d = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.22, 36), m); d.rotation.x = Math.PI / 2; g.add(d);
    for (var i = 0; i < teeth; i++) { var a = (i / teeth) * 6.2832, t = new THREE.Mesh(new THREE.BoxGeometry(r * 0.28, r * 0.24, 0.22), m); t.position.set(Math.cos(a) * (r + r * 0.08), Math.sin(a) * (r + r * 0.08), 0); t.rotation.z = a; g.add(t); }
    var hubm = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.25, r * 0.25, 0.3, 16), std(0x6a7592, { metalness: 0.8 })); hubm.rotation.x = Math.PI / 2; g.add(hubm);
    return { group: g, mat: m };
  };
  /* face-on alternator: rotor with 8 magnets, 8 fixed coils around */
  HF.makeAlt = function () {
    var g = new THREE.Group(), o = { group: g };
    o.rotor = new THREE.Group(); g.add(o.rotor);
    var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.3, 40), std(0x2a3550, { metalness: 0.6, roughness: 0.5 })); disc.rotation.x = Math.PI / 2; o.rotor.add(disc);
    o.mags = [];
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * 6.2832, m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.34), std(i % 2 ? 0x3a7bff : 0xff4a4a, { emissive: i % 2 ? 0x1a3a9a : 0x9a1a1a, emissiveIntensity: 0.5, roughness: 0.4 }));
      m.position.set(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0); m.rotation.z = a; o.rotor.add(m); o.mags.push(m);
    }
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), std(0xdfe4f0, { metalness: 0.8 })); hub.rotation.x = Math.PI / 2; o.rotor.add(hub);
    o.coils = [];
    for (var j = 0; j < 8; j++) {
      var b = (j / 8) * 6.2832, cg = new THREE.Group(); cg.position.set(Math.cos(b) * 1.6, Math.sin(b) * 1.6, 0); cg.rotation.z = b;
      var cm = std(0xd98a4a, { metalness: 0.8, roughness: 0.35, emissive: 0xffa23a, emissiveIntensity: 0.1 });
      var core = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.34, 0.3), std(0x8a93a8, { metalness: 0.7 })); cg.add(core);
      var rings = [];
      for (var k = 0; k < 6; k++) { var r = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.05, 8, 20), cm); r.rotation.y = Math.PI / 2; r.position.x = -0.2 + k * 0.08; cg.add(r); rings.push(r); }
      g.add(cg); o.coils.push({ group: cg, mat: cm, rings: rings, ang: b });
    }
    o.field = [];
    for (var f = 0; f < 8; f++) { var bm = HF.makeBeam(0xb26bff, 0); g.add(bm); o.field.push(bm); }
    return o;
  };
  HF.updateAlt = function (o, theta, turns, glow) {
    o.rotor.rotation.z = theta;
    o.coils.forEach(function (c, j) {
      var ph = 4 * (c.ang - theta), e = Math.abs(Math.sin(ph));
      c.mat.emissiveIntensity = 0.1 + glow * 0.9 * e;
      c.rings.forEach(function (r, k) { r.visible = k < turns; });
      var bm = o.field[j], a = new THREE.Vector3(Math.cos(c.ang) * 1.3, Math.sin(c.ang) * 1.3, 0.2), b = new THREE.Vector3(Math.cos(c.ang) * 1.05, Math.sin(c.ang) * 1.05, 0.2);
      HF.setBeam(bm, a, b, 0.05, glow * Math.abs(Math.cos(ph)) * 0.85);
    });
  };
})();
(function () {
  var HF = window.HF;
  if (!HF.makeBeam) {
    HF.makeBeam = function (color, op) { var m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 6), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: op == null ? 1 : op, toneMapped: false, depthWrite: false })); m.visible = false; return m; };
    HF.setBeam = function (m, a, b, r, op) { var d = b.clone().sub(a), len = d.length(); if (len < 1e-4 || op <= 0) { m.visible = false; return; } m.visible = true; m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.scale.set(r, len, r); if (op != null) m.material.opacity = op; };
  }
})();
