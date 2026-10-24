/* Low-poly city, towers, routers, satellites and rings for the location chapters. */
(function () {
  var HF = window.HF;
  function std(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7, metalness: 0.1 }, o || {})); }
  HF.makeCity = function (seed) {
    var rnd = HF.mulberry32(seed || 3);
    var g = new THREE.Group();
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(16, 20), std(0x0f1626, { roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; g.add(ground);
    var blocks = [];
    for (var ix = -3; ix <= 3; ix++) for (var iz = -4; iz <= 4; iz++) {
      var x = ix * 1.15, z = iz * 1.15;
      if (Math.abs(ix) === 0 && iz === 0) continue;
      var h = 0.18 + rnd() * 0.75;
      var w = 0.7 + rnd() * 0.15, d = 0.7 + rnd() * 0.15;
      var cc = new THREE.Color(); var q = rnd(); cc.setRGB(0.07 + q * 0.04, 0.1 + q * 0.05, 0.19 + q * 0.07);
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), std(cc.getHex(), { flatShading: true, roughness: 0.85 }));
      m.scale.y = h; m.position.set(x, h / 2, z);
      g.add(m); blocks.push({ mesh: m, h: h, x: x, z: z, w: w, d: d });
    }
    return { group: g, blocks: blocks, ground: ground };
  };
  HF.makeTower = function (color) {
    var g = new THREE.Group();
    var mast = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.06), std(0x9aa6c4, { metalness: 0.5 }));
    mast.position.y = 0.65; g.add(mast);
    for (var i = 0; i < 3; i++) {
      var p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.03), std(0xe6e9f2));
      var a = i * 2.094; p.position.set(Math.cos(a) * 0.1, 1.28, Math.sin(a) * 0.1); p.rotation.y = -a; g.add(p);
    }
    var gl = HF.makeGlow(color || 0xff8a2a, 0.9); gl.position.y = 1.3; g.add(gl);
    g.userData.glow = gl;
    return g;
  };
  HF.makeRouter = function (color) {
    var g = new THREE.Group();
    var b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), std(0xe6e9f2));
    g.add(b);
    [-0.05, 0.05].forEach(function (x) { var a = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 6), std(0x2a2f42)); a.position.set(x, 0.09, 0); g.add(a); });
    var gl = HF.makeGlow(color || 0xb26bff, 0.6); gl.position.y = 0.05; g.add(gl);
    g.userData.glow = gl;
    return g;
  };
  HF.makeSatellite = function () {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), std(0xc9ccd8, { metalness: 0.6 })));
    [-1, 1].forEach(function (s) { var p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.32), std(0x2a5fd0, { metalness: 0.4, emissive: 0x0a2a70, emissiveIntensity: 0.5 })); p.position.x = s * 0.6; g.add(p); });
    return g;
  };
  HF.makeFigure = function (color) {
    var g = new THREE.Group();
    var m = std(color || 0xe8b024, { roughness: 0.6 });
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.34, 14), m); body.position.y = 0.17;
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), m); head.position.y = 0.42;
    g.add(body, head);
    return g;
  };
  /* flat ring on the ground; call HF.setRing(r, radius, opacity) */
  HF.makeRing = function (color, fill) {
    var g = new THREE.Group();
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 80), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; g.add(ring);
    var disc = null;
    if (fill) {
      disc = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.position.y = -0.002; g.add(disc);
    }
    g.userData = { ring: ring, disc: disc };
    return g;
  };
  HF.setRing = function (g, r, op, fillOp) {
    g.visible = op > 0.002 || (fillOp || 0) > 0.002;
    g.scale.set(Math.max(0.001, r), 1, Math.max(0.001, r));
    g.userData.ring.material.opacity = op;
    if (g.userData.disc) g.userData.disc.material.opacity = fillOp || 0;
  };
})();
