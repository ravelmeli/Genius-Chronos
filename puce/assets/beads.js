/* Oven, bowl, water molecule, fork and wave beads for the microwave chapters. */
(function () {
  var HF = window.HF;
  function std(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0.1 }, o || {})); }
  HF.makeWater = function (s) {
    s = s || 1;
    var g = new THREE.Group();
    var O = new THREE.Mesh(new THREE.SphereGeometry(0.42 * s, 28, 20), std(0xff4a4a, { roughness: 0.35 })); g.add(O);
    var H1 = new THREE.Mesh(new THREE.SphereGeometry(0.26 * s, 24, 16), std(0xf2f4fa, { roughness: 0.35 })); H1.position.set(0.47 * s, -0.36 * s, 0); g.add(H1);
    var H2 = new THREE.Mesh(new THREE.SphereGeometry(0.26 * s, 24, 16), std(0xf2f4fa, { roughness: 0.35 })); H2.position.set(-0.47 * s, -0.36 * s, 0); g.add(H2);
    return { group: g, O: O, H1: H1, H2: H2 };
  };
  HF.makeBeads = function (n, color, size) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    var mat = new THREE.PointsMaterial({ color: color, map: HF.spriteTex, size: size || 0.09, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    var pts = new THREE.Points(geo, mat); pts.frustumCulled = false;
    pts.userData.n = n;
    return pts;
  };
  /* beads along A->B, displaced by a travelling sine; perp is a unit vector */
  HF.setBeads = function (pts, A, B, perp, amp, waves, speed, t, until) {
    var n = pts.userData.n, a = pts.geometry.attributes.position.array;
    for (var i = 0; i < n; i++) {
      var s = i / (n - 1);
      var u = until == null ? 1 : until;
      var ss = s * u;
      var d = amp * Math.sin(ss * waves * 6.2832 - speed * t);
      a[i * 3] = A.x + (B.x - A.x) * ss + perp.x * d;
      a[i * 3 + 1] = A.y + (B.y - A.y) * ss + perp.y * d;
      a[i * 3 + 2] = A.z + (B.z - A.z) * ss + perp.z * d;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  };
  HF.makeFork = function () {
    var g = new THREE.Group();
    var m = std(0xc5cad8, { metalness: 0.35, roughness: 0.4, emissive: 0x2a3042, emissiveIntensity: 0.6 });
    var h = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 0.05), m); h.position.y = -0.55; g.add(h);
    var nk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.05), m); nk.position.y = 0.02; g.add(nk);
    var tips = [];
    [-0.115, -0.038, 0.038, 0.115].forEach(function (x) { var tn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.05), m); tn.position.set(x, 0.38, 0); g.add(tn); tips.push(new THREE.Vector3(x, 0.69, 0)); });
    return { group: g, tips: tips, mat: m };
  };
  HF.spark = function (a, b, seed, nseg) {
    var rnd = HF.mulberry32(seed), pts = [];
    nseg = nseg || 8;
    for (var i = 0; i <= nseg; i++) {
      var s = i / nseg;
      var j = (i === 0 || i === nseg) ? 0 : 1;
      pts.push(new THREE.Vector3(a.x + (b.x - a.x) * s + (rnd() - 0.5) * 0.08 * j, a.y + (b.y - a.y) * s + (rnd() - 0.5) * 0.12 * j, a.z + (b.z - a.z) * s + (rnd() - 0.5) * 0.05 * j));
    }
    return pts;
  };
})();
