/* Ballpoint tip cutaway, whole pen, paper with fibres and the ink trail. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.makeTip = function () {
    var g = new THREE.Group(), o = { group: g };
    var prof = [new THREE.Vector2(0.43, -0.26), new THREE.Vector2(0.6, -0.3), new THREE.Vector2(0.78, 0.2), new THREE.Vector2(0.8, 1.0)];
    o.sockMat = std(0xb8c0d4, { metalness: 0.7, roughness: 0.35, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false, emissive: 0x4aa8ff, emissiveIntensity: 0 });
    g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), o.sockMat));
    o.tubeMat = std(0x9aa3b8, { transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false, emissive: 0x4aa8ff, emissiveIntensity: 0 });
    var tube = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.9, 32, 1, true), o.tubeMat); tube.position.y = 1.95; g.add(tube);
    o.inkMat = std(0x1a3a9a, { transparent: true, opacity: 0.8, emissive: 0x2a5aff, emissiveIntensity: 0.45, roughness: 0.3, depthWrite: false });
    o.ink = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 1.85, 28), o.inkMat); o.ink.position.y = 1.95; g.add(o.ink);
    o.ballG = new THREE.Group(); g.add(o.ballG);
    o.ballMat = std(0xd9dee9, { metalness: 0.9, roughness: 0.25, emissive: 0x4aa8ff, emissiveIntensity: 0 });
    o.ballG.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), o.ballMat));
    var rnd = HF.mulberry32(3);
    for (var i = 0; i < 9; i++) {
      var a = rnd() * 6.2832, b = Math.acos(2 * rnd() - 1), d = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xffc41a : 0xff4a4a }));
      d.position.set(0.5 * Math.sin(b) * Math.cos(a), 0.5 * Math.cos(b), 0.5 * Math.sin(b) * Math.sin(a)); o.ballG.add(d);
    }
    o.coat = new THREE.Mesh(new THREE.SphereGeometry(0.535, 28, 20), new THREE.MeshBasicMaterial({ color: 0x2a4aff, transparent: true, opacity: 0, depthWrite: false })); g.add(o.coat);
    o.beads = HF.makeBeads(26, 0x8fb4ff, 0.11); o.beads.position.y = 0; g.add(o.beads);
    return o;
  };
  /* beads slowly sinking in the ink column; speed controls viscosity */
  HF.updateInkBeads = function (o, t, speed, vis) {
    var a = o.beads.geometry.attributes.position.array, n = o.beads.userData.n, rnd = HF.mulberry32(9);
    for (var i = 0; i < n; i++) {
      var ang = rnd() * 6.2832, rad = 0.15 + rnd() * 0.5, ph = rnd(), u = ((ph - t * speed) % 1 + 1) % 1;
      a[i * 3] = rad * Math.cos(ang) * (0.6 + 0.4 * u); a[i * 3 + 1] = 0.9 + u * 1.9; a[i * 3 + 2] = rad * Math.sin(ang);
    }
    o.beads.geometry.attributes.position.needsUpdate = true; o.beads.material.opacity = 0.9 * vis;
  };
  HF.makePaper = function (w, d) {
    var g = new THREE.Group();
    var p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), std(0xe9edf5, { roughness: 0.95 })); p.position.y = -0.54; g.add(p);
    var rnd = HF.mulberry32(21), pts = [];
    for (var i = 0; i < 160; i++) { var x = (rnd() - 0.5) * (w - 0.2), z = (rnd() - 0.5) * (d - 0.2), a = rnd() * 3.14, l = 0.12 + rnd() * 0.18; pts.push(new THREE.Vector3(x, -0.495, z), new THREE.Vector3(x + Math.cos(a) * l, -0.495, z + Math.sin(a) * l)); }
    var fib = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x9aa6c2, transparent: true, opacity: 0.8 }));
    g.add(fib);
    return g;
  };
  /* ink line on paper from x0 to x1, wetness drives a glossy glow */
  HF.makeTrail = function () {
    var mat = new THREE.MeshStandardMaterial({ color: 0x14246a, emissive: 0x3a5aff, emissiveIntensity: 0.6, roughness: 0.3 });
    var m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.02, 0.1), mat); m.position.y = -0.48; m.visible = false;
    return { mesh: m, mat: mat };
  };
  HF.setTrail = function (tr, x0, x1, z) {
    var l = Math.max(0.0001, x1 - x0); tr.mesh.visible = l > 0.01; tr.mesh.scale.x = l; tr.mesh.position.set((x0 + x1) / 2, -0.48, z || 0);
  };
  HF.makePen = function () {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.6, 20), std(0x3a7bff, { roughness: 0.4, metalness: 0.3 })); body.position.y = 1.6; g.add(body);
    var grip = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.7, 20), std(0x151a26, { roughness: 0.8 })); grip.position.y = 0.55; g.add(grip);
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.35, 20), std(0xc9cfdd, { metalness: 0.9, roughness: 0.3 })); tip.rotation.x = Math.PI; tip.position.y = 0.0; g.add(tip);
    var clip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 0.05), std(0xc9cfdd, { metalness: 0.9 })); clip.position.set(0.15, 2.4, 0); g.add(clip);
    var top = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.15, 20), std(0xdfe4f0, { metalness: 0.8 })); top.position.y = 2.95; g.add(top);
    return g;
  };
})();
