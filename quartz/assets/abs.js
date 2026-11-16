/* Car, wheel, road, brake disc, tone ring, ECU and valve block for the ABS chapters. */
(function () {
  var HF = window.HF;
  function std(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0.1 }, o || {})); }
  HF.std = std;
  HF.makeWheel = function (r, w) {
    var g = new THREE.Group(), spin = new THREE.Group();
    g.add(spin);
    var tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 28), std(0x151a26, { roughness: 0.9 }));
    tire.rotation.z = Math.PI / 2; spin.add(tire);
    for (var i = 0; i < 14; i++) {
      var a = (i / 14) * 6.2832;
      var m = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, r * 0.07, r * 0.2), std(0x2e3855));
      m.position.set(0, Math.cos(a) * r, Math.sin(a) * r); m.rotation.x = a; spin.add(m);
    }
    var rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.62, r * 0.62, w * 1.04, 24), std(0xc9cfdd, { metalness: 0.6, roughness: 0.35 }));
    rim.rotation.z = Math.PI / 2; spin.add(rim);
    for (var k = 0; k < 3; k++) {
      var sp = new THREE.Mesh(new THREE.BoxGeometry(w * 1.1, r * 1.2, r * 0.13), std(0x6b7490, { metalness: 0.6, roughness: 0.4 }));
      sp.rotation.x = (k / 3) * Math.PI; spin.add(sp);
    }
    var mark = new THREE.Mesh(new THREE.BoxGeometry(w * 1.12, r * 0.16, r * 0.16), std(0xff8a2a, { emissive: 0xff5a00, emissiveIntensity: 0.6 }));
    mark.position.set(0, r * 0.5, 0); spin.add(mark);
    return { group: g, spin: spin };
  };
  HF.makeCar = function (color) {
    var g = new THREE.Group();
    var bodyMat = std(color, { metalness: 0.4, roughness: 0.4 });
    var body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.34, 2.5), bodyMat); body.position.y = 0.45; g.add(body);
    var cab = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 1.2), std(0x9fb4d8, { metalness: 0.3, roughness: 0.2 })); cab.position.set(0, 0.78, -0.15); g.add(cab);
    var tail = std(0x501010, { emissive: 0xff1a1a, emissiveIntensity: 0.2 });
    [-0.38, 0.38].forEach(function (x) {
      var l = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.05), tail); l.position.set(x, 0.5, -1.27); g.add(l);
      var h = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.05), std(0xfff3c0, { emissive: 0xfff3c0, emissiveIntensity: 0.8 })); h.position.set(x, 0.5, 1.27); g.add(h);
    });
    var wheels = [];
    [[-0.62, 0.8], [0.62, 0.8], [-0.62, -0.8], [0.62, -0.8]].forEach(function (p, i) {
      var w = HF.makeWheel(0.26, 0.2);
      var pivot = new THREE.Group(); pivot.position.set(p[0], 0.26, p[1]); pivot.add(w.group); g.add(pivot);
      wheels.push({ pivot: pivot, spin: w.spin });
    });
    return { group: g, wheels: wheels, tail: tail, bodyMat: bodyMat };
  };
  HF.makeRoad = function (len, wid) {
    var g = new THREE.Group();
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(wid, len), std(0x0f1628, { roughness: 0.22, metalness: 0.65 }));
    plane.rotation.x = -Math.PI / 2; g.add(plane);
    var lm = std(0xdfe6ff, { emissive: 0x6677aa, emissiveIntensity: 0.4 });
    [-wid / 2 + 0.2, wid / 2 - 0.2].forEach(function (x) {
      var e = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, len), lm); e.position.set(x, 0.006, 0); g.add(e);
    });
    var dashes = [], sp = 3.2, n = Math.floor(len / sp);
    for (var i = 0; i < n; i++) {
      var d = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 1.4), lm); d.position.set(0, 0.006, 0); g.add(d); dashes.push(d);
    }
    return { group: g, dashes: dashes, sp: sp, len: n * sp };
  };
  HF.setRoad = function (road, dist) {
    road.dashes.forEach(function (d, i) {
      var z = (((i * road.sp - dist) % road.len) + road.len) % road.len - road.len / 2;
      d.position.z = z;
    });
  };
  HF.makeRain = function (n, w, h, d, seed) {
    var rnd = HF.mulberry32(seed), data = [];
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    for (var i = 0; i < n; i++) data.push([(rnd() - 0.5) * w, rnd(), (rnd() - 0.5) * d, 0.6 + rnd() * 0.6]);
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x9fc4ff, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
    pts.frustumCulled = false; pts.userData = { data: data, n: n, h: h };
    return pts;
  };
  HF.setRain = function (pts, t) {
    var a = pts.geometry.attributes.position.array, d = pts.userData.data;
    for (var i = 0; i < pts.userData.n; i++) {
      var u = 1 - ((t * d[i][3] + d[i][1]) % 1);
      a[i * 3] = d[i][0]; a[i * 3 + 1] = u * pts.userData.h; a[i * 3 + 2] = d[i][2];
    }
    pts.geometry.attributes.position.needsUpdate = true;
  };
  /* brake disc (axis X) with caliper; setDisc updates spin and caliper glow */
  HF.makeDisc = function () {
    var g = new THREE.Group(), spin = new THREE.Group(); g.add(spin);
    var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.07, 36), std(0x9aa3b8, { metalness: 0.8, roughness: 0.35 }));
    disc.rotation.z = Math.PI / 2; spin.add(disc);
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 20), std(0x5b6379, { metalness: 0.7 })); hub.rotation.z = Math.PI / 2; spin.add(hub);
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * 6.2832;
      var h = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.09, 10), std(0x070b16)); h.rotation.z = Math.PI / 2;
      h.position.set(0, Math.cos(a) * 0.42, Math.sin(a) * 0.42); spin.add(h);
    }
    var calMat = std(0xe0443a, { roughness: 0.4, metalness: 0.3, emissive: 0xff2a1a, emissiveIntensity: 0 });
    var cal = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.4), calMat); cal.position.set(0, 0.5, 0); g.add(cal);
    return { group: g, spin: spin, calMat: calMat };
  };
  /* tone ring with teeth (axis X) and a sensor with a glow sprite */
  HF.makeToothRing = function (r) {
    var g = new THREE.Group(), spin = new THREE.Group(); g.add(spin);
    var ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.08, 28), std(0x7c86a3, { metalness: 0.7, roughness: 0.4 }));
    ring.rotation.z = Math.PI / 2; spin.add(ring);
    for (var i = 0; i < 18; i++) {
      var a = (i / 18) * 6.2832;
      var t = new THREE.Mesh(new THREE.BoxGeometry(0.08, r * 0.28, r * 0.2), std(0xb8c2de, { metalness: 0.7, roughness: 0.3 }));
      t.position.set(0, Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08); t.rotation.x = a; spin.add(t);
    }
    var sMat = std(0x1b6b3c, { emissive: 0x38d27a, emissiveIntensity: 0.6 });
    var sensor = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.16), sMat); sensor.position.set(0, r * 1.42, 0); g.add(sensor);
    var glow = HF.makeGlow(0x38d27a, 0.5); glow.position.copy(sensor.position); g.add(glow);
    return { group: g, spin: spin, sensorMat: sMat, glow: glow };
  };
  HF.makeEcu = function () {
    var g = new THREE.Group();
    var mat = std(0x14303a, { metalness: 0.5, roughness: 0.4, emissive: 0x1a8cff, emissiveIntensity: 0.1 });
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.42), mat));
    for (var i = 0; i < 6; i++) {
      var c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.06), std(0xc9cfdd, { metalness: 0.6 })); c.position.set(-0.2 + (i % 3) * 0.2, 0.09, i < 3 ? -0.08 : 0.08); g.add(c);
    }
    var glow = HF.makeGlow(0x4aa8ff, 0.9); glow.position.y = 0.2; g.add(glow);
    return { group: g, mat: mat, glow: glow };
  };
  HF.makeValveBlock = function () {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.6), std(0x8a93a8, { metalness: 0.7, roughness: 0.4 })));
    var sols = [];
    [-0.28, 0.28].forEach(function (x) {
      var m = std(0x2b3350, { metalness: 0.5, emissive: 0xb26bff, emissiveIntensity: 0 });
      var s = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.36, 20), m); s.position.set(x, 0.45, 0); g.add(s);
      var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), std(0xe0e4f0, { metalness: 0.7 })); cap.position.set(x, 0.7, 0); g.add(cap);
      sols.push({ mat: m, cap: cap });
    });
    return { group: g, sols: sols };
  };
  HF.pipe = function (a, b, r, mat) {
    var d = b.clone().sub(a), len = d.length();
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    return m;
  };
  /* camera that holds each key, then glides to the next one during the 0.9 s before its time */
  HF.camKeys = function (camera, keys, t, drift) {
    var i = 0;
    while (i < keys.length - 1 && t >= keys[i + 1].t) i++;
    var a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
    var k = i === keys.length - 1 ? 0 : HF.ease(HF.seg(t, b.t - 0.9 - 0.9, b.t - 0.0));
    var p = new THREE.Vector3(HF.lerp(a.p[0], b.p[0], k), HF.lerp(a.p[1], b.p[1], k), HF.lerp(a.p[2], b.p[2], k));
    var l = new THREE.Vector3(HF.lerp(a.l[0], b.l[0], k), HF.lerp(a.l[1], b.l[1], k), HF.lerp(a.l[2], b.l[2], k));
    var dr = drift == null ? 0.06 : drift;
    p.x += dr * Math.sin(t * 0.6); p.y += dr * 0.6 * Math.cos(t * 0.5);
    camera.position.copy(p); camera.lookAt(l); camera.updateMatrixWorld();
  };
})();
/* boot on a pedal, for the pedal chapter */
HF.makePedal = function () {
  var g = new THREE.Group();
  var pivot = new THREE.Group(); pivot.position.set(0, 1.3, 0); g.add(pivot);
  var arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), HF.std(0x9aa3b8, { metalness: 0.7, roughness: 0.4 })); arm.position.set(0, -0.45, 0); pivot.add(arm);
  var pad = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.95, 0.14), HF.std(0x2a3350, { metalness: 0.3, roughness: 0.6 })); pad.position.set(0, -1.05, 0); pivot.add(pad);
  for (var i = 0; i < 5; i++) { var rib = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.05), HF.std(0x70789a)); rib.position.set(0, -1.35 + i * 0.16, 0.09); pivot.add(rib); }
  var boot = new THREE.Group(); boot.position.set(0, -1.0, 0.1); pivot.add(boot);
  var leather = HF.std(0xe9ecf4, { roughness: 0.55 });
  var sole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.1), HF.std(0x151a26)); sole.position.set(0, -0.05, 0.05); boot.add(sole);
  var toe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.3), leather); toe.position.set(0, 0.1, 0.25); boot.add(toe);
  var heel = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.3), leather); heel.position.set(0, 0.42, 0.28); boot.add(heel);
  var leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 1.5), HF.std(0x3a7bff, { roughness: 0.6 })); leg.position.set(0, 0.85, 0.7); leg.rotation.x = -0.6; boot.add(leg);
  return { group: g, pivot: pivot };
};
