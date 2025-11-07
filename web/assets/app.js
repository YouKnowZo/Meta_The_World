const heroCanvas = document.getElementById("hero-constellation");
const forgeCanvas = document.getElementById("forge-preview");

/**
 * Hero constellation animation
 */
if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * heroCanvas.width,
    y: Math.random() * heroCanvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));

  const resizeHero = () => {
    heroCanvas.width = heroCanvas.clientWidth * window.devicePixelRatio;
    heroCanvas.height = heroCanvas.clientHeight * window.devicePixelRatio;
  };

  resizeHero();
  window.addEventListener("resize", resizeHero);

  const draw = () => {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    ctx.fillStyle = "rgba(128, 162, 255, 0.8)";
    stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0 || star.x > heroCanvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > heroCanvas.height) star.vy *= -1;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(109, 123, 255, 0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 180 * window.devicePixelRatio) {
          ctx.globalAlpha = 1 - distance / (180 * window.devicePixelRatio);
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  };

  draw();
}

/**
 * Reality map preview
 */
const mapElement = document.getElementById("reality-map");
if (mapElement && window.L) {
  const map = L.map(mapElement, {
    center: [40.73, -73.98],
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const shardData = [
    {
      mode: "prime",
      coords: [40.7206, -74.0007],
      title: "Shard 07 · Neo-Galactic Bazaar",
      body: "A floating market above the Hudson, funded by DAO patrons and curated by reality editors.",
    },
    {
      mode: "alpha",
      coords: [40.7484, -73.9857],
      title: "Shard 01 · Midtown Skyfields",
      body: "Elevated parks and drone ports weaving through skyscrapers. Unlock the AR botanical tour.",
    },
    {
      mode: "echo",
      coords: [40.7061, -74.0092],
      title: "Shard 11 · Echo Harbor",
      body: "Post-mundane maritime village with responsive wave holograms for in-person visitors.",
    },
  ];

  const markerLayer = L.layerGroup().addTo(map);
  const cardTitle = document.getElementById("map-card-title");
  const cardBody = document.getElementById("map-card-body");

  const renderMarkers = (mode) => {
    markerLayer.clearLayers();
    shardData
      .filter((shard) => shard.mode === mode)
      .forEach((shard) => {
        const marker = L.circleMarker(shard.coords, {
          radius: 10,
          color: "#6d7bff",
          fillColor: "#b56dff",
          fillOpacity: 0.7,
          weight: 2,
        });
        marker.addTo(markerLayer);
        marker.on("click", () => {
          cardTitle.textContent = shard.title;
          cardBody.textContent = shard.body;
        });
      });

    const focusShard = shardData.find((shard) => shard.mode === mode);
    if (focusShard) {
      map.flyTo(focusShard.coords, 14, { duration: 1.6 });
      cardTitle.textContent = focusShard.title;
      cardBody.textContent = focusShard.body;
    }
  };

  const toggles = document.querySelectorAll(".toggle");
  toggles.forEach((button) =>
    button.addEventListener("click", () => {
      toggles.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      renderMarkers(button.dataset.mode);
    })
  );

  renderMarkers("prime");
}

/**
 * Three.js Forge Preview
 */
if (forgeCanvas && window.THREE) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050818);

  const camera = new THREE.PerspectiveCamera(
    45,
    forgeCanvas.clientWidth / forgeCanvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(6, 6, 9);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: forgeCanvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(forgeCanvas.clientWidth, forgeCanvas.clientHeight);

  const ambient = new THREE.AmbientLight(0x7777ff, 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xb56dff, 1.3);
  dirLight.position.set(5, 10, 4);
  scene.add(dirLight);

  const groundGeo = new THREE.CircleGeometry(6, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x111629,
    emissive: 0x222244,
    metalness: 0.6,
    roughness: 0.35,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const towerGroup = new THREE.Group();
  scene.add(towerGroup);

  const towerColors = [0x6d7bff, 0xb56dff, 0x7ccfff];
  for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry(0.6, 1 + Math.random() * 3.5, 0.6);
    const material = new THREE.MeshStandardMaterial({
      color: towerColors[i % towerColors.length],
      emissive: towerColors[i % towerColors.length],
      emissiveIntensity: 0.3 + Math.random() * 0.4,
      metalness: 0.7,
      roughness: 0.25,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const angle = (i / 10) * Math.PI * 2;
    const radius = 1.4 + Math.random() * 1.2;
    mesh.position.set(Math.cos(angle) * radius, geometry.parameters.height / 2, Math.sin(angle) * radius);
    towerGroup.add(mesh);
  }

  const centralGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.28, 64);
  const centralMat = new THREE.MeshStandardMaterial({
    color: 0x1a2347,
    emissive: 0x4b58ff,
    emissiveIntensity: 0.4,
    metalness: 0.55,
    roughness: 0.35,
  });
  const central = new THREE.Mesh(centralGeo, centralMat);
  central.position.y = 0.15;
  scene.add(central);

  const resizeForge = () => {
    const width = forgeCanvas.clientWidth;
    const height = forgeCanvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener("resize", resizeForge);

  const animate = () => {
    requestAnimationFrame(animate);
    towerGroup.rotation.y += 0.0035;
    central.rotation.y -= 0.0025;
    renderer.render(scene, camera);
  };

  animate();
}
