import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class WorldEngine {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.properties = [];
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.onPropertyClick = null;
    
    this.init();
  }
  
  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      2000
    );
    this.camera.position.set(50, 50, 50);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer setup with high quality settings
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    
    // Lighting - realistic setup
    this.setupLighting();
    
    // Environment
    this.createEnvironment();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Handle mouse clicks for property selection
    this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
    
    // Start animation loop
    this.animate();
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.bias = -0.0001;
    this.scene.add(directionalLight);
    
    // Hemisphere light for natural sky lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    this.scene.add(hemisphereLight);
    
    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 200);
    pointLight1.position.set(30, 20, 30);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 200);
    pointLight2.position.set(-30, 20, -30);
    this.scene.add(pointLight2);
  }
  
  createEnvironment() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x90EE90,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Add some terrain variation
    this.createTerrain();
    
    // Add trees and nature
    this.createNature();
    
    // Add water features
    this.createWater();
  }
  
  createTerrain() {
    // Hills and valleys for realism
    const terrainGroup = new THREE.Group();
    
    for (let i = 0; i < 20; i++) {
      const hillGeometry = new THREE.ConeGeometry(
        Math.random() * 30 + 10,
        Math.random() * 20 + 5,
        8
      );
      const hillMaterial = new THREE.MeshStandardMaterial({
        color: 0x7CB342,
        roughness: 0.9,
      });
      const hill = new THREE.Mesh(hillGeometry, hillMaterial);
      hill.position.set(
        (Math.random() - 0.5) * 400,
        Math.random() * 10,
        (Math.random() - 0.5) * 400
      );
      hill.castShadow = true;
      hill.receiveShadow = true;
      terrainGroup.add(hill);
    }
    
    this.scene.add(terrainGroup);
  }
  
  createNature() {
    const natureGroup = new THREE.Group();
    
    // Trees
    for (let i = 0; i < 50; i++) {
      const tree = this.createTree();
      tree.position.set(
        (Math.random() - 0.5) * 400,
        0,
        (Math.random() - 0.5) * 400
      );
      natureGroup.add(tree);
    }
    
    this.scene.add(natureGroup);
  }
  
  createTree() {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 4;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Foliage
    const foliageGeometry = new THREE.ConeGeometry(3, 6, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22,
      roughness: 0.8,
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 10;
    foliage.castShadow = true;
    treeGroup.add(foliage);
    
    return treeGroup;
  }
  
  createWater() {
    const waterGeometry = new THREE.PlaneGeometry(200, 200);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x006994,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(150, 0.1, -150);
    water.receiveShadow = true;
    this.scene.add(water);
  }
  
  addProperty(propertyData) {
    const propertyMesh = this.createPropertyMesh(propertyData);
    propertyMesh.userData = { propertyId: propertyData.id, ...propertyData };
    this.properties.push(propertyMesh);
    this.scene.add(propertyMesh);
    return propertyMesh;
  }
  
  createPropertyMesh(property) {
    const group = new THREE.Group();
    
    // Main building
    const buildingGeometry = new THREE.BoxGeometry(
      property.size.width,
      property.size.height,
      property.size.depth
    );
    
    let buildingColor = 0xCCCCCC;
    if (property.type === 'residential') {
      buildingColor = 0xE8D5B7;
    } else if (property.type === 'commercial') {
      buildingColor = 0x708090;
    }
    
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: buildingColor,
      roughness: 0.6,
      metalness: 0.3,
    });
    
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = property.size.height / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x87CEEB,
      emissive: 0x444444,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
    });
    
    const windowCount = Math.floor(property.size.width / 5);
    for (let i = 0; i < windowCount; i++) {
      const windowGeometry = new THREE.PlaneGeometry(2, 2);
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(
        -property.size.width / 2 + (i + 1) * (property.size.width / (windowCount + 1)),
        property.size.height * 0.6,
        property.size.depth / 2 + 0.1
      );
      group.add(window);
    }
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(
      property.size.width * 0.7,
      property.size.height * 0.3,
      4
    );
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.9,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = property.size.height;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
    
    // Position the property
    group.position.set(
      property.location.x,
      property.location.y,
      property.location.z
    );
    
    // Add label
    this.addPropertyLabel(group, property);
    
    return group;
  }
  
  addPropertyLabel(group, property) {
    // Create a simple label using CSS2DRenderer would be better, but for now use a sprite
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, 256, 64);
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(property.name, 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.y = property.size.height + 5;
    sprite.scale.set(10, 2.5, 1);
    group.add(sprite);
  }
  
  highlightProperty(propertyId, highlight = true) {
    const property = this.properties.find(p => p.userData.propertyId === propertyId);
    if (!property) return;
    
    if (highlight) {
      property.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0xffff00);
          child.material.emissiveIntensity = 0.3;
        }
      });
    } else {
      property.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      });
    }
  }
  
  onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with properties
    const intersects = this.raycaster.intersectObjects(this.properties, true);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      // Traverse up to find the property group
      let propertyGroup = clickedObject;
      while (propertyGroup && !propertyGroup.userData.propertyId) {
        propertyGroup = propertyGroup.parent;
      }
      
      if (propertyGroup && propertyGroup.userData.propertyId && this.onPropertyClick) {
        this.onPropertyClick(propertyGroup.userData.propertyId);
      }
    }
  }
  
  setOnPropertyClick(callback) {
    this.onPropertyClick = callback;
  }
  
  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    // Update controls
    this.controls.update();
    
    // Animate water or other elements
    const water = this.scene.children.find(child => 
      child.material && child.material.color.getHex() === 0x006994
    );
    if (water) {
      water.rotation.z += 0.001;
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
  }
}
