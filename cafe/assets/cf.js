/* Neuron membrane, receptors, adenosine and caffeine molecules, coffee cup. */
(function () {
  var HF = window.HF, std = HF.std;
  HF.makeReceptor = function () {
    var g = new THREE.Group();
    var prof = [new THREE.Vector2(0.1, 0.0), new THREE.Vector2(0.34, 0.04), new THREE.Vector2(0.38, 0.34), new THREE.Vector2(0.3, 0.46)];
    var mat = std(0x8a93a8, { metalness: 0.4, roughness: 0.5, side: THREE.DoubleSide, emissive: 0xff2a1a, emissiveIntensity: 0 });
    var cup = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), mat); g.add(cup);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.46; g.add(ring);
    return { group: g, mat: mat, ring: ring };
  };
  HF.makeMolecule = function (color, variant) {
    var g = new THREE.Group(), m = std(color, { roughness: 0.35, metalness: 0.2, emissive: color, emissiveIntensity: 0.35 });
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), m));
    var offs = variant ? [[0.22, 0.05, 0], [-0.16, -0.12, 0.1], [0.0, 0.2, -0.12], [-0.08, 0.1, 0.2]] : [[0.22, -0.02, 0], [-0.18, -0.1, 0.1], [0.02, 0.2, -0.1]];
    offs.forEach(function (o) { var b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), m); b.position.set(o[0], o[1], o[2]); g.add(b); });
    return { group: g, mat: m };
  };
  HF.makeNeuron = function () {
    var g = new THREE.Group();
    var mem = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.35, 1.6), std(0xb8587a, { roughness: 0.7, emissive: 0x6a2a4a, emissiveIntensity: 0.3 })); mem.position.y = -1.2; g.add(mem);
    var axon = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.05, 0.12), std(0x4a5a8a, { emissive: 0x2a3a6a, emissiveIntensity: 0.4 })); axon.position.y = -1.75; g.add(axon);
    var xs = [-1.8, -0.6, 0.6, 1.8], rec = xs.map(function (x) { var r = HF.makeReceptor(); r.group.position.set(x, -1.025, 0); g.add(r.group); return r; });
    var sig = HF.makeBeads(36, 0xffffff, 0.14); sig.position.y = -1.75; g.add(sig);
    return { group: g, rec: rec, xs: xs, sig: sig, axon: axon };
  };
  HF.makeCup = function () {
    var g = new THREE.Group();
    var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.65, 1.0, 28, 1, true), std(0xeef1f8, { roughness: 0.4, side: THREE.DoubleSide })); cup.position.y = 0.5; g.add(cup);
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.06, 28), std(0xeef1f8)); base.position.y = 0.03; g.add(base);
    var coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.04, 28), std(0x4a2a14, { roughness: 0.3, emissive: 0x2a1408, emissiveIntensity: 0.4 })); coffee.position.y = 0.88; g.add(coffee);
    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 10, 20, Math.PI), std(0xeef1f8)); handle.rotation.z = -Math.PI / 2; handle.position.set(0.95, 0.5, 0); g.add(handle);
    var saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.1, 0.07, 32), std(0xdfe4f0)); saucer.position.y = -0.02; g.add(saucer);
    var steam = HF.makeParticles(60, 3, 0.35, 0xffffff); steam.position.set(0, 0.95, 0); g.add(steam);
    return { group: g, steam: steam };
  };
})();
