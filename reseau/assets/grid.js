/* Power grid pieces: pylons, plant, house, substation, pole, transformer, generator. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.setBeadsOn = function (beads, pts, t, speed, ph, a0, a1) {
    var n = beads.userData.n, arr = beads.geometry.attributes.position.array, m = pts.length - 1;
    a0 = a0 == null ? 0 : a0; a1 = a1 == null ? 1 : a1;
    for (var i = 0; i < n; i++) {
      var u = (((i / n) + t * speed + (ph || 0)) % 1 + 1) % 1; u = a0 + u * (a1 - a0);
      var f = u * m, k = Math.min(m - 1, Math.floor(f)), q = f - k, p0 = pts[k], p1 = pts[k + 1];
      arr[i * 3] = p0.x + (p1.x - p0.x) * q; arr[i * 3 + 1] = p0.y + (p1.y - p0.y) * q; arr[i * 3 + 2] = p0.z + (p1.z - p0.z) * q;
    }
    beads.geometry.attributes.position.needsUpdate = true;
  };
  HF.makePylon = function (h) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.36, h, 4, 5, true), new THREE.MeshBasicMaterial({ color: 0xaab6d4, wireframe: true })); body.position.y = h / 2; body.rotation.y = Math.PI / 4; g.add(body);
    var steel = std(0x8a93a8, { metalness: 0.7, roughness: 0.4 });
    [0.66, 0.8, 0.94].forEach(function (f, i) {
      var arm = new THREE.Mesh(new THREE.BoxGeometry(i === 2 ? 1.0 : 1.5, 0.05, 0.05), steel); arm.position.y = h * f; g.add(arm);
      [-1, 1].forEach(function (s) { var ins = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 6), std(0xdfe4f0, { roughness: 0.3 })); ins.position.set(s * (i === 2 ? 0.5 : 0.75), h * f - 0.1, 0); g.add(ins); });
    });
    return g;
  };
  HF.makePlant = function () {
    var g = new THREE.Group(), wall = std(0x3a4a6a, { roughness: 0.8, flatShading: true });
    var hall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.5), wall); hall.position.y = 0.55; g.add(hall);
    var block = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.7, 1.2), wall); block.position.set(-1.0, 0.85, 0); g.add(block);
    var chim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 2.4, 10), std(0x5a6580, { roughness: 0.8 })); chim.position.set(0.9, 1.2, -0.3); g.add(chim);
    var tower = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.62, 1.6, 16, 1, true), std(0x6a7592, { roughness: 0.9, side: THREE.DoubleSide })); tower.position.set(1.7, 0.8, 0.5); g.add(tower);
    var win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.02), new THREE.MeshBasicMaterial({ color: 0xffc41a })); win.position.set(0, 0.7, 0.76); g.add(win);
    var steam = HF.makeParticles(40, 3, 0.4, 0xdfe6f5); steam.position.set(1.7, 1.6, 0.5); g.add(steam);
    return { group: g, steam: steam };
  };
  HF.makeHouse = function () {
    var g = new THREE.Group();
    var b = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 1.2), std(0x4a5a7a, { roughness: 0.8, flatShading: true })); b.position.y = 0.45; g.add(b);
    var r = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.7, 4), std(0x8a3a3a, { roughness: 0.9, flatShading: true })); r.position.y = 1.25; r.rotation.y = Math.PI / 4; g.add(r);
    var wmat = new THREE.MeshBasicMaterial({ color: 0xffd27a }); var w = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.02), wmat); w.position.set(0.35, 0.55, 0.61); g.add(w);
    var door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.02), std(0x2a2f3a)); door.position.set(-0.3, 0.28, 0.61); g.add(door);
    var plug = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.04), std(0xeef1f8)); plug.position.set(0.76, 0.3, 0.2); plug.rotation.y = Math.PI / 2; g.add(plug);
    var glow = HF.makeGlow(0xffd27a, 1.6); glow.position.set(0.35, 0.55, 0.8); g.add(glow);
    return { group: g, wmat: wmat, glow: glow };
  };
  HF.makeSubstation = function () {
    var g = new THREE.Group();
    var pad = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 1.6), std(0x2a3550, { roughness: 1 })); pad.position.y = 0.03; g.add(pad);
    [-0.6, 0.0, 0.6].forEach(function (x) {
      var t = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.4), std(0x8a93a8, { metalness: 0.5, roughness: 0.5 })); t.position.set(x, 0.3, 0); g.add(t);
      var ins = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.32, 6), std(0xdfe4f0)); ins.position.set(x, 0.72, 0); g.add(ins);
    });
    var fence = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 1.6), new THREE.MeshBasicMaterial({ color: 0x6a7592, wireframe: true })); fence.position.y = 0.15; g.add(fence);
    return g;
  };
  HF.makePole = function () {
    var g = new THREE.Group();
    var p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.8, 6), std(0x6a4a2a, { roughness: 1 })); p.position.y = 0.9; g.add(p);
    var t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 14), std(0x8a93a8, { metalness: 0.5 })); t.position.set(0, 1.6, 0); g.add(t);
    var arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), std(0x6a4a2a)); arm.position.y = 1.78; g.add(arm);
    return g;
  };
  /* transformer: iron core, primary coil (6 rings) on the left leg, secondary rings (up to 12) on the right leg */
  HF.makeTransformer = function () {
    var g = new THREE.Group(), iron = std(0x8a93a8, { metalness: 0.7, roughness: 0.45, emissive: 0x4aa8ff, emissiveIntensity: 0 });
    [[0, 1.5, 3.6, 0.5], [0, -1.5, 3.6, 0.5], [-1.55, 0, 0.5, 3.5], [1.55, 0, 0.5, 3.5]].forEach(function (b) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(b[2], b[3], 0.6), iron); m.position.set(b[0], b[1], 0); g.add(m);
    });
    var copper = std(0xd98a4a, { metalness: 0.8, roughness: 0.35, emissive: 0xffa23a, emissiveIntensity: 0.1 });
    var prim = [], sec = [];
    for (var i = 0; i < 6; i++) { var r = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 8, 28), copper); r.rotation.x = Math.PI / 2; r.position.set(-1.55, -1.0 + i * 0.4, 0); g.add(r); prim.push(r); }
    var copper2 = std(0xe0c04a, { metalness: 0.8, roughness: 0.35, emissive: 0xffd24a, emissiveIntensity: 0.1 });
    for (var j = 0; j < 12; j++) { var s = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 8, 28), copper2); s.rotation.x = Math.PI / 2; s.position.set(1.55, -1.1 + j * 0.2, 0); g.add(s); sec.push(s); }
    // field loop (rectangle inside the core) with beads
    var loop = [new THREE.Vector3(-1.55, 1.5, 0.35), new THREE.Vector3(1.55, 1.5, 0.35), new THREE.Vector3(1.55, -1.5, 0.35), new THREE.Vector3(-1.55, -1.5, 0.35), new THREE.Vector3(-1.55, 1.5, 0.35)];
    var path = []; for (var q = 0; q < 4; q++) for (var k = 0; k < 20; k++) path.push(loop[q].clone().lerp(loop[q + 1], k / 20)); path.push(loop[0].clone());
    var beads = HF.makeBeads(26, 0xb26bff, 0.16); g.add(beads);
    var bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1, 0.35), new THREE.MeshBasicMaterial({ color: 0xffc41a })); g.add(bar1);
    var bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1, 0.35), new THREE.MeshBasicMaterial({ color: 0x38d6ff })); g.add(bar2);
    return { group: g, iron: iron, prim: prim, sec: sec, copper: copper, copper2: copper2, path: path, beads: beads, bar1: bar1, bar2: bar2 };
  };
})();
