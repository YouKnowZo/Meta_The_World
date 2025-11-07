const heroCanvas = document.getElementById("hero-constellation");
const forgeCanvas = document.getElementById("forge-preview");

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatShort = (value, { currency = false, decimals = 1 } = {}) => {
  const abs = Math.abs(value);
  let scaled = value;
  let suffix = "";

  if (abs >= 1e9) {
    scaled = value / 1e9;
    suffix = "B";
  } else if (abs >= 1e6) {
    scaled = value / 1e6;
    suffix = "M";
  } else if (abs >= 1e3) {
    scaled = value / 1e3;
    suffix = "K";
  } else {
    if (currency) return currencyFormatter.format(value);
    return numberFormatter.format(Math.round(value));
  }

  const fixed = scaled.toFixed(decimals);
  const trimmed = fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return currency ? `$${trimmed}${suffix}` : `${trimmed}${suffix}`;
};

/**
 * Hero constellation animation
 */
if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  const stars = [];

  const createStar = () => ({
    x: Math.random() * heroCanvas.width,
    y: Math.random() * heroCanvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  });

  const initStars = () => {
    stars.length = 0;
    for (let i = 0; i < 80; i++) {
      stars.push(createStar());
    }
  };

  const resizeHero = () => {
    heroCanvas.width = heroCanvas.clientWidth * window.devicePixelRatio;
    heroCanvas.height = heroCanvas.clientHeight * window.devicePixelRatio;
    initStars();
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
      body:
        "A floating market above the Hudson with adaptive traders. Visit IRL to unlock AI merchants, wearables, and reality editor quests.",
      volume: 4200000,
      traffic: 182000,
    },
    {
      mode: "prime",
      coords: [40.758, -73.9855],
      title: "Shard 09 · Midnight Holo-Theatre",
      body:
        "Times Square is reborn as a volumetric musical arena. Ticket NFTs stream royalties to performers in real time.",
      volume: 6100000,
      traffic: 254000,
    },
    {
      mode: "prime",
      coords: [40.729, -73.9972],
      title: "Shard 12 · Greenwich Neural Commons",
      body:
        "A co-creative campus where AI sages mentor builders. Stake `META` to unlock lab pods and neural crafting tools.",
      volume: 3800000,
      traffic: 139000,
    },
    {
      mode: "alpha",
      coords: [40.7484, -73.9857],
      title: "Shard 01 · Midtown Skyfields",
      body:
        "Elevated parks and drone ports weaving through skyscrapers. Unlock the AR botanical tour and vertical farming co-ops.",
      volume: 1450000,
      traffic: 84000,
    },
    {
      mode: "alpha",
      coords: [40.7128, -74.0131],
      title: "Shard 05 · Wall Street Syndicate",
      body:
        "Realtime trading floors merge with gamified DeFi pits. Back virtual IPOs and earn trader flair NFTs.",
      volume: 2200000,
      traffic: 96000,
    },
    {
      mode: "echo",
      coords: [40.7061, -74.0092],
      title: "Shard 11 · Echo Harbor",
      body:
        "Post-mundane maritime village with responsive wave holograms for in-person visitors and tidal energy staking.",
      volume: 1750000,
      traffic: 118000,
    },
    {
      mode: "echo",
      coords: [40.7308, -73.9975],
      title: "Shard 19 · Village Memory Arcade",
      body:
        "Collective nostalgia hub rendering alternate timelines of the West Village. Unlock storyline NFTs via scavenger hunts.",
      volume: 1280000,
      traffic: 67000,
    },
  ];

  const markerLayer = L.layerGroup().addTo(map);
  const cardTitle = document.getElementById("map-card-title");
  const cardBody = document.getElementById("map-card-body");
  const cardVolume = document.getElementById("map-card-volume");
  const cardTraffic = document.getElementById("map-card-traffic");

  const updateCard = (shard) => {
    if (!shard) return;
    cardTitle.textContent = shard.title;
    cardBody.textContent = shard.body;
    if (cardVolume) {
      cardVolume.textContent = `24h Volume · ${formatShort(shard.volume, { currency: true, decimals: 1 })}`;
    }
    if (cardTraffic) {
      const decimals = shard.traffic >= 1_000_000 ? 2 : 0;
      cardTraffic.textContent = `Live Visitors · ${formatShort(shard.traffic, { decimals })}`;
    }
  };

  const renderMarkers = (mode) => {
    markerLayer.clearLayers();
    const filtered = shardData.filter((shard) => shard.mode === mode);
    const bounds = [];

    filtered.forEach((shard) => {
      const marker = L.circleMarker(shard.coords, {
        radius: 10,
        color: "#6d7bff",
        fillColor: "#b56dff",
        fillOpacity: 0.7,
        weight: 2,
      });
      marker.addTo(markerLayer);
      bounds.push(shard.coords);
      marker.on("click", () => updateCard(shard));
    });

    if (filtered.length > 1) {
      map.flyToBounds(bounds, { duration: 1.6, padding: [40, 40] });
      updateCard(filtered[0]);
    } else if (filtered.length === 1) {
      map.flyTo(filtered[0].coords, 14, { duration: 1.6 });
      updateCard(filtered[0]);
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
 * Engagement metrics + ticker + revenue
 */
const metricConfigs = [
  {
    valueEl: document.getElementById("stat-concurrent"),
    deltaEl: document.getElementById("stat-concurrent-delta"),
    current: 128431,
    noise: 2200,
    positiveBias: 0.78,
    deltaPositive: [2.3, 6.6],
    deltaNegative: [0.4, 2.4],
    min: 95000,
    max: 350000,
    formatter: (value) => numberFormatter.format(Math.round(value)),
  },
  {
    valueEl: document.getElementById("stat-retention"),
    deltaEl: document.getElementById("stat-retention-delta"),
    current: 87.9,
    noise: 0.6,
    positiveBias: 0.72,
    deltaPositive: [0.9, 2.4],
    deltaNegative: [0.3, 1.2],
    min: 72,
    max: 95,
    formatter: (value) => `${value.toFixed(1)}%`,
  },
  {
    valueEl: document.getElementById("stat-arppu"),
    deltaEl: document.getElementById("stat-arppu-delta"),
    current: 164.32,
    noise: 6,
    positiveBias: 0.74,
    deltaPositive: [2.0, 7.8],
    deltaNegative: [0.5, 2.4],
    min: 120,
    max: 320,
    formatter: (value) => currencyFormatter.format(value),
  },
  {
    valueEl: document.getElementById("stat-quests"),
    deltaEl: document.getElementById("stat-quests-delta"),
    current: 41220,
    noise: 1800,
    positiveBias: 0.8,
    deltaPositive: [4.5, 12.8],
    deltaNegative: [1.1, 4.2],
    min: 15000,
    max: 120000,
    formatter: (value) => numberFormatter.format(Math.round(value)),
  },
];

if (metricConfigs.every((metric) => metric.valueEl && metric.deltaEl)) {
  const updateMetrics = () => {
    metricConfigs.forEach((metric) => {
      const goPositive = Math.random() < metric.positiveBias;
      const [minDelta, maxDelta] = goPositive ? metric.deltaPositive : metric.deltaNegative;
      const deltaValue = (Math.random() * (maxDelta - minDelta) + minDelta) * (goPositive ? 1 : -1);
      const drift = metric.current * (1 + deltaValue / 100);
      metric.current = drift + (Math.random() - 0.5) * metric.noise;
      if (metric.min !== undefined) {
        metric.current = Math.max(metric.min, metric.current);
      }
      if (metric.max !== undefined) {
        metric.current = Math.min(metric.max, metric.current);
      }
      metric.valueEl.textContent = metric.formatter(metric.current);
      metric.deltaEl.textContent = `${deltaValue >= 0 ? "+" : ""}${deltaValue.toFixed(1)}%`;
      metric.deltaEl.classList.toggle("positive", deltaValue >= 0);
      metric.deltaEl.classList.toggle("negative", deltaValue < 0);
    });
  };

  updateMetrics();
  setInterval(updateMetrics, 4500);
}

const tickerTrack = document.getElementById("ticker-track");
if (tickerTrack) {
  const baseTransactions = [
    { user: "@NeoArchitect", action: "leased", asset: "Sky Loft 909", amount: 8420, shard: "Shard 07" },
    { user: "@LuminousLia", action: "sold", asset: "Atlas Couture Drop", amount: 1280, shard: "Shard 12" },
    { user: "@Metaforge", action: "funded", asset: "District DAO Sprint", amount: 452000, shard: "Shard 05" },
    { user: "@SynthChef", action: "booked", asset: "NeuroDining Experience", amount: 620, shard: "Shard 09" },
    { user: "@SkylineDev", action: "minted", asset: "Reality Editor Badge", amount: 320, shard: "Shard 07" },
    { user: "@FutureMuse", action: "auctioned", asset: "Volumetric Concert Suite", amount: 189000, shard: "Shard 09" },
    { user: "@EchoPilot", action: "chartered", asset: "Tidal Drone Fleet", amount: 17450, shard: "Shard 11" },
    { user: "@GuildMother", action: "streamed", asset: "Therapy Pod Session", amount: 210, shard: "Shard 12" },
    { user: "@CryptoCartier", action: "franchised", asset: "Luxury Wearable Kiosk", amount: 36400, shard: "Shard 05" },
    { user: "@VibeCaster", action: "licensed", asset: "Narrative AI Engine", amount: 9500, shard: "Shard 19" },
    { user: "@PulseRider", action: "staked", asset: "Event Liquidity Pool", amount: 72000, shard: "Shard 09" },
    { user: "@MythSeeker", action: "claimed", asset: "Memory Corridor Pass", amount: 440, shard: "Shard 19" },
  ];

  const buildTickerString = (tx) =>
    `${tx.user} ${tx.action} ${tx.asset} · ${currencyFormatter.format(tx.amount)} · ${tx.shard} · Protocol +2.75%`;

  const baseLength = baseTransactions.length;
  tickerTrack.innerHTML = baseTransactions
    .concat(baseTransactions)
    .map((tx) => `<span class="ticker__item">${buildTickerString(tx)}</span>`)
    .join("");

  const tickerItems = Array.from(tickerTrack.querySelectorAll(".ticker__item"));

  const users = [
    "@NeoArchitect",
    "@LuminousLia",
    "@Metaforge",
    "@SynthChef",
    "@VibeCaster",
    "@SkylineDev",
    "@PulseRider",
    "@EchoPilot",
    "@GuildMother",
    "@FutureMuse",
    "@CryptoCartier",
    "@MythSeeker",
    "@GlitchOracle",
  ];
  const actions = [
    "leased",
    "sold",
    "minted",
    "auctioned",
    "funded",
    "chartered",
    "licensed",
    "commissioned",
    "booked",
    "crafted",
    "staked",
    "franchised",
  ];
  const assets = [
    "Sky Loft Suite",
    "AI Stylist Capsule",
    "Reality Editor Badge",
    "Volumetric Concert Suite",
    "NeuroDining Experience",
    "Shard Governance Seat",
    "Emotive NPC Network",
    "Luxury Wearable Kiosk",
    "Storyline AI Engine",
    "Holo-Bridge Lease",
    "Tidal Drone Fleet",
    "Guild Accelerator Slot",
  ];
  const shards = ["Shard 07", "Shard 09", "Shard 12", "Shard 05", "Shard 11", "Shard 19", "Shard 01"];

  const generateTransaction = () => ({
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    asset: assets[Math.floor(Math.random() * assets.length)],
    amount: Math.round((Math.random() ** 2) * 450000 + 180),
    shard: shards[Math.floor(Math.random() * shards.length)],
  });

  let pointer = 0;
  setInterval(() => {
    const tx = generateTransaction();
    baseTransactions[pointer] = tx;
    const text = buildTickerString(tx);
    tickerItems[pointer].textContent = text;
    tickerItems[pointer + baseLength].textContent = text;
    pointer = (pointer + 1) % baseLength;
  }, 4000);
}

const revenueElements = {
  gross: document.getElementById("rev-gross"),
  profit: document.getElementById("rev-profit"),
  creators: document.getElementById("rev-creators"),
  investors: document.getElementById("rev-investors"),
};

if (revenueElements.gross && revenueElements.profit && revenueElements.creators && revenueElements.investors) {
  let grossVolume = 12_400_000;
  const protocolRate = 0.0275;
  const creatorShare = 0.79;

  const updateRevenue = () => {
    const drift = 1 + (Math.random() - 0.4) * 0.08;
    grossVolume = Math.max(6_500_000, grossVolume * drift);
    const protocolProfit = grossVolume * protocolRate;
    const creatorPayout = grossVolume * creatorShare;
    const investorYield = Math.max(0, grossVolume - protocolProfit - creatorPayout);

    revenueElements.gross.textContent = formatShort(grossVolume, { currency: true, decimals: 1 });
    revenueElements.profit.textContent = formatShort(protocolProfit, { currency: true, decimals: 2 });
    revenueElements.creators.textContent = formatShort(creatorPayout, { currency: true, decimals: 1 });
    revenueElements.investors.textContent = formatShort(investorYield, { currency: true, decimals: 1 });
  };

  updateRevenue();
  setInterval(updateRevenue, 6000);
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

  const walkwayGeo = new THREE.TorusGeometry(3.2, 0.08, 32, 160);
  const walkwayMat = new THREE.MeshStandardMaterial({
    color: 0x1f2c5c,
    emissive: 0x3d4bff,
    emissiveIntensity: 0.25,
    metalness: 0.85,
    roughness: 0.2,
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.rotation.x = Math.PI / 2;
  walkway.position.y = 0.18;
  scene.add(walkway);

  const haloGeo = new THREE.RingGeometry(2.1, 2.5, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x6d7bff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.18,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.21;
  scene.add(halo);

  const towerColors = [0x6d7bff, 0xb56dff, 0x7ccfff];
  for (let i = 0; i < 12; i++) {
    const geometry = new THREE.BoxGeometry(0.6, 1.2 + Math.random() * 3.8, 0.6);
    const material = new THREE.MeshStandardMaterial({
      color: towerColors[i % towerColors.length],
      emissive: towerColors[i % towerColors.length],
      emissiveIntensity: 0.3 + Math.random() * 0.45,
      metalness: 0.72,
      roughness: 0.22,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const angle = (i / 12) * Math.PI * 2;
    const radius = 1.45 + Math.random() * 1.4;
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

  const scanGeo = new THREE.CylinderGeometry(3.4, 3.4, 0.02, 64, 1, true);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0xb56dff,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  });
  const scanPlane = new THREE.Mesh(scanGeo, scanMat);
  scanPlane.position.y = 0.9;
  scene.add(scanPlane);

  const orbiters = [];
  const orbiterGeo = new THREE.SphereGeometry(0.12, 24, 24);
  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xb56dff,
      emissiveIntensity: 1.1,
      metalness: 0.25,
      roughness: 0.3,
    });
    const orbiter = new THREE.Mesh(orbiterGeo, material);
    orbiter.userData = {
      radius: 2.2 + Math.random() * 1.4,
      height: 0.6 + Math.random() * 0.9,
      speed: 0.55 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(orbiter);
    orbiters.push(orbiter);
  }

  const pulseLight = new THREE.PointLight(0x7ccfff, 1.2, 20, 2);
  pulseLight.position.set(0, 1.8, 0);
  scene.add(pulseLight);

  const hoverLight = new THREE.SpotLight(0xffffff, 0.35, 0, Math.PI / 4, 0.5, 2);
  hoverLight.position.set(0, 6, 0);
  hoverLight.target.position.set(0, 0, 0);
  scene.add(hoverLight);
  scene.add(hoverLight.target);

  const resizeForge = () => {
    const width = forgeCanvas.clientWidth;
    const height = forgeCanvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener("resize", resizeForge);
  resizeForge();

  const animate = () => {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;

    towerGroup.rotation.y += 0.0035;
    central.rotation.y -= 0.0025;
    walkway.rotation.z += 0.0015;

    halo.material.opacity = 0.16 + Math.sin(time * 0.8) * 0.05;
    scanPlane.position.y = 0.6 + Math.sin(time * 1.1) * 0.45;
    scanPlane.material.opacity = 0.08 + Math.abs(Math.sin(time * 1.4)) * 0.1;

    pulseLight.intensity = 1.05 + Math.sin(time * 1.4) * 0.35;
    hoverLight.intensity = 0.25 + Math.abs(Math.cos(time * 0.6)) * 0.3;

    orbiters.forEach((orbiter, index) => {
      const { radius, height, speed, offset } = orbiter.userData;
      const phase = time * speed + offset;
      orbiter.position.set(
        Math.cos(phase) * radius,
        height + Math.sin(time * 1.4 + index) * 0.25,
        Math.sin(phase) * radius
      );
    });

    renderer.render(scene, camera);
  };

  animate();
}
