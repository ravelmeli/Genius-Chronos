/* Globe, sea floor, cable segments, repeaters and cross-section for the submarine cable chapters. */
(function () {
  var HF = window.HF, std = HF.std;
  var LAND = {
    na: [[-168,66],[-140,70],[-95,72],[-80,68],[-62,58],[-55,48],[-70,42],[-80,30],[-97,26],[-105,22],[-117,32],[-125,48],[-135,58]],
    sa: [[-80,10],[-60,10],[-35,-6],[-40,-22],[-55,-35],[-65,-55],[-75,-50],[-72,-20],[-80,-5]],
    eu: [[-10,36],[-9,43],[-2,48],[5,52],[10,58],[20,64],[30,70],[70,73],[110,76],[150,70],[180,66],[160,55],[142,46],[130,32],[122,24],[110,18],[106,10],[100,2],[98,16],[92,22],[80,10],[72,20],[60,25],[48,30],[35,36],[28,41],[18,40],[12,44],[0,40]],
    af: [[-17,21],[-5,36],[10,37],[32,31],[43,12],[51,12],[40,-5],[40,-17],[33,-27],[20,-35],[12,-18],[9,3],[-8,5],[-17,14]],
    au: [[113,-22],[130,-12],[145,-12],[153,-28],[145,-38],[130,-32],[115,-34]]
  };
  HF.earthTexture = function () {
    var c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    var g = c.getContext("2d");
    g.fillStyle = "#0a1a3a"; g.fillRect(0, 0, 1024, 512);
    g.strokeStyle = "rgba(120,160,255,0.14)"; g.lineWidth = 1;
    for (var lon = -180; lon <= 180; lon += 30) { var x = (lon + 180) / 360 * 1024; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
    for (var lat = -60; lat <= 60; lat += 30) { var y = (90 - lat) / 180 * 512; g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
    Object.keys(LAND).forEach(function (k) {
      g.beginPath();
      LAND[k].forEach(function (p, i) { var x = (p[0] + 180) / 360 * 1024, y = (90 - p[1]) / 180 * 512; if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); });
      g.closePath(); g.fillStyle = "#24427a"; g.fill(); g.strokeStyle = "rgba(160,200,255,0.55)"; g.lineWidth = 2; g.stroke();
    });
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
  };
  HF.llToVec = function (lat, lon, r) {
    var la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
    return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
  };
  HF.arcPts = function (a, b, r, h, n) {
    var pts = [], A = a.clone().normalize(), B = b.clone().normalize(), om = Math.acos(HF.clamp(A.dot(B), -1, 1));
    for (var i = 0; i <= n; i++) {
      var s = i / n, v = A.clone().multiplyScalar(Math.sin((1 - s) * om) / Math.sin(om)).add(B.clone().multiplyScalar(Math.sin(s * om) / Math.sin(om)));
      pts.push(v.normalize().multiplyScalar(r + h * Math.sin(Math.PI * s)));
    }
    return pts;
  };
  HF.setBeadsOn = function (beads, pts, t, speed, ph, until) {
    var n = beads.userData.n, a = beads.geometry.attributes.position.array, m = pts.length - 1;
    for (var i = 0; i < n; i++) {
      var u = ((i / n) * (until == null ? 1 : until) + t * speed + (ph || 0)) % 1; if (u < 0) u += 1;
      var f = u * m, k = Math.min(m - 1, Math.floor(f)), q = f - k, p0 = pts[k], p1 = pts[k + 1];
      a[i * 3] = p0.x + (p1.x - p0.x) * q; a[i * 3 + 1] = p0.y + (p1.y - p0.y) * q; a[i * 3 + 2] = p0.z + (p1.z - p0.z) * q;
    }
    beads.geometry.attributes.position.needsUpdate = true;
  };
  HF.makePhone2 = function (color) {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.03), std(0x1d2230, { metalness: 0.5 })));
    var s = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.24, 0.005), new THREE.MeshBasicMaterial({ color: color || 0x4aa8ff })); s.position.z = 0.02; g.add(s);
    return g;
  };
  HF.makeSatellite = function () {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.2), std(0xcfd6e6, { metalness: 0.8, roughness: 0.3 })));
    [-1, 1].forEach(function (s) { var p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.16), std(0x2a5ac8, { metalness: 0.5, emissive: 0x1a3a9a, emissiveIntensity: 0.4 })); p.position.x = s * 0.25; g.add(p); });
    return g;
  };
  HF.makeCross = function (color) {
    var g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: color || 0xff3a3a, transparent: true, opacity: 1 });
    [Math.PI / 4, -Math.PI / 4].forEach(function (a) { var b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.04), m); b.rotation.z = a; g.add(b); });
    g.userData.mat = m; return g;
  };
})();
(function () {
  var HF = window.HF, std = HF.std;
  HF.makeSeabed = function () {
    var g = new THREE.Group(), o = { group: g, cables: [] };
    var geo = new THREE.PlaneGeometry(11, 15, 22, 30); geo.rotateX(-Math.PI / 2);
    var rnd = HF.mulberry32(7), pa = geo.attributes.position;
    for (var i = 0; i < pa.count; i++) pa.setY(i, (rnd() - 0.5) * 0.14);
    geo.computeVertexNormals();
    var floor = new THREE.Mesh(geo, std(0x06232f, { flatShading: true, roughness: 0.95 })); floor.position.y = -0.05; g.add(floor);
    [6.0, -6.0].forEach(function (z) { var l = new THREE.Mesh(new THREE.BoxGeometry(11, 0.5, 3.2), std(0x1c3558, { roughness: 0.9, flatShading: true })); l.position.set(0, 0.1, z); g.add(l); });
    var cols = [0x38d6ff, 0xffc41a, 0xb26bff, 0x38d27a];
    for (var c = 0; c < 4; c++) {
      var pts = [], x0 = -2.0 + 1.35 * c;
      for (var k = 0; k <= 30; k++) { var z = -4.5 + (9.0 * k) / 30; pts.push(new THREE.Vector3(x0 + 0.3 * Math.sin(z * 0.8 + c * 1.3), 0.05, z)); }
      var curve = new THREE.CatmullRomCurve3(pts);
      var mat = new THREE.MeshStandardMaterial({ color: cols[c], emissive: cols[c], emissiveIntensity: 0.35, roughness: 0.5 });
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.055, 8), mat); g.add(tube);
      o.cables.push({ curve: curve, pts: curve.getPoints(90), tube: tube, mat: mat, color: cols[c] });
    }
    var sm = std(0xd0d6e6, { metalness: 0.5, roughness: 0.4 });
    o.stTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.6), sm); o.stTop.position.set(o.cables[1].pts[90].x, 0.5, 5.0); g.add(o.stTop);
    o.stBot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.6), sm); o.stBot.position.set(o.cables[1].pts[0].x, 0.5, -5.0); g.add(o.stBot);
    return o;
  };
  HF.makeShip = function (color) {
    var g = new THREE.Group();
    var hull = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 1.7), std(color || 0xe0443a, { roughness: 0.5 })); hull.position.y = 0.12; g.add(hull);
    var bow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.5, 4), std(color || 0xe0443a, { roughness: 0.5 })); bow.rotation.x = Math.PI / 2; bow.rotation.z = Math.PI / 4; bow.position.set(0, 0.12, 1.1); g.add(bow);
    var cab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.45), std(0xeef1f8)); cab.position.set(0, 0.4, -0.45); g.add(cab);
    var cr = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.7), std(0xffc41a)); cr.position.set(0, 0.62, 0.3); g.add(cr);
    return g;
  };
  HF.makeRepeater = function () {
    var g = new THREE.Group(), mat = std(0x9aa3b8, { metalness: 0.8, roughness: 0.35, emissive: 0x38d27a, emissiveIntensity: 0 });
    var b = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.8, 24), mat); b.rotation.z = Math.PI / 2; g.add(b);
    var r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24), std(0x5a6278, { metalness: 0.7 })); r1.rotation.z = Math.PI / 2; r1.position.x = -0.3; g.add(r1);
    var r2 = r1.clone(); r2.position.x = 0.3; g.add(r2);
    var glow = HF.makeGlow(0x38d27a, 1.8); g.add(glow);
    return { group: g, mat: mat, glow: glow };
  };
  HF.digitSprite = function (ch, color) {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var g = c.getContext("2d"); g.fillStyle = color || "#38d27a"; g.font = "700 52px 'Space Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, 32, 34);
    var t = new THREE.CanvasTexture(c);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0, depthTest: false })); s.scale.set(0.4, 0.4, 1); return s;
  };
  HF.makeRing = function (rOut, rIn, depth, color, o) {
    var sh = new THREE.Shape(); sh.absarc(0, 0, rOut, 0, 6.2832, false);
    var hole = new THREE.Path(); hole.absarc(0, 0, rIn, 0, 6.2832, true); sh.holes.push(hole);
    var m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false, curveSegments: 40 }), std(color, Object.assign({ roughness: 0.55 }, o || {})));
    m.position.z = -depth / 2; var g = new THREE.Group(); g.add(m); return g;
  };
})();
