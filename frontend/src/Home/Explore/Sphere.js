import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { getFresnelMat } from "./getFresnelMat.js";
import Small,  { coinData } from "./SmallTable.js";


const Ratio = window.innerWidth * 2.56;

const Sphere = () => {
  const [selectedDot, setSelectedDot] = useState(null);

  useEffect(() => {
    const container = document.getElementById("earth-container");
    if (!container) {
      console.error("'sphere-container' not found in the DOM.");
      return;
    }
    const w = container?.clientWidth || window.innerWidth;
    const h = container?.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    if (Ratio / w < 2.5) {
      camera.position.z = 2.5;
    } else {
      camera.position.z = Ratio / w;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);

    container.appendChild(renderer.domElement);

    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/textures/00_earthmap1k.jpg"),
      specularMap: loader.load("/textures/02_earthspec1k.jpg"),
      bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
      bumpScale: 0.04,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const dotMeshArray = [];
    const dotInitialPositions = [];
    const dotGroup = new THREE.Group();
    scene.add(dotGroup);

    for (let i = 0; i < 6; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      

      const icon = coinData[i].icon;
      const iconTexture = loader.load(icon);
      const iconMaterial = new THREE.SpriteMaterial({ map: iconTexture });
      const iconSprite = new THREE.Sprite(iconMaterial);
      iconSprite.scale.set(0.2, 0.2, 0.2);
      iconSprite.position.set(x * 1.1, y * 1.1, z * 1.1);

      dotMeshArray.push(iconSprite);
      iconSprite.userData = { 
        coinIndex: i,  
        x, y, z 
      };
      dotInitialPositions.push({ theta, phi });
      dotGroup.add(iconSprite);
    }

    const raycaster = new THREE.Raycaster();

    function onMouseClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(dotMeshArray, false);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData;
        setSelectedDot(selected);
      }
    }

    window.addEventListener("click", onMouseClick, false);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/textures/03_earthlights1k.jpg"),
      blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load("/textures/04_earthcloudmap.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load("/textures/05_earthcloudmaptrans.jpg"),
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    function animate() {
      requestAnimationFrame(animate);

      dotGroup.rotation.y += 0.002;
      dotGroup.rotation.x += 0.0005;
      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      cloudsMesh.rotation.y += 0.0023;
      glowMesh.rotation.y += 0.002;

      dotMeshArray.forEach((dot, i) => {
        const { theta, phi } = dotInitialPositions[i];
        const currentTheta = theta + earthGroup.rotation.y;
        const x = Math.sin(phi) * Math.cos(currentTheta);
        const y = Math.sin(phi) * Math.sin(currentTheta);
        const z = Math.cos(phi);

        dot.position.set(x * 1.1, y * 1.1, z * 1.1);
        dot.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    }

    animate();

    function handleWindowResize() {
      const w = container?.clientWidth || window.innerWidth;
      const h = container?.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = Ratio / w < 2.5 ? 2.5 : Ratio / w;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      renderer.dispose();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("click", onMouseClick);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id="earth-container" className="sphere-container">
      <Small dotData={selectedDot} onClose={() => setSelectedDot(null)} />
    </div>
  );
};

export default Sphere;
