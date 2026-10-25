/* Induction hob, coil, pan, magnetic field loops, eddy currents, hand and magnet. */
(function () {
  var HF = window.HF, std = HF.std;
  var W = 3.2; // angular rate of the alternating current (rad/s, illustrative)
  HF.AC = W;
  HF.makeCoil = function (R, turns) {
    var pts = [], n = Math.floor(turns * 40);
    for (var i = 0; i <= n; i++) {
      var s = i / n, a = s * turns * 6.2832, r = 0.25 + (R - 0.25) * s;
      pts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
    }
    var curve = new THREE.CatmullRomCurve3(pts);
    var mat = std(0xd98a4a, { metalness: 0.8, roughness: 0.35, emissive: 0xffa23a, emissiveIntensity: 0.1 });
    var mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 320, 0.035, 8), mat);
    return { mesh: mesh, curve: curve, mat: mat };
  };
  HF.makeHob = function () {
    var g = new THREE.Group();
    var base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 3.4), std(0x070b14, { roughness: 0.8, metalness: 0.1 })); base.position.y = -0.55; g.add(base);
    var glassMat = std(0x070b16, { roughness: 0.9, metalness: 0.0, transparent: true, opacity: 0.96, emissive: 0x1a4a8a, emissiveIntensity: 0 });
    var glass = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.06, 3.4), glassMat); glass.position.y = 0.03; g.add(glass);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xcfd8ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.04, 48), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.065; g.add(ring);
    var coil = HF.makeCoil(1.0, 5); coil.mesh.position.y = -0.16; g.add(coil.mesh);
    return { group: g, glassMat: glassMat, ringMat: ringMat, coil: coil };
  };
  HF.makePan = function () {
    var g = new THREE.Group();
    var baseMat = std(0x6a7288, { metalness: 0.6, roughness: 0.55, emissive: 0xff5a00, emissiveIntensity: 0 });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 40), baseMat); base.position.y = 0.04; g.add(base);
    var wallMat = std(0xc2cadc, { metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 1 });
    var wall = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.6, 40, 1, true), wallMat); wall.position.y = 0.38; g.add(wall);
    var handle = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.17), std(0x151a26, { roughness: 0.7 })); handle.position.set(1.42, 0.55, 0); g.add(handle);
    var waterMat = std(0x3a8cff, { roughness: 0.2, transparent: true, opacity: 0.85, emissive: 0x1a4a9a, emissiveIntensity: 0.4 });
    var water = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.9, 0.02, 40), waterMat); water.position.y = 0.46; g.add(water);
    var bubbles = HF.makeParticles(46, 4, 0.12, 0xffffff); bubbles.position.set(0, 0.42, 0); g.add(bubbles);
    var steam = HF.makeParticles(70, 6, 0.28, 0xffffff); steam.position.set(0, 0.7, 0); g.add(steam);
    return { group: g, baseMat: baseMat, wallMat: wallMat, water: water, waterMat: waterMat, bubbles: bubbles, steam: steam };
  };
  /* closed field loops around the coil axis; beads slide back and forth with the current */
  HF.makeField = function (R) {
    var g = new THREE.Group(), lines = [], nb = 0;
    var A = [0.45, 0.8, 1.15], B = [0.9, 1.35, 1.8];
    for (var f = 0; f < 3; f++) for (var side = -1; side <= 1; side += 2) for (var k = 0; k < 3; k++) {
      var pts = [], phi = (f / 3) * Math.PI;
      for (var i = 0; i <= 60; i++) {
        var s = (i / 60) * 6.2832, x = side * (R + A[k] * Math.cos(s)), y = 0.15 + B[k] * Math.sin(s);
        pts.push(new THREE.Vector3(x * Math.cos(phi), y, -x * Math.sin(phi)));
      }
      var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xb26bff, transparent: true, opacity: 0, depthWrite: false }));
      g.add(line); lines.push({ line: line, pts: pts, side: side });
    }
    var beads = HF.makeBeads(lines.length * 4, 0xe3c8ff, 0.14); g.add(beads);
    return { group: g, lines: lines, beads: beads };
  };
  HF.updateField = function (fd, t, vis) {
    var pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * W * 0.5));
    var arr = fd.beads.geometry.attributes.position.array, ph = 0.2 * Math.sin(t * W);
    fd.lines.forEach(function (L, j) {
      L.line.material.opacity = vis * (0.25 + 0.4 * pulse);
      for (var i = 0; i < 4; i++) {
        var u = ((i / 4 + ph * L.side) % 1 + 1) % 1, p = L.pts[Math.floor(u * 60)];
        var o = (j * 4 + i) * 3; arr[o] = p.x; arr[o + 1] = p.y; arr[o + 2] = p.z;
      }
    });
    fd.beads.geometry.attributes.position.needsUpdate = true; fd.beads.material.opacity = 0.95 * vis;
  };
  HF.makeEddy = function () {
    var g = new THREE.Group(), radii = [0.3, 0.55, 0.8], rings = [];
    radii.forEach(function (r) {
      var m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 6, 60), new THREE.MeshBasicMaterial({ color: 0xff9a2a, transparent: true, opacity: 0 }));
      m.rotation.x = Math.PI / 2; g.add(m); rings.push(m);
    });
    var beads = HF.makeBeads(radii.length * 14, 0xffc46a, 0.17); g.add(beads);
    return { group: g, rings: rings, beads: beads, radii: radii };
  };
  HF.updateEddy = function (ed, t, vis) {
    var arr = ed.beads.geometry.attributes.position.array, sw = 1.3 * Math.sin(t * W);
    ed.radii.forEach(function (r, k) {
      ed.rings[k].material.opacity = 0.65 * vis;
      for (var i = 0; i < 14; i++) {
        var a = (i / 14) * 6.2832 + sw * (k % 2 ? -1 : 1), o = (k * 14 + i) * 3;
        arr[o] = r * Math.cos(a); arr[o + 1] = 0; arr[o + 2] = r * Math.sin(a);
      }
    });
    ed.beads.geometry.attributes.position.needsUpdate = true; ed.beads.material.opacity = 0.95 * vis;
  };
  HF.updateCoil = function (hob, t, cur) {
    hob.coil.mat.emissiveIntensity = 0.1 + cur * (0.5 + 0.5 * Math.abs(Math.sin(t * W * 0.5)));
  };
  HF.makeHand = function () {
    var g = new THREE.Group(), skin = std(0xf0c9a0, { roughness: 0.7 });
    var palm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 0.6), skin); g.add(palm);
    for (var i = 0; i < 4; i++) { var f = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.4), skin); f.position.set(0.27, -0.02, -0.22 + i * 0.145); f.rotation.y = 0; g.add(f); }
    var th = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.12), skin); th.position.set(-0.05, -0.02, 0.38); th.rotation.y = 0.5; g.add(th);
    var wrist = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.38), std(0x3a7bff)); wrist.position.set(-0.6, 0, 0); g.add(wrist);
    return g;
  };
  HF.makeMagnet = function () {
    var g = new THREE.Group();
    var red = std(0xe0443a, { roughness: 0.4 }), tip = std(0xdfe4f0, { metalness: 0.8, roughness: 0.3 });
    var bar = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.16), red); bar.position.y = 0.22; g.add(bar);
    [-0.21, 0.21].forEach(function (x) {
      var l = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.16), red); l.position.set(x, 0.05, 0); g.add(l);
      var t = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), tip); t.position.set(x, -0.18, 0); g.add(t);
    });
    return g;
  };
  HF.makeClassicHob = function () {
    var g = new THREE.Group();
    var base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 3.4), std(0x0b101c, { roughness: 0.6 })); base.position.y = -0.25; g.add(base);
    var mat = std(0x3a1010, { emissive: 0xff2a10, emissiveIntensity: 0.1, roughness: 0.5 });
    var d = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.06, 40), mat); d.position.y = 0.03; g.add(d);
    return { group: g, mat: mat };
  };
})();
