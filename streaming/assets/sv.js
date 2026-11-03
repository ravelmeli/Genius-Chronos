/* Phone with an animated video screen (quality, buffering, progress), servers and file blocks. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.makeVideoPhone = function () {
    var c = document.createElement("canvas"); c.width = 360; c.height = 640;
    var ctx = c.getContext("2d"), small = document.createElement("canvas"), sctx = small.getContext("2d");
    var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    var g = new THREE.Group();
    g.add(new THREE.Mesh(HF.roundedBox(1.0, 1.9, 0.08, 0.14, 0.02), std(0x1d2230, { metalness: 0.6, roughness: 0.4 })));
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); scr.position.z = 0.07; g.add(scr);
    function art(x, w, h, t, hue) {
      var gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "hsl(" + hue + ",70%,28%)"); gr.addColorStop(1, "hsl(" + (hue + 40) + ",75%,55%)");
      x.fillStyle = gr; x.fillRect(0, 0, w, h);
      var sx = w * (0.15 + 0.7 * ((t * 0.07) % 1)); x.fillStyle = "#ffe08a"; x.beginPath(); x.arc(sx, h * 0.3, w * 0.1, 0, 6.2832); x.fill();
      x.fillStyle = "#14331f"; x.beginPath(); x.moveTo(0, h); for (var i = 0; i <= 10; i++) x.lineTo(w * i / 10, h * (0.68 + 0.08 * Math.sin(i * 1.7 + t * 0.6))); x.lineTo(w, h); x.fill();
      x.fillStyle = "#0c2214"; x.beginPath(); x.moveTo(0, h); for (var j = 0; j <= 10; j++) x.lineTo(w * j / 10, h * (0.8 + 0.06 * Math.sin(j * 2.3 + 1 + t))); x.lineTo(w, h); x.fill();
    }
    /* s: playing, quality 0..1, buffering, play, buf (0..1), bar */
    g.userData.draw = function (t, s) {
      var q = Math.max(0.04, Math.min(1, s.quality == null ? 1 : s.quality)), pw = Math.max(8, Math.round(8 + 352 * q * q));
      small.width = pw; small.height = Math.round(pw * 640 / 360);
      art(sctx, small.width, small.height, t, 200 + 30 * Math.sin(t * 0.1));
      ctx.imageSmoothingEnabled = q > 0.9; ctx.drawImage(small, 0, 0, 360, 640);
      if (!s.playing) {
        ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(0, 0, 360, 640);
        var k = 1 + 0.12 * (s.press || 0);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(150, 260 - 0); ctx.lineTo(150 + 70 * k, 320); ctx.lineTo(150, 380); ctx.closePath(); ctx.fill();
      }
      if (s.buffering) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, 360, 640);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(180, 320, 36, t * 6, t * 6 + 4.2); ctx.stroke();
      }
      if (s.bar !== false) {
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(20, 590, 320, 8);
        ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(20, 590, 320 * (s.buf || 0), 8);
        ctx.fillStyle = "#ff3b3b"; ctx.fillRect(20, 590, 320 * (s.play || 0), 8);
      }
      tex.needsUpdate = true;
    };
    return g;
  };
  HF.makeServer = function (color) {
    var g = new THREE.Group(), body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.5), std(0x2f3a58, { metalness: 0.6, roughness: 0.45 })); body.position.y = 0.5; g.add(body);
    var leds = [];
    for (var i = 0; i < 4; i++) { var m = new THREE.MeshBasicMaterial({ color: color || 0x38d27a }); var l = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.02), m); l.position.set(0, 0.2 + i * 0.22, 0.26); g.add(l); leds.push(m); }
    return { group: g, leds: leds };
  };
})();
