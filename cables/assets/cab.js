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
