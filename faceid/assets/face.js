/* A stylised relief face, built from a height field, plus helpers for dots, depth map and accessories. */
(function () {
  var HF = window.HF;
  var FW = 0.8, FH = 1.05;
  function g(x, y, cx, cy, sx, sy) {
    var dx = (x - cx) / sx, dy = (y - cy) / sy;
    return Math.exp(-(dx * dx + dy * dy));
  }
  HF.fz = function (x, y) {
    var r2 = (x / FW) * (x / FW) + (y / FH) * (y / FH);
    if (r2 >= 1) return 0;
    var z = Math.sqrt(1 - r2) * 0.5;
    z += 0.3 * g(x, y, 0, -0.12, 0.1, 0.32);
    z += 0.14 * g(x, y, 0, -0.28, 0.16, 0.1);
    z += 0.06 * (g(x, y, -0.28, 0.28, 0.2, 0.06) + g(x, y, 0.28, 0.28, 0.2, 0.06));
    z -= 0.09 * (g(x, y, -0.28, 0.2, 0.12, 0.08) + g(x, y, 0.28, 0.2, 0.12, 0.08));
    z += 0.08 * (g(x, y, -0.45, -0.22, 0.2, 0.2) + g(x, y, 0.45, -0.22, 0.2, 0.2));
    z -= 0.03 * g(x, y, 0, -0.52, 0.2, 0.05);
    z += 0.1 * g(x, y, 0, -0.82, 0.2, 0.12);
    return z * (1 - Math.pow(Math.sqrt(r2), 6) * 0.3);
  };
  function buildGeo(rings, segs) {
    var pos = [], idx = [];
    pos.push(0, 0, HF.fz(0, 0));
    for (var r = 1; r <= rings; r++) {
      var rr = r / rings;
      for (var s = 0; s < segs; s++) {
        var a = (s / segs) * Math.PI * 2;
        var x = Math.cos(a) * rr * FW * 0.995, y = Math.sin(a) * rr * FH * 0.995;
        pos.push(x, y, HF.fz(x, y));
      }
    }
    for (var s2 = 0; s2 < segs; s2++) idx.push(0, 1 + s2, 1 + ((s2 + 1) % segs));
    for (var r2 = 1; r2 < rings; r2++) {
      for (var s3 = 0; s3 < segs; s3++) {
        var a0 = 1 + (r2 - 1) * segs + s3, a1 = 1 + (r2 - 1) * segs + ((s3 + 1) % segs);
        var b0 = 1 + r2 * segs + s3, b1 = 1 + r2 * segs + ((s3 + 1) % segs);
        idx.push(a0, b0, a1, a1, b0, b1);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  function buildGridGeo(step) {
    var pos = [], idx = [], map = {};
    var nx = Math.round((2 * FW) / step), ny = Math.round((2 * FH) / step);
    function inside(x, y) { return (x / FW) * (x / FW) + (y / FH) * (y / FH) <= 0.985; }
    function key(i, j) { return i + "_" + j; }
    for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) {
      var x = -FW + i * step, y = -FH + j * step;
      if (!inside(x, y)) continue;
      map[key(i, j)] = pos.length / 3;
      pos.push(x, y, HF.fz(x, y));
    }
    for (var j2 = 0; j2 < ny; j2++) for (var i2 = 0; i2 < nx; i2++) {
      var a = map[key(i2, j2)], b = map[key(i2 + 1, j2)], c = map[key(i2, j2 + 1)], d = map[key(i2 + 1, j2 + 1)];
      if (a !== undefined && b !== undefined && c !== undefined) idx.push(a, b, c);
      if (b !== undefined && d !== undefined && c !== undefined) idx.push(b, d, c);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    return geo;
  }
  HF.makeFace = function () {
    var group = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({ color: 0xc9ccd8, roughness: 0.6, metalness: 0.05, emissive: 0x000000, transparent: true });
    var mesh = new THREE.Mesh(buildGeo(44, 96), mat);
    group.add(mesh);
    // wireframe (depth map)
    var wmat = new THREE.MeshBasicMaterial({ color: 0x4de1ff, wireframe: true, transparent: true, opacity: 0, toneMapped: false });
    var wire = new THREE.Mesh(buildGridGeo(0.07), wmat);
    wire.position.z = 0.006;
    group.add(wire);
    // dots
    var rnd = HF.mulberry32(5);
    var tx = [], ty = [], tz = [], hs = [];
    for (var y = -1.02; y <= 1.02; y += 0.05) for (var x = -0.78; x <= 0.78; x += 0.05) {
      var r2 = (x / FW) * (x / FW) + (y / FH) * (y / FH);
      if (r2 > 0.97) continue;
      tx.push(x); ty.push(y); tz.push(HF.fz(x, y) + 0.012); hs.push(rnd());
    }
    var n = tx.length;
    var dgeo = new THREE.BufferGeometry();
    dgeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    dgeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    var dmat = new THREE.PointsMaterial({ size: 0.055, map: HF.spriteTex, vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    var dots = new THREE.Points(dgeo, dmat);
    dots.frustumCulled = false;
    group.add(dots);
    // eyes
    var eyeMat = new THREE.MeshStandardMaterial({ color: 0x1b1f2e, roughness: 0.4 });
    var eyes = [];
    [-1, 1].forEach(function (sx) {
      var e = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), eyeMat);
      e.position.set(sx * 0.28, 0.2, HF.fz(sx * 0.28, 0.2) + 0.03);
      e.scale.set(1.3, 0.8, 0.5);
      group.add(e);
      eyes.push(e);
    });
    // accessories
    var gl = new THREE.Group();
    var gm = new THREE.MeshStandardMaterial({ color: 0x20232f, metalness: 0.5, roughness: 0.3 });
    [-1, 1].forEach(function (sx) {
      var rim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.014, 8, 28), gm);
      rim.position.set(sx * 0.28, 0.2, 0.34);
      gl.add(rim);
    });
    var br = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), gm);
    br.rotation.z = Math.PI / 2; br.position.set(0, 0.22, 0.34);
    gl.add(br);
    gl.visible = false;
    group.add(gl);
    var hat = new THREE.Group();
    var hm = new THREE.MeshStandardMaterial({ color: 0x2c3a66, roughness: 0.7 });
    var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.4, 28), hm);
    crown.position.set(0, 1.0, 0.1);
    var brim = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.04, 36), hm);
    brim.position.set(0, 0.84, 0.28);
    brim.scale.set(1, 1, 0.7);
    hat.add(crown); hat.add(brim);
    hat.visible = false;
    group.add(hat);
    // beard : the lower triangles of the mesh, slightly pushed out
    var pos = mesh.geometry.attributes.position, nor = mesh.geometry.attributes.normal, ix = mesh.geometry.index;
    var bp = [], bi = [], map = {};
    for (var t = 0; t < ix.count; t += 3) {
      var a = ix.getX(t), b = ix.getX(t + 1), c = ix.getX(t + 2);
      var ok = [a, b, c].every(function (v) { return pos.getY(v) < -0.42 && Math.abs(pos.getX(v)) < 0.6; });
      if (!ok) continue;
      [a, b, c].forEach(function (v) {
        if (map[v] === undefined) { map[v] = bp.length / 3; bp.push(pos.getX(v) + nor.getX(v) * 0.014, pos.getY(v) + nor.getY(v) * 0.014, pos.getZ(v) + nor.getZ(v) * 0.014); }
        bi.push(map[v]);
      });
    }
    var bgeo = new THREE.BufferGeometry();
    bgeo.setAttribute("position", new THREE.Float32BufferAttribute(bp, 3));
    bgeo.setIndex(bi);
    bgeo.computeVertexNormals();
    var beard = new THREE.Mesh(bgeo, new THREE.MeshStandardMaterial({ color: 0x2b2420, roughness: 0.95 }));
    beard.visible = false;
    group.add(beard);

    var face = { group: group, mesh: mesh, mat: mat, wire: wire, wmat: wmat, dots: dots, dmat: dmat, n: n, tx: tx, ty: ty, tz: tz, hs: hs, eyes: eyes, glasses: gl, hat: hat, beard: beard };
    face.setEyes = function (open) { for (var i = 0; i < 2; i++) eyes[i].scale.y = 0.8 * Math.max(0.1, open) ; };
    // positions of every dot: lerp from `from(i)` to the target by e(i); colour set by caller
    face.setDots = function (fn) {
      var pa = dgeo.attributes.position.array, ca = dgeo.attributes.color.array;
      var o = { x: 0, y: 0, z: 0, r: 0.7, g: 0.42, b: 1, v: 1 };
      for (var i = 0; i < n; i++) {
        o.r = 0.7; o.g = 0.42; o.b = 1; o.v = 1;
        fn(i, o);
        pa[i * 3] = o.x; pa[i * 3 + 1] = o.y; pa[i * 3 + 2] = o.z;
        ca[i * 3] = o.r * o.v; ca[i * 3 + 1] = o.g * o.v; ca[i * 3 + 2] = o.b * o.v;
      }
      dgeo.attributes.position.needsUpdate = true;
      dgeo.attributes.color.needsUpdate = true;
    };
    return face;
  };
})();
