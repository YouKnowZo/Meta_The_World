// MetaWorld - Virtual World Engine
// Handles 3D rendering, physics, and world state

class WorldEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.properties = [];
        this.selectedProperty = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.animationId = null;
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
        this.scene.fog = new THREE.Fog(0x87ceeb, 100, 500);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Add lights
        this.addLights();

        // Create ground
        this.createGround();

        // Create city grid
        this.createCityGrid();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Handle mouse clicks
        window.addEventListener('click', (e) => this.onMouseClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Start animation loop
        this.animate();
    }

    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -200;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x6b8e23, 0.4);
        this.scene.add(hemiLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a5f0b,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add some variation to terrain
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.random() * 2; // Slight height variation
        }
        groundGeometry.attributes.position.needsUpdate = true;
        groundGeometry.computeVertexNormals();

        // Add roads
        this.createRoads();
    }

    createRoads() {
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9
        });

        // Main roads
        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;
            
            // Horizontal roads
            const roadH = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 8),
                roadMaterial
            );
            roadH.rotation.x = -Math.PI / 2;
            roadH.position.set(0, 0.1, i * 40);
            roadH.receiveShadow = true;
            this.scene.add(roadH);

            // Vertical roads
            const roadV = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 1000),
                roadMaterial
            );
            roadV.rotation.x = -Math.PI / 2;
            roadV.position.set(i * 40, 0.1, 0);
            roadV.receiveShadow = true;
            this.scene.add(roadV);
        }
    }

    createCityGrid() {
        const propertyTypes = [
            { name: 'Luxury Penthouse', basePrice: 500000, height: 60, color: 0x2563eb },
            { name: 'Modern Villa', basePrice: 350000, height: 20, color: 0x7c3aed },
            { name: 'Downtown Office', basePrice: 800000, height: 80, color: 0x0891b2 },
            { name: 'Cozy Apartment', basePrice: 150000, height: 30, color: 0x059669 },
            { name: 'Beach House', basePrice: 450000, height: 15, color: 0xd97706 },
            { name: 'Mountain Cabin', basePrice: 200000, height: 12, color: 0x7f1d1d },
            { name: 'Sky Tower Suite', basePrice: 1000000, height: 100, color: 0x4f46e5 },
            { name: 'Garden Estate', basePrice: 600000, height: 25, color: 0x15803d }
        ];

        const positions = [];
        for (let x = -4; x <= 4; x++) {
            for (let z = -4; z <= 4; z++) {
                if (x === 0 || z === 0) continue; // Skip center roads
                positions.push({ x: x * 40, z: z * 40 });
            }
        }

        // Shuffle positions
        positions.sort(() => Math.random() - 0.5);

        positions.slice(0, 30).forEach((pos, index) => {
            const type = propertyTypes[index % propertyTypes.length];
            const variation = 0.8 + Math.random() * 0.4;
            const price = Math.floor(type.basePrice * variation);
            const height = type.height * (0.9 + Math.random() * 0.2);

            const building = this.createBuilding(height, type.color);
            building.position.set(pos.x, height / 2, pos.z);
            this.scene.add(building);

            const property = {
                id: `prop_${index}`,
                name: `${type.name} #${index + 1}`,
                type: type.name,
                price: price,
                location: `${Math.abs(pos.x)}${pos.x >= 0 ? 'E' : 'W'}, ${Math.abs(pos.z)}${pos.z >= 0 ? 'N' : 'S'}`,
                owner: null,
                building: building,
                position: pos,
                features: this.generateFeatures(type.name, price)
            };

            this.properties.push(property);
        });
    }

    generateFeatures(typeName, price) {
        const features = [];
        const sqft = Math.floor(1000 + (price / 1000));
        features.push(`${sqft.toLocaleString()} sq ft`);

        if (price > 400000) features.push('Smart Home System');
        if (price > 600000) features.push('Private Pool');
        if (price > 300000) features.push('Panoramic Views');
        if (typeName.includes('Penthouse') || typeName.includes('Tower')) {
            features.push('Rooftop Access');
        }
        if (typeName.includes('Villa') || typeName.includes('Estate')) {
            features.push('Large Garden');
        }
        if (typeName.includes('Beach')) {
            features.push('Ocean View');
        }
        if (typeName.includes('Mountain')) {
            features.push('Mountain View');
        }

        const rooms = Math.floor(2 + (price / 200000));
        features.push(`${rooms} Bedrooms`);
        features.push(`${rooms + 1} Bathrooms`);

        return features;
    }

    createBuilding(height, color) {
        const group = new THREE.Group();

        // Main building
        const geometry = new THREE.BoxGeometry(15, height, 15);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Windows
        const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffaa,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });

        const floors = Math.floor(height / 5);
        for (let floor = 0; floor < floors; floor++) {
            for (let side = 0; side < 4; side++) {
                for (let win = 0; win < 3; win++) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    const y = -height / 2 + floor * 5 + 2;
                    const offset = (win - 1) * 4;

                    switch (side) {
                        case 0: // Front
                            window.position.set(offset, y, 7.51);
                            break;
                        case 1: // Back
                            window.position.set(offset, y, -7.51);
                            window.rotation.y = Math.PI;
                            break;
                        case 2: // Left
                            window.position.set(-7.51, y, offset);
                            window.rotation.y = Math.PI / 2;
                            break;
                        case 3: // Right
                            window.position.set(7.51, y, offset);
                            window.rotation.y = -Math.PI / 2;
                            break;
                    }
                    group.add(window);
                }
            }
        }

        // Roof detail
        const roofGeometry = new THREE.CylinderGeometry(0, 10, 5, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            roughness: 0.5
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height / 2 + 2.5;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        group.userData.clickable = true;
        return group;
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickableObjects = this.properties.map(p => p.building);
        const intersects = this.raycaster.intersectObjects(clickableObjects, true);

        // Reset all buildings
        this.properties.forEach(prop => {
            prop.building.children[0].material.emissiveIntensity = 0.1;
        });

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const building = this.properties.find(p => 
                p.building.children.includes(object) || p.building === object.parent
            );
            if (building && building.building) {
                building.building.children[0].material.emissiveIntensity = 0.3;
                document.body.style.cursor = 'pointer';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onMouseClick(event) {
        // Ignore clicks on UI elements
        if (event.target.closest('.hud') || event.target.closest('.modal')) {
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickableObjects = this.properties.map(p => p.building);
        const intersects = this.raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const property = this.properties.find(p => 
                p.building.children.includes(object) || p.building === object.parent
            );
            
            if (property) {
                this.selectProperty(property);
            }
        }
    }

    selectProperty(property) {
        this.selectedProperty = property;
        
        // Highlight selected building
        this.properties.forEach(prop => {
            prop.building.children[0].material.emissiveIntensity = 0.1;
        });
        property.building.children[0].material.emissiveIntensity = 0.5;

        // Trigger property selection event
        window.dispatchEvent(new CustomEvent('propertySelected', { detail: property }));

        // Animate camera to property
        this.animateCameraTo(property.position);
    }

    animateCameraTo(position) {
        const targetPos = new THREE.Vector3(position.x, 30, position.z + 50);
        const startPos = this.camera.position.clone();
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);

            this.camera.position.lerpVectors(startPos, targetPos, eased);
            this.camera.lookAt(position.x, 10, position.z);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate camera slightly for cinematic effect
        const time = Date.now() * 0.0001;
        this.camera.position.x += Math.sin(time) * 0.05;
        
        this.renderer.render(this.scene, this.camera);
    }

    getProperties() {
        return this.properties;
    }

    getSelectedProperty() {
        return this.selectedProperty;
    }

    updatePropertyOwner(propertyId, owner) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            property.owner = owner;
            // Change building color to indicate ownership
            if (owner) {
                property.building.children[0].material.color.setHex(0x4ade80);
                property.building.children[0].material.emissive.setHex(0x4ade80);
            }
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Export for use in main app
window.WorldEngine = WorldEngine;
