/* ==========================================================================
   GiftOrbit 3D Universe Background (Three.js Engine)
   ========================================================================== */

function GiftUniverseBackground() {
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof THREE === "undefined") return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 720;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050304, 0.014);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 260);
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* Lighting */
    scene.add(new THREE.AmbientLight(0x3b0a0a, 1.3));
    const pl1 = new THREE.PointLight(0xdc2626, 3.2, 110);
    pl1.position.set(-22, 12, 12);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0xf43f5e, 2.4, 110);
    pl2.position.set(24, -10, -8);
    scene.add(pl2);

    const pl3 = new THREE.PointLight(0xf59e8b, 1.6, 100);
    pl3.position.set(0, 22, -25);
    scene.add(pl3);

    /* Soft glow bloom sprites */
    function makeGlowTexture(color) {
      const size = 128;
      const cnv = document.createElement("canvas");
      cnv.width = cnv.height = size;
      const ctx = cnv.getContext("2d");
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(cnv);
    }

    const glowRed = makeGlowTexture("rgba(220,38,38,0.85)");
    const glowRose = makeGlowTexture("rgba(245,158,139,0.75)");

    const blobGroup = new THREE.Group();
    [
      { x: -32, y: 16, z: -65, s: 65, t: glowRed },
      { x: 36, y: -12, z: -75, s: 75, t: glowRose },
      { x: 0, y: -26, z: -55, s: 55, t: glowRed },
    ].forEach((b) => {
      const mat = new THREE.SpriteMaterial({
        map: b.t,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const sp = new THREE.Sprite(mat);
      sp.position.set(b.x, b.y, b.z);
      sp.scale.set(b.s, b.s, 1);
      blobGroup.add(sp);
    });
    scene.add(blobGroup);

    const PALETTE_BOX = [0x160708, 0x3b0a0a, 0x0a0507];
    const PALETTE_RIBBON = [0xdc2626, 0xf43f5e, 0xf59e8b];
    const floaters = [];

    /* Build 3D Gift Box */
    function buildGiftBox(size, boxColor, ribbonColor) {
      const group = new THREE.Group();
      const boxMat = new THREE.MeshStandardMaterial({
        color: boxColor,
        roughness: 0.45,
        metalness: 0.25,
        emissive: new THREE.Color(boxColor).multiplyScalar(0.15)
      });
      group.add(new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.8, size), boxMat));

      const ribbonMat = new THREE.MeshStandardMaterial({
        color: ribbonColor,
        roughness: 0.3,
        metalness: 0.4,
        emissive: new THREE.Color(ribbonColor).multiplyScalar(0.3)
      });
      const rW = size * 0.16;
      group.add(new THREE.Mesh(new THREE.BoxGeometry(rW, size * 0.82, size * 1.02), ribbonMat));
      group.add(new THREE.Mesh(new THREE.BoxGeometry(size * 1.02, size * 0.82, rW), ribbonMat));

      const bow1 = new THREE.Mesh(new THREE.TorusGeometry(size * 0.16, size * 0.05, 8, 16), ribbonMat);
      bow1.position.set(-size * 0.12, size * 0.46, 0);
      bow1.rotation.x = Math.PI / 2;
      const bow2 = bow1.clone();
      bow2.position.x = size * 0.12;
      group.add(bow1, bow2);
      return group;
    }

    const giftCount = isMobile ? 4 : 7;
    for (let i = 0; i < giftCount; i++) {
      const size = 3 + Math.random() * 3.5;
      const box = buildGiftBox(size, PALETTE_BOX[i % 3], PALETTE_RIBBON[i % 3]);
      const depth = -10 - Math.random() * 70;
      box.position.set((Math.random() - 0.5) * 74, (Math.random() - 0.5) * 42, depth);
      box.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(box);
      floaters.push({
        mesh: box,
        baseY: box.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        depth
      });
    }

    /* Build 3D Heart Shape */
    function heartShape() {
      const s = new THREE.Shape();
      s.moveTo(0, 0.3);
      s.bezierCurveTo(0, 0.55, -0.35, 0.75, -0.6, 0.5);
      s.bezierCurveTo(-0.9, 0.2, -0.6, -0.25, 0, -0.7);
      s.bezierCurveTo(0.6, -0.25, 0.9, 0.2, 0.6, 0.5);
      s.bezierCurveTo(0.35, 0.75, 0, 0.55, 0, 0.3);
      return s;
    }

    const heartGeo = new THREE.ExtrudeGeometry(heartShape(), {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 2
    });

    const heartCount = isMobile ? 4 : 8;
    for (let i = 0; i < heartCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xdc2626,
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.2
      });
      const h = new THREE.Mesh(heartGeo, mat);
      const scale = 0.8 + Math.random() * 1.2;
      h.scale.set(scale, scale, scale);
      const depth = -10 - Math.random() * 80;
      h.position.set((Math.random() - 0.5) * 82, (Math.random() - 0.5) * 46, depth);
      h.rotation.set(0, 0, Math.random() * Math.PI);
      scene.add(h);
      floaters.push({
        mesh: h,
        baseY: h.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.25,
        rotSpeed: 0.3 + Math.random() * 0.3,
        depth,
        spin: true
      });
    }

    /* Build 3D Octahedron Diamonds */
    const diamondCount = isMobile ? 3 : 6;
    for (let i = 0; i < diamondCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf59e8b,
        emissive: 0xf59e8b,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.7
      });
      const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.6 + Math.random() * 0.5, 0), mat);
      const depth = -10 - Math.random() * 80;
      d.position.set((Math.random() - 0.5) * 82, (Math.random() - 0.5) * 46, depth);
      scene.add(d);
      floaters.push({
        mesh: d,
        baseY: d.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.3,
        rotSpeed: 0.4 + Math.random() * 0.4,
        depth
      });
    }

    /* Build 3D Shopping Bag */
    function buildBag(size, color) {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.15,
        emissive: new THREE.Color(color).multiplyScalar(0.12)
      });
      g.add(new THREE.Mesh(new THREE.BoxGeometry(size, size * 1.1, size * 0.6), mat));
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xf59e8b, roughness: 0.4 });
      const h1 = new THREE.Mesh(new THREE.TorusGeometry(size * 0.22, size * 0.03, 6, 12, Math.PI), handleMat);
      h1.position.set(-size * 0.2, size * 0.6, 0);
      h1.rotation.z = Math.PI;
      const h2 = h1.clone();
      h2.position.x = size * 0.2;
      g.add(h1, h2);
      return g;
    }

    const bagCount = isMobile ? 2 : 4;
    for (let i = 0; i < bagCount; i++) {
      const bag = buildBag(2.2 + Math.random() * 1.2, PALETTE_BOX[i % 3]);
      const depth = -15 - Math.random() * 70;
      bag.position.set((Math.random() - 0.5) * 76, (Math.random() - 0.5) * 43, depth);
      bag.rotation.y = Math.random() * Math.PI;
      scene.add(bag);
      floaters.push({
        mesh: bag,
        baseY: bag.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        depth
      });
    }

    /* Floating Gift Cards */
    const cardCount = isMobile ? 2 : 5;
    for (let i = 0; i < cardCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x160708,
        roughness: 0.3,
        metalness: 0.6,
        emissive: 0xdc2626,
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide
      });
      const c = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), mat);
      const depth = -10 - Math.random() * 75;
      c.position.set((Math.random() - 0.5) * 78, (Math.random() - 0.5) * 44, depth);
      c.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(c);
      floaters.push({
        mesh: c,
        baseY: c.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.25,
        rotSpeed: 0.15 + Math.random() * 0.2,
        depth,
        spin: true
      });
    }

    /* Floating Balloons */
    const balloonCount = isMobile ? 2 : 4;
    for (let i = 0; i < balloonCount; i++) {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 ? 0xdc2626 : 0xf43f5e,
        roughness: 0.25,
        metalness: 0.1,
        emissive: 0x3b0a0a,
        emissiveIntensity: 0.4
      });
      const bsphere = new THREE.Mesh(new THREE.SphereGeometry(1.3, 20, 20), mat);
      bsphere.scale.set(1, 1.2, 1);
      g.add(bsphere);
      const str = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 3, 6),
        new THREE.MeshBasicMaterial({ color: 0x7a5a61 })
      );
      str.position.y = -2.4;
      g.add(str);
      const depth = -20 - Math.random() * 70;
      g.position.set((Math.random() - 0.5) * 80, -20 - Math.random() * 10, depth);
      scene.add(g);
      floaters.push({
        mesh: g,
        baseY: g.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.05,
        rotSpeed: 0.05,
        depth,
        rise: true
      });
    }

    /* Floating Torus Ribbons */
    const ribbonCount = isMobile ? 2 : 5;
    for (let i = 0; i < ribbonCount; i++) {
      const color = PALETTE_RIBBON[i % 3];
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.4,
        emissive: new THREE.Color(color).multiplyScalar(0.3),
        side: THREE.DoubleSide
      });
      const ribbon = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.15, 8, 40, Math.PI * 1.4), mat);
      const depth = -15 - Math.random() * 75;
      ribbon.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 44, depth);
      ribbon.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(ribbon);
      floaters.push({
        mesh: ribbon,
        baseY: ribbon.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.2,
        rotSpeed: 0.2 + Math.random() * 0.2,
        depth,
        spin: true
      });
    }

    /* Particle Field: Celestial Dust / Sparkles */
    const particleCount = isMobile ? 900 : 2200;
    const positions = new Float32Array(particleCount * 3);
    const pcolors = new Float32Array(particleCount * 3);
    const colorChoices = [
      new THREE.Color(0x3b0a0a),
      new THREE.Color(0xdc2626),
      new THREE.Color(0xfff7f7),
      new THREE.Color(0xf43f5e)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      pcolors[i * 3] = c.r;
      pcolors[i * 3 + 1] = c.g;
      pcolors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(pcolors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* Confetti */
    const confettiCount = isMobile ? 10 : 24;
    const confettiColors = [0xdc2626, 0xf43f5e, 0xf59e8b, 0xfff7f7];
    for (let i = 0; i < confettiCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: confettiColors[i % 4],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const conf = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.55), mat);
      const depth = (Math.random() - 0.5) * 70 - 10;
      conf.position.set((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 50, depth);
      conf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(conf);
      floaters.push({
        mesh: conf,
        baseY: conf.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
        rotSpeed: 0.5 + Math.random() * 0.6,
        depth,
        tumble: true
      });
    }

    /* Mouse & Scroll Physics Interaction */
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    function handleMouseMove(e) {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("mousemove", handleMouseMove);

    let scrollY = 0;
    function handleScroll() {
      scrollY = window.scrollY || 0;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    let animId;
    let t = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      t += 0.006;
      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      camera.position.x = Math.sin(t * 0.15) * 4 - mouse.x * 2.2;
      camera.position.y = Math.cos(t * 0.12) * 2.5 + mouse.y * 1.6 - scrollY * 0.008;
      camera.position.z = 42 + Math.sin(t * 0.08) * 3;
      camera.lookAt(mouse.x * 3, mouse.y * 2, 0);

      floaters.forEach((f) => {
        const depthFactor = 1 - Math.min(Math.abs(f.depth) / 90, 1);
        f.mesh.position.y = f.baseY + Math.sin(t * f.speed * 3 + f.phase) * (f.rise ? 0.6 : 1.8);
        if (f.rise) {
          f.mesh.position.y += 0.02;
          if (f.mesh.position.y > 42) f.mesh.position.y = -35;
        }
        if (!f.spin && !f.tumble) {
          f.mesh.rotation.y += f.rotSpeed * 0.01;
          f.mesh.rotation.x += f.rotSpeed * 0.004;
        }
        if (f.spin) f.mesh.rotation.z += f.rotSpeed * 0.008;
        if (f.tumble) {
          f.mesh.rotation.x += f.rotSpeed * 0.01;
          f.mesh.rotation.y += f.rotSpeed * 0.007;
        }
        const targetX = -mouse.x * 6 * depthFactor;
        f.mesh.position.x += (targetX - (f.mesh.userData.px || 0)) * 0.02;
        f.mesh.userData.px = targetX;
      });

      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i += 3) {
        posAttr.array[i * 3 + 1] += Math.sin(t + i) * 0.002;
      }
      posAttr.needsUpdate = true;

      const pulse = 0.5 + Math.sin(t * 0.8) * 0.5;
      pl1.intensity = 2.4 + pulse * 1.2;
      pl2.intensity = 1.8 + (1 - pulse) * 1.0;
      blobGroup.children.forEach((b, i) => {
        b.material.opacity = 0.24 + Math.sin(t * 0.5 + i) * 0.1;
      });

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <React.Fragment>
      <div ref={mountRef} className="go-universe-canvas" />
      <div className="go-universe-overlay" />
    </React.Fragment>
  );
}

// Make accessible to window
if (typeof window !== "undefined") {
  window.GiftUniverseBackground = GiftUniverseBackground;
}
