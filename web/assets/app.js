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
 * Life Path Architect
 */
const builderElements = {
  selects: {
    persona: document.getElementById("builder-persona"),
    district: document.getElementById("builder-district"),
    venture: document.getElementById("builder-venture"),
    mobility: document.getElementById("builder-mobility"),
    relationship: document.getElementById("builder-relationship"),
  },
  title: document.getElementById("builder-title"),
  description: document.getElementById("builder-description"),
  profit: document.getElementById("builder-profit"),
  engagement: document.getElementById("builder-engagement"),
  influence: document.getElementById("builder-influence"),
  timeline: document.getElementById("builder-timeline"),
  randomise: document.getElementById("builder-randomise"),
  schedule: document.getElementById("builder-schedule"),
};

if (
  builderElements.title &&
  builderElements.description &&
  builderElements.profit &&
  builderElements.engagement &&
  builderElements.influence &&
  builderElements.timeline &&
  Object.values(builderElements.selects).every(Boolean)
) {
  const builderData = {
    persona: [
      {
        value: "neo_architect",
        label: "Neo Architect",
        summary: "You orchestrate living skyscrapers that morph with each visitor’s memories.",
        baseProfit: 48000,
        engagement: 5400,
        influence: 82,
        timeline: [
          { time: "06:00", text: "Biofeedback sunrise calibrates neural design instincts." },
          { time: "09:30", text: "VR atelier unveils adaptive façade concepts to VIP investors." },
          { time: "14:00", text: "Creator council syncs to sequence citywide holo-installation." },
        ],
      },
      {
        value: "crypto_urbanist",
        label: "Crypto Urbanist",
        summary: "You tokenize public spaces, balancing civic acclaim with DeFi velocity.",
        baseProfit: 42000,
        engagement: 6100,
        influence: 76,
        timeline: [
          { time: "07:15", text: "Open-ledger briefing sets today’s urban governance votes." },
          { time: "12:00", text: "Lunchwalk sparks drop-in salons for citizen investors." },
          { time: "21:00", text: "Nightly DAO plenary streams to 220K watchers." },
        ],
      },
      {
        value: "sonic_storyweaver",
        label: "Sonic Storyweaver",
        summary: "Your immersive narrative concerts fuse AI choirs with haptic street theaters.",
        baseProfit: 39000,
        engagement: 6800,
        influence: 88,
        timeline: [
          { time: "10:00", text: "Rehearsal dome syncs neural choirs to crowd biometrics." },
          { time: "19:30", text: "Volumetric headline show floods timelines with fan-made remixes." },
          { time: "23:45", text: "Afterglow lounge monetizes encore NFTs and backstage meetups." },
        ],
      },
      {
        value: "bio_synth_oracle",
        label: "Bio-Synth Oracle",
        summary: "You design wellness rituals that blend biotech sanctuaries with AI guidance.",
        baseProfit: 44000,
        engagement: 5200,
        influence: 90,
        timeline: [
          { time: "05:45", text: "Chromatic meditation dome calibrates personal aura algorithms." },
          { time: "13:15", text: "One-on-one oracle sessions translate biosignals into life upgrades." },
          { time: "20:20", text: "Moonlit ceremony streams serenity tokens to subscribers." },
        ],
      },
    ],
    district: [
      {
        value: "skyline_dominion",
        label: "Skyline Dominion",
        summary: "Panoramic penthouses hover above the city with concierge drones.",
        profitMultiplier: 1.18,
        engagement: 900,
        influence: 12,
        timeline: [
          { time: "08:30", text: "Atrium salon hosts cross-shard investors for breakfast pitches." },
        ],
      },
      {
        value: "tidal_arcology",
        label: "Tidal Arcology",
        summary: "Floating eco-district powered by tidal generators and luminous reefs.",
        profitMultiplier: 1.12,
        engagement: 720,
        influence: 10,
        timeline: [
          { time: "16:30", text: "Hydro drift garden welcomes celebrity healers for AR tours." },
        ],
      },
      {
        value: "memory_lanes",
        label: "Memory Lanes",
        summary: "Retro-futurist boulevards remix nostalgia with augmented reality loops.",
        profitMultiplier: 1.09,
        engagement: 840,
        influence: 8,
        timeline: [
          { time: "18:00", text: "Pop-up story corridor captures micro-payments from tourists." },
        ],
      },
      {
        value: "quantum_bazaar",
        label: "Quantum Bazaar",
        summary: "Always-on market where AI traders auction limited physical-digital hybrids.",
        profitMultiplier: 1.15,
        engagement: 1020,
        influence: 9,
        timeline: [
          { time: "11:45", text: "Flash auction triggers profit splits across district DAO." },
        ],
      },
    ],
    venture: [
      {
        value: "holo_fashion",
        label: "Holographic Fashion House",
        summary: "Launch couture that adapts to climate, context, and emotion.",
        profitAdd: 26000,
        engagement: 1900,
        influence: 14,
        timeline: [
          { time: "15:00", text: "Runway AI iterates capsule wardrobes for high-net patrons." },
        ],
      },
      {
        value: "ar_concert",
        label: "AR Concert Residency",
        summary: "Weekly residencies fuse live music with AR quests and loot drops.",
        profitAdd: 31000,
        engagement: 2400,
        influence: 16,
        timeline: [
          { time: "20:30", text: "Arena lighting syncs token burn rates with encore intensity." },
        ],
      },
      {
        value: "neuro_therapy",
        label: "NeuroTherapy Collective",
        summary: "Biofeedback clinics monetize serenity protocols for elite members.",
        profitAdd: 22000,
        engagement: 1500,
        influence: 13,
        timeline: [
          { time: "17:45", text: "Premium clients unlock bespoke neuro-sculpting sessions." },
        ],
      },
      {
        value: "guild_incubator",
        label: "Creator Guild Incubator",
        summary: "Mentor rising creators, taking yield on every breakout franchise.",
        profitAdd: 34000,
        engagement: 2100,
        influence: 18,
        timeline: [
          { time: "14:45", text: "Guild sprint awards micro-grants with instant staking options." },
        ],
      },
    ],
    mobility: [
      {
        value: "grav_lift",
        label: "Grav-Lift Fleet",
        summary: "Personal levitation pods whisk you across shards in minutes.",
        profitMultiplier: 1.07,
        engagement: 450,
        influence: 5,
        timeline: [
          { time: "07:55", text: "Lev-lift hop streams skyline footage for sponsor placements." },
        ],
      },
      {
        value: "quantum_rail",
        label: "Quantum Rail Pass",
        summary: "High-speed portals teleport you between districts with zero latency.",
        profitMultiplier: 1.05,
        engagement: 520,
        influence: 6,
        timeline: [
          { time: "13:45", text: "Rail portal meetup spawns spontaneous creator collabs." },
        ],
      },
      {
        value: "suborbital_jet",
        label: "Suborbital Jet Syndicate",
        summary: "Fractional ownership of jets that host VIP mixers mid-flight.",
        profitMultiplier: 1.12,
        engagement: 380,
        influence: 9,
        timeline: [
          { time: "22:10", text: "Jetstream mixer closes three venture rounds before landing." },
        ],
      },
      {
        value: "ai_pods",
        label: "AI Chauffeur Pods",
        summary: "Emotion-aware pods manage your calendar and monetize ad slots.",
        profitMultiplier: 1.04,
        engagement: 560,
        influence: 7,
        timeline: [
          { time: "08:05", text: "Pod analytics auto-negotiates sponsorships en route." },
        ],
      },
    ],
    relationship: [
      {
        value: "poly_synergy",
        label: "Poly-Synergy Crew",
        summary: "Collective of partners co-manage experiences and split upside.",
        profitAdd: 8000,
        engagement: 1200,
        influence: 10,
        timeline: [
          { time: "12:30", text: "Crew sync charts daily moodboards and revenue goals." },
        ],
      },
      {
        value: "power_partner",
        label: "Power Partner",
        summary: "A powerhouse duo balancing intimacy with empire building.",
        profitAdd: 6000,
        engagement: 900,
        influence: 12,
        timeline: [
          { time: "18:30", text: "Power dinner converts VIP guests into recurring investors." },
        ],
      },
      {
        value: "solo_visionary",
        label: "Solo Visionary",
        summary: "Forge your own legend with AI confidants and fan-led councils.",
        profitAdd: 4000,
        engagement: 700,
        influence: 8,
        timeline: [
          { time: "23:00", text: "Late-night stream galvanises fan DAO to bankroll expansions." },
        ],
      },
      {
        value: "dao_family",
        label: "DAO Family",
        summary: "Chosen family DAO governs co-created ventures and care pods.",
        profitAdd: 9500,
        engagement: 1100,
        influence: 14,
        timeline: [
          { time: "16:00", text: "Family council locks in weekly dividend distribution votes." },
        ],
      },
    ],
  };

  const specialMoments = [
    { time: "02:00", text: "Moonshot lab surprises fans with stealth beta invite." },
    { time: "04:30", text: "Lucid dreaming session unlocks new volumetric narrative arc." },
    { time: "11:11", text: "Angel investor pings you with instant liquidity boost." },
    { time: "19:19", text: "Community flash-mob trends your shard across the mirrorverse." },
    { time: "21:45", text: "Protocol airdrop rewards loyal visitors with bonus yield." },
  ];

  const state = {
    persona: null,
    district: null,
    venture: null,
    mobility: null,
    relationship: null,
  };

  const populateSelect = (select, options) => {
    select.innerHTML = "";
    options.forEach((option, index) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      if (index === 0) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  };

  const getOption = (category, value) => builderData[category].find((item) => item.value === value) ?? builderData[category][0];

  Object.entries(builderElements.selects).forEach(([category, select]) => {
    populateSelect(select, builderData[category]);
    state[category] = getOption(category, select.value);
    select.addEventListener("change", (event) => {
      state[category] = getOption(category, event.target.value);
      renderBuilder();
    });
  });

  const minutesFromTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const renderBuilder = ({ jitter = false } = {}) => {
    const components = Object.values(state);
    if (components.some((component) => !component)) return;

    const persona = state.persona;
    const district = state.district;
    const venture = state.venture;
    const mobility = state.mobility;
    const relationship = state.relationship;

    const baseProfit = persona.baseProfit + venture.profitAdd + relationship.profitAdd;
    const profitMultiplier = district.profitMultiplier * mobility.profitMultiplier;
    const projectedProfit = Math.round(baseProfit * profitMultiplier);

    const engagementScore =
      persona.engagement +
      venture.engagement +
      district.engagement +
      mobility.engagement +
      relationship.engagement;

    const influenceIndex =
      persona.influence +
      venture.influence +
      district.influence +
      mobility.influence +
      relationship.influence;

    builderElements.title.textContent = `${persona.label} · ${district.label}`;

    const descriptionParts = [
      persona.summary,
      district.summary,
      venture.summary,
      mobility.summary,
      relationship.summary,
    ].filter(Boolean);
    builderElements.description.textContent = descriptionParts.join(" ");

    builderElements.profit.textContent = formatShort(projectedProfit, { currency: true, decimals: 2 });
    builderElements.engagement.textContent = `${numberFormatter.format(Math.round(engagementScore))} interactions`;
    builderElements.influence.textContent = `${Math.round(influenceIndex)}`;

    const timelineEntries = [
      ...persona.timeline,
      ...district.timeline,
      ...venture.timeline,
      ...mobility.timeline,
      ...relationship.timeline,
    ].map((entry, index) => ({ ...entry, order: index }));

    if (jitter && specialMoments.length > 0 && Math.random() > 0.25) {
      const bonus = specialMoments[Math.floor(Math.random() * specialMoments.length)];
      timelineEntries.push({ ...bonus, order: timelineEntries.length + Math.random() });
    }

    timelineEntries.sort((a, b) => {
      const diff = minutesFromTime(a.time) - minutesFromTime(b.time);
      return diff === 0 ? a.order - b.order : diff;
    });

    builderElements.timeline.innerHTML = timelineEntries
      .map(
        (entry) =>
          `<li><span>${entry.time}</span>${entry.text}</li>`
      )
      .join("");
  };

  if (builderElements.randomise) {
    builderElements.randomise.addEventListener("click", () => {
      Object.entries(builderElements.selects).forEach(([category, select]) => {
        const options = builderData[category];
        const selected = options[Math.floor(Math.random() * options.length)];
        select.value = selected.value;
        state[category] = selected;
      });
      renderBuilder({ jitter: true });
    });
  }

  if (builderElements.schedule) {
    builderElements.schedule.addEventListener("click", () => {
      builderElements.timeline.classList.add("is-refreshing");
      renderBuilder({ jitter: true });
      setTimeout(() => builderElements.timeline.classList.remove("is-refreshing"), 900);
    });
  }

  renderBuilder();
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
