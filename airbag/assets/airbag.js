/* Low-poly cabin, crash-test dummy, steering wheel, airbag and car, shared by the airbag chapters. */
(function () {
  var HF = window.HF;
  function std(color, o) { o = o || {}; return new THREE.MeshStandardMaterial({ color: color, roughness: o.r == null ? 0.7 : o.r, metalness: o.m || 0, flatShading: !!o.flat, transparent: !!o.tr, opacity: o.op == null ? 1 : o.op, emissive: o.em || 0x000000, emissiveIntensity: o.ei || 0 }); }
  function box(w, h, d, mat, x, y, z) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x || 0, y || 0, z || 0); return m; }
  HF.makeDummy = function () {
    var g = new THREE.Group();
    var yel = std(0xe8b024, { r: 0.6 });
    var torso = new THREE.Mesh(HF.roundedBox(0.42, 0.78, 0.4, 0.06, 0.02), yel);
    torso.rotation.y = Math.PI / 2;
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 18), yel);
    head.position.set(0.02, 0.6, 0);
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.14, 12), std(0x222733));
    neck.position.set(0.0, 0.42, 0);
    var mark = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), std(0x151822));
    mark.position.set(0.0, 0.63, 0.221);
    var marky = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), new THREE.MeshBasicMaterial({ color: 0x151822 }));
    var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.5, 10), yel);
    arm.position.set(0.1, -0.02, 0.28); arm.rotation.z = -1.1;
    var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.62, 10), yel);
    leg.position.set(0.28, -0.48, 0.12); leg.rotation.z = 1.2;
    g.add(torso, head, neck, mark, arm, leg);
    var dummy = { group: g, head: head, torso: torso };
    return dummy;
  };
  HF.makeWheel = function () {
    var g = new THREE.Group();
    var dark = std(0x1a1d28, { r: 0.5 });
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.032, 10, 36), dark);
    rim.rotation.y = Math.PI / 2;
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.08, 20), std(0x2a2f42));
    hub.rotation.z = Math.PI / 2; hub.position.x = 0.0;
    [0, 2.1, 4.2].forEach(function (a) {
      var sp = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.03), dark);
      sp.position.set(0, Math.cos(a) * 0.12, Math.sin(a) * 0.12); sp.rotation.x = -a;
      g.add(sp);
    });
    var col = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.7, 10), dark);
    col.rotation.z = Math.PI / 2 - 0.6; col.position.set(0.3, -0.12, 0);
    g.add(rim, hub, col);
    return g;
  };
  HF.makeCabin = function () {
    var g = new THREE.Group();
    g.add(box(4.2, 0.1, 2.2, std(0x1a2236), 0, -0.78, 0));
    g.add(box(0.7, 0.12, 0.66, std(0x2b3350), -1.25, -0.5, 0));
    var back = box(0.14, 1.05, 0.66, std(0x2b3350), -1.68, -0.0, 0); back.rotation.z = -0.1; g.add(back);
    var head = box(0.12, 0.3, 0.4, std(0x2b3350), -1.74, 0.62, 0); head.rotation.z = -0.1; g.add(head);
    g.add(box(1.3, 0.5, 1.7, std(0x151b2c), 0.35, -0.5, 0));
    var ws = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshStandardMaterial({ color: 0x5aa0ff, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
    ws.position.set(0.95, 0.35, 0); ws.rotation.y = Math.PI / 2; ws.rotation.z = 0.0; ws.rotation.x = 0; ws.rotation.set(0, Math.PI / 2, 0.45);
    g.add(ws);
    return g;
  };
  HF.makeBag = function () {
    var geo = new THREE.SphereGeometry(1, 36, 26);
    var mat = new THREE.MeshStandardMaterial({ color: 0xf1f3fa, roughness: 0.85, transparent: true, opacity: 0.97 });
    var m = new THREE.Mesh(geo, mat);
    m.visible = false;
    return m;
  };
  HF.makeCar = function () {
    var g = new THREE.Group();
    var body = box(3.1, 0.55, 1.35, std(0xcfd3dc, { flat: true, r: 0.5 }), 0, 0.5, 0);
    var cab = box(1.55, 0.5, 1.22, std(0xb9bfce, { flat: true, r: 0.5 }), -0.25, 1.0, 0);
    var win = box(1.4, 0.34, 1.26, std(0x1b2a44, { flat: true, r: 0.2, m: 0.3 }), -0.25, 1.02, 0);
    var nose = box(0.2, 0.2, 1.1, std(0x2b3350, { flat: true }), 1.5, 0.45, 0);
    var l1 = box(0.06, 0.12, 0.28, new THREE.MeshBasicMaterial({ color: 0xfff1b8, toneMapped: false }), 1.57, 0.62, 0.45);
    var l2 = box(0.06, 0.12, 0.28, new THREE.MeshBasicMaterial({ color: 0xfff1b8, toneMapped: false }), 1.57, 0.62, -0.45);
    g.add(body, cab, win, nose, l1, l2);
    [[-1.0, 0.7], [1.0, 0.7], [-1.0, -0.7], [1.0, -0.7]].forEach(function (p) {
      var w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 16), std(0x111319, { flat: true }));
      w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.28, p[1]); g.add(w);
    });
    g.userData.body = body; g.userData.nose = nose;
    return g;
  };
  /* places the bag at the wheel hub; p = inflation 0..1 (1 = full) */
  HF.setBag = function (bag, p, hub) {
    var e = HF.ease(HF.clamp(p, 0, 1));
    bag.visible = p > 0.01;
    bag.scale.set(0.02 + 0.3 * e, 0.02 + 0.34 * e, 0.02 + 0.34 * e);
    bag.position.set(hub.x - 0.28 * e, hub.y + 0.02, hub.z);
  };
})();
