/* Sky canvas, light beams, scattering rays and the Earth/atmosphere cross-section. */
(function () {
  var HF = window.HF, std = HF.std;
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
  HF.makeEye = function () {
    var g = new THREE.Group();
    var w = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), std(0xf2f4fa, { roughness: 0.4 })); g.add(w);
    var ir = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), std(0x3a7bff, { roughness: 0.3 })); ir.position.z = 0.22; g.add(ir);
    var pu = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), std(0x05070d)); pu.position.z = 0.32; g.add(pu);
    return g;
  };
  function mix(a, b, s) { return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s]; }
  function rgb(c) { return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")"; }
  HF.makeSky = function () {
    var c = document.createElement("canvas"); c.width = 540; c.height = 960;
    var ctx = c.getContext("2d"), tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(3.88, 6.9), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    m.userData.draw = function (s) {
      var top = mix([20, 100, 210], [30, 38, 105], s), mid = mix([95, 170, 245], [255, 120, 60], s), hor = mix([170, 220, 255], [255, 214, 130], s);
      var g = ctx.createLinearGradient(0, 0, 0, 960 * 0.72); g.addColorStop(0, rgb(top)); g.addColorStop(0.6, rgb(mid)); g.addColorStop(1, rgb(hor));
      ctx.fillStyle = g; ctx.fillRect(0, 0, 540, 960);
      var sx = 540 * (0.5 - 0.15 * s), sy = 960 * (0.28 + 0.38 * s);
      var sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 190); sg.addColorStop(0, "rgba(255," + Math.round(240 - 100 * s) + "," + Math.round(200 - 140 * s) + ",1)"); sg.addColorStop(0.15, "rgba(255," + Math.round(230 - 90 * s) + "," + Math.round(160 - 100 * s) + ",0.9)"); sg.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, 540, 960);
      ctx.fillStyle = "#07120f"; ctx.beginPath(); ctx.moveTo(0, 960);
      for (var i = 0; i <= 12; i++) ctx.lineTo(540 * i / 12, 960 * (0.72 + 0.03 * Math.sin(i * 1.9) + 0.015 * Math.sin(i * 4.1)));
      ctx.lineTo(540, 960); ctx.fill();
      tex.needsUpdate = true;
    };
    return m;
  };
})();
