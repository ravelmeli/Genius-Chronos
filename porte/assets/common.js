/* Shared helpers for the three.js chapters. Everything is a pure function of time. */
(function () {
  var H = (window.HF = {});
  H.W = 1080;
  H.H = 1920;
  H.clamp = function (x, a, b) {
    return Math.max(a, Math.min(b, x));
  };
  H.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };
  H.ease = function (t) {
    t = H.clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  };
  H.easeOut = function (t) {
    t = H.clamp(t, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  };
  H.seg = function (t, a, b) {
    return H.clamp((t - a) / (b - a), 0, 1);
  };
  H.mulberry32 = function (a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  H.el = function (id) {
    return document.getElementById(id);
  };

  H.makeRenderer = function (canvas) {
    var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1);
    r.setSize(H.W, H.H, false);
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.9;
    return r;
  };

  H.makeScene = function (bg) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(bg, 8, 20);
    var camera = new THREE.PerspectiveCamera(38, H.W / H.H, 0.1, 50);
    scene.add(new THREE.HemisphereLight(0x6f8cff, 0x120c08, 0.3));
    var key = new THREE.DirectionalLight(0xffd9b0, 1.0);
    key.position.set(2.5, 4, 3);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0x5aa0ff, 1.2);
    rim.position.set(-3, 2.5, -3);
    scene.add(rim);
    var heatLight = new THREE.PointLight(0xff7a1a, 0, 6, 1.6);
    scene.add(heatLight);
    return { scene: scene, camera: camera, heatLight: heatLight };
  };

  H.roundedShape = function (w, h, r) {
    var s = new THREE.Shape();
    var x = -w / 2,
      y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  H.roundedBox = function (w, h, d, r, bevel) {
    var g = new THREE.ExtrudeGeometry(H.roundedShape(w, h, r), {
      depth: d,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: 10,
    });
    g.translate(0, 0, -d / 2);
    return g;
  };
  H.fixUV = function (geo, w, h) {
    var pa = geo.attributes.position,
      uv = new Float32Array(pa.count * 2);
    for (var i = 0; i < pa.count; i++) {
      uv[i * 2] = pa.getX(i) / w + 0.5;
      uv[i * 2 + 1] = pa.getY(i) / h + 0.5;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  };

  H.spriteTex = (function () {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var g = c.getContext("2d");
    var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.4, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  H.makeGlow = function (color, scale) {
    var m = new THREE.SpriteMaterial({
      map: H.spriteTex,
      color: color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    var sp = new THREE.Sprite(m);
    sp.scale.set(scale, scale, 1);
    return sp;
  };

  H.makeParticles = function (n, seed, size, color) {
    var rnd = H.mulberry32(seed);
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(n * 3);
    var data = [];
    for (var i = 0; i < n; i++) {
      data.push({ ox: (rnd() - 0.5) * 0.5, oz: (rnd() - 0.5) * 0.4, ph: rnd(), sp: 0.28 + rnd() * 0.3, dr: (rnd() - 0.5) * 0.3 });
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: color || 0xff8a2a,
      map: H.spriteTex,
      size: size || 0.16,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    var pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.userData = { data: data, n: n };
    return pts;
  };
  H.updateParticles = function (pts, t, intensity, height, spread) {
    var d = pts.userData.data;
    var arr = pts.geometry.attributes.position.array;
    var sp = spread || 1;
    for (var i = 0; i < pts.userData.n; i++) {
      var p = d[i];
      var u = (t * p.sp + p.ph) % 1;
      arr[i * 3] = (p.ox + p.dr * u) * sp;
      arr[i * 3 + 1] = u * height;
      arr[i * 3 + 2] = p.oz * sp;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.material.opacity = H.clamp(intensity, 0, 1) * 0.9;
  };

  H.screenTexture = function () {
    var c = document.createElement("canvas");
    c.width = 320;
    c.height = 640;
    var g = c.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 0, 640);
    grad.addColorStop(0, "#14233f");
    grad.addColorStop(1, "#05070d");
    g.fillStyle = grad;
    g.fillRect(0, 0, 320, 640);
    g.fillStyle = "#ffffff";
    g.font = "700 96px sans-serif";
    g.textAlign = "center";
    g.fillText("23:47", 160, 230);
    g.font = "400 24px sans-serif";
    g.fillStyle = "rgba(255,255,255,0.7)";
    g.fillText("En charge", 160, 290);
    g.strokeStyle = "#7dff9a";
    g.lineWidth = 6;
    g.strokeRect(100, 540, 120, 50);
    g.fillStyle = "#7dff9a";
    g.fillRect(104, 544, 70, 42);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  };

  H.makePhone = function () {
    var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1d2230, metalness: 0.6, roughness: 0.38, emissive: 0xff5a00, emissiveIntensity: 0 });
    var screenMat = new THREE.MeshBasicMaterial({ map: H.screenTexture(), toneMapped: false });
    var tintMat = new THREE.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    var g = new THREE.Group();
    g.add(new THREE.Mesh(H.roundedBox(0.8, 1.64, 0.07, 0.12, 0.02), bodyMat));
    var scr = new THREE.Mesh(H.fixUV(new THREE.ShapeGeometry(H.roundedShape(0.74, 1.58, 0.1), 8), 0.74, 1.58), screenMat);
    scr.position.z = 0.058;
    g.add(scr);
    var tint = new THREE.Mesh(new THREE.ShapeGeometry(H.roundedShape(0.74, 1.58, 0.1), 8), tintMat);
    tint.position.z = 0.062;
    g.add(tint);
    return { group: g, bodyMat: bodyMat, screenMat: screenMat, tintMat: tintMat };
  };

  H.project = function (camera, v3) {
    var v = v3.clone().project(camera);
    return { x: (v.x * 0.5 + 0.5) * H.W, y: (-v.y * 0.5 + 0.5) * H.H };
  };
  H.place = function (node, x, y, anchorRight) {
    var w = node.offsetWidth || 220;
    var px = anchorRight ? x - w : x;
    px = H.clamp(px, 60, H.W - 60 - w);
    node.style.left = px.toFixed(1) + "px";
    node.style.top = H.clamp(y, 270, 1110).toFixed(1) + "px";
  };
  H.setLeader = function (g, x, y, cx, cy, op) {
    var line = g.firstElementChild,
      dot = g.lastElementChild;
    line.setAttribute("x1", x.toFixed(1));
    line.setAttribute("y1", y.toFixed(1));
    line.setAttribute("x2", cx.toFixed(1));
    line.setAttribute("y2", cy.toFixed(1));
    dot.setAttribute("cx", x.toFixed(1));
    dot.setAttribute("cy", y.toFixed(1));
    g.setAttribute("opacity", op.toFixed(2));
  };
  /* leader from a world anchor to the centre of a label node, fading in/out with the label window */
  H.leader = function (camera, id, node, anchor, t0, t1, t) {
    var a = H.project(camera, anchor);
    var cx = node.offsetLeft + node.offsetWidth / 2,
      cy = node.offsetTop + node.offsetHeight / 2;
    H.setLeader(H.el(id), a.x, a.y, cx, cy, H.ease(H.seg(t, t0, t0 + 0.2)) * (1 - H.seg(t, t1 - 0.12, t1)));
  };
})();
