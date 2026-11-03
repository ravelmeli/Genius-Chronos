/* Hashing demo helpers: deterministic illustrative hash, canvas rows, and 3D props. */
(function () {
  var HF = window.HF, std = HF.std;
  function cyrb(str) {
    var h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (var i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067); h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213); h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067); h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213); h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
  }
  HF.hx = function (s) { return cyrb(s).map(function (v) { var x = v.toString(16); while (x.length < 8) x = "0" + x; return x; }).join(""); };
  HF.diffRow = function (ctx, label, text, x, y, color, other, size) {
    ctx.font = "700 " + (size || 30) + "px 'Space Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(255,255,255,0.72)"; ctx.fillText(label, x, y);
    var cw = ctx.measureText("M").width, x0 = x + ctx.measureText(label + " ").width;
    for (var i = 0; i < text.length; i++) { var d = other && other[i] !== text[i]; ctx.fillStyle = d ? "#ff6a4a" : color; ctx.fillText(text[i], x0 + i * cw, y); }
  };
  HF.makeGrinder = function () {
    var g = new THREE.Group(), o = { group: g };
    var steel = std(0x3a4668, { metalness: 0.6, roughness: 0.45 });
    var body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 1.3), steel); body.position.y = 0.65; g.add(body);
    var win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.04), std(0x0a1020, { transparent: true, opacity: 0.75 })); win.position.set(0, 0.65, 0.67); g.add(win);
    o.gears = [-0.42, 0.42].map(function (x, k) {
      var gg = new THREE.Group(); gg.position.set(x, 0.65, 0.62);
      var d = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.14, 24), std(0xc9cfdd, { metalness: 0.8, roughness: 0.35, emissive: 0xffa23a, emissiveIntensity: 0 })); d.rotation.x = Math.PI / 2; gg.add(d);
      for (var i = 0; i < 10; i++) { var a = (i / 10) * 6.2832, t = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.14), std(0xdfe4f0, { metalness: 0.8 })); t.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0); t.rotation.z = a; gg.add(t); }
      g.add(gg); return gg;
    });
    var fun = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.3, 0.8, 28, 1, true), std(0x8a93a8, { metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })); fun.position.y = 1.7; g.add(fun);
    o.chute = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.7), steel); o.chute.position.set(1.45, 0.25, 0); o.chute.rotation.z = -0.25; g.add(o.chute);
    o.glow = HF.makeGlow(0xffa23a, 2.0); o.glow.position.set(1.8, 0.1, 0.4); g.add(o.glow);
    return o;
  };
  HF.makeVault = function () {
    var g = new THREE.Group(), o = { group: g };
    var body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 1.5), std(0x3a4668, { metalness: 0.7, roughness: 0.4 })); body.position.y = 1.2; g.add(body);
    var doorMat = std(0x56627f, { metalness: 0.6, roughness: 0.4, emissive: 0x38d27a, emissiveIntensity: 0 });
    var door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 0.14), doorMat); door.position.set(0, 1.2, 0.78); g.add(door); o.doorMat = doorMat;
    var dial = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.06, 10, 28), std(0xdfe4f0, { metalness: 0.8 })); dial.position.set(0, 1.05, 0.9); g.add(dial);
    var c = document.createElement("canvas"); c.width = c.height = 128; var cx = c.getContext("2d"); cx.strokeStyle = "#7dff9a"; cx.lineWidth = 5;
    for (var r = 10; r <= 56; r += 9) { cx.beginPath(); cx.arc(64, 64, r, Math.PI * 0.9, Math.PI * 2.1); cx.stroke(); }
    var fp = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.3, toneMapped: false })); fp.position.set(0, 1.05, 0.86); g.add(fp); o.fp = fp;
    o.glow = HF.makeGlow(0x38d27a, 2.6); o.glow.position.set(0, 1.2, 1.1); g.add(o.glow);
    return o;
  };
  HF.makeDb = function () {
    var g = new THREE.Group(), o = { group: g, mats: [] };
    for (var i = 0; i < 3; i++) {
      var m = std(0x3a4668, { metalness: 0.6, roughness: 0.4, emissive: 0xff2a1a, emissiveIntensity: 0 });
      var c = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.5, 32), m); c.position.y = 0.3 + i * 0.62; g.add(c); o.mats.push(m);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 8, 40), new THREE.MeshBasicMaterial({ color: 0x4aa8ff })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.55 + i * 0.62; g.add(ring);
    }
    o.glow = HF.makeGlow(0xff3a2a, 3.2); o.glow.position.set(0, 1.0, 0.4); g.add(o.glow);
    return o;
  };
  HF.makeShaker = function () {
    var g = new THREE.Group(), o = { group: g };
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9, 22), std(0xdfe4f0, { roughness: 0.2, transparent: true, opacity: 0.55 })); g.add(body);
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.22, 22), std(0x8a93a8, { metalness: 0.8 })); cap.position.y = 0.56; g.add(cap);
    o.salt = HF.makeParticles(60, 4, 0.12, 0xffffff); o.salt.position.set(0, -0.5, 0); g.add(o.salt);
    return o;
  };
  HF.makeHourglass = function () {
    var g = new THREE.Group(), o = { group: g };
    var gl = std(0xbfe0ff, { transparent: true, opacity: 0.3, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false });
    var top = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 24, 1, true), gl); top.rotation.x = Math.PI; top.position.y = 0.55; g.add(top);
    var bot = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 24, 1, true), gl); bot.position.y = -0.55; g.add(bot);
    [1.1, -1.1].forEach(function (y) { var f = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 24), std(0x8a6a3a, { roughness: 0.8 })); f.position.y = y; g.add(f); });
    o.sandT = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 20), std(0xffc41a, { emissive: 0xffa21a, emissiveIntensity: 0.4 })); o.sandT.rotation.x = Math.PI; o.sandT.position.y = 0.55; g.add(o.sandT);
    o.sandB = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 20), std(0xffc41a, { emissive: 0xffa21a, emissiveIntensity: 0.4 })); o.sandB.position.y = -0.65; g.add(o.sandB);
    return o;
  };
})();
