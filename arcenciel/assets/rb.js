/* Rainbow arcs, landscape, drop ray tracing, beams, eye and observers. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.RB = [0xff2a2a, 0xff8a1a, 0xffe21a, 0x3ad23a, 0x2a8aff, 0x4a3aff, 0xa23aff];
  HF.makeArc = function (cx, R, step, tube, z) {
    var g = new THREE.Group(), arcs = [];
    for (var k = 0; k < 7; k++) {
      var r = R - k * step, pts = [];
      for (var i = 0; i <= 80; i++) { var a = (i / 80) * Math.PI; pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0)); }
      var geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, tube, 8, false);
      var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: HF.RB[k], transparent: true, opacity: 0.9, toneMapped: false }));
      g.add(m); arcs.push(m);
    }
    g.position.set(cx, 0, z == null ? -3 : z);
    return { group: g, arcs: arcs };
  };
  HF.setArc = function (a, frac, ops) {
    a.arcs.forEach(function (m, k) {
      m.geometry.setDrawRange(0, Math.floor(HF.clamp(frac, 0, 1) * 96) * 8 * 6);
      m.material.opacity = ops ? ops[k] : 0.9;
    });
  };
  HF.makeLandscape = function (seed) {
    var g = new THREE.Group();
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), std(0x07140e, { roughness: 1 })); ground.rotation.x = -Math.PI / 2; g.add(ground);
    var rnd = HF.mulberry32(seed || 5);
    for (var i = 0; i < 7; i++) {
      var h = new THREE.Mesh(new THREE.ConeGeometry(1.4 + rnd() * 1.2, 0.8 + rnd() * 0.9, 6), std(0x0d2418, { flatShading: true, roughness: 1 }));
      h.position.set(-7 + i * 2.4 + rnd(), 0.3, -5.5 - rnd() * 2); g.add(h);
    }
    var sun = HF.makeGlow(0xffd27a, 3.2); sun.position.set(-3.8, 3.6, -3.5); sun.material.opacity = 0.8; g.add(sun);
    var rain = HF.makeRain(280, 4.5, 4.2, 2.6, 17); rain.position.set(2.6, 0, -1.4); g.add(rain);
    return { group: g, rain: rain, sun: sun };
  };
  HF.makeBeam = function (color, op) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 6), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: op == null ? 1 : op, toneMapped: false, depthWrite: false }));
    m.visible = false; return m;
  };
  HF.setBeam = function (m, a, b, r, op) {
    var d = b.clone().sub(a), len = d.length();
    if (len < 1e-4 || op <= 0) { m.visible = false; return; }
    m.visible = true; m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.scale.set(r, len, r);
    if (op != null) m.material.opacity = op;
  };
  function refract(d, N, n1, n2) {
    var cosi = -N.dot(d), eta = n1 / n2, k = 1 - eta * eta * (1 - cosi * cosi);
    return d.clone().multiplyScalar(eta).add(N.clone().multiplyScalar(eta * cosi - Math.sqrt(Math.max(0, k)))).normalize();
  }
  /* ray through a sphere of radius R at impact height b: returns P1, P2, P3, end and the exit direction */
  HF.traceDrop = function (R, b, n) {
    var d0 = new THREE.Vector3(1, 0, 0), P1 = new THREE.Vector3(-Math.sqrt(R * R - b * b), b, 0), N1 = P1.clone().normalize();
    var d1 = refract(d0, N1, 1, n), P2 = P1.clone().add(d1.clone().multiplyScalar(-2 * P1.dot(d1)));
    var N2 = P2.clone().normalize(), d2 = d1.clone().sub(N2.clone().multiplyScalar(2 * d1.dot(N2)));
    var P3 = P2.clone().add(d2.clone().multiplyScalar(-2 * P2.dot(d2))), N3 = P3.clone().normalize().negate();
    var d3 = refract(d2, N3, n, 1), end = P3.clone().add(d3.clone().multiplyScalar(R * 2.4));
    return { P1: P1, P2: P2, P3: P3, end: end, d3: d3 };
  };
  HF.makeEye = function () {
    var g = new THREE.Group();
    var w = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), std(0xf2f4fa, { roughness: 0.4 })); g.add(w);
    var ir = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), std(0x3a7bff, { roughness: 0.3 })); ir.position.x = 0.22; g.add(ir);
    var pu = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), std(0x05070d)); pu.position.x = 0.32; g.add(pu);
    return g;
  };
  HF.makePerson = function (color) {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.7, 12), std(color, { roughness: 0.6 })); body.position.y = 0.35; g.add(body);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), std(0xf0c9a0)); head.position.y = 0.88; g.add(head);
    return g;
  };
})();
