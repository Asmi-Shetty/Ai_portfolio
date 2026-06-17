"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./TechUniverse.module.css";

interface TechItem {
  name: string;
  category: "frontend" | "backend" | "ai" | "blockchain" | "devops";
  level: number; // 0 - 100
  status: string;
  description: string;
  accent: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "React", category: "frontend", level: 95, status: "Core Stack", description: "Building highly interactive, component-driven interfaces and WebGL layers.", accent: "#00f2fe" },
  { name: "Next.js", category: "frontend", level: 92, status: "Core Stack", description: "Server-side rendering, static site generation, and optimized web apps.", accent: "#ffb450" },
  { name: "TypeScript", category: "frontend", level: 90, status: "Core Stack", description: "Enforcing type safety, strict compile checks, and robust software architectures.", accent: "#0070f3" },
  { name: "JavaScript", category: "frontend", level: 95, status: "Fluent", description: "The foundation of browser-side scripting and modern web applications.", accent: "#ffdf00" },
  { name: "Tailwind", category: "frontend", level: 95, status: "Core Stack", description: "Rapid styling with utility-first CSS structures and design tokens.", accent: "#38bdf8" },
  { name: "Node.js", category: "backend", level: 90, status: "Core Stack", description: "Asynchronous backend microservices and server-side script daemons.", accent: "#05ffc4" },
  { name: "Express", category: "backend", level: 92, status: "Fluent", description: "Lightweight routing and rest API payload controllers.", accent: "#828282" },
  { name: "MongoDB", category: "backend", level: 85, status: "Integrated", description: "Scalable document-oriented datastores for caching user stats.", accent: "#13aa52" },
  { name: "PostgreSQL", category: "backend", level: 88, status: "Fluent", description: "Relational structured data databases with transaction-safe ACID records.", accent: "#336791" },
  { name: "Python", category: "ai", level: 95, status: "Core Stack", description: "Primary environment for neural networking, mathematical scripts, and AI agents.", accent: "#3776ab" },
  { name: "FastAPI", category: "ai", level: 90, status: "Core Stack", description: "Async high-speed server APIs for exposing AI inference engines.", accent: "#009688" },
  { name: "OpenAI API", category: "ai", level: 95, status: "Core Stack", description: "Leveraging large language models for real-time cognitive reasoning.", accent: "#ff6b00" },
  { name: "LangChain", category: "ai", level: 92, status: "Core Stack", description: "Chaining prompt logic, retrieval buffers, and tool-calling wrappers.", accent: "#00a3e0" },
  { name: "CrewAI", category: "ai", level: 88, status: "Integrated", description: "Orchestrating autonomous multi-agent task-oriented swarms.", accent: "#f5893a" },
  { name: "n8n", category: "ai", level: 85, status: "Integrated", description: "Automating visual backend workflows and webhooks integrations.", accent: "#f15a24" },
  { name: "Docker", category: "devops", level: 85, status: "Integrated", description: "Containerizing software runtimes to guarantee execution consistency.", accent: "#2496ed" },
  { name: "Git", category: "devops", level: 95, status: "Fluent", description: "Distributed version control system managing repository revisions.", accent: "#f1502f" },
  { name: "GitHub", category: "devops", level: 95, status: "Core Stack", description: "Collaborative repository version control and CI/CD pipelines.", accent: "#ffffff" },
  { name: "Solidity", category: "blockchain", level: 90, status: "Core Stack", description: "Writing gas-optimized, audited smart contracts on EVM networks.", accent: "#e8652a" },
  { name: "Ethereum", category: "blockchain", level: 88, status: "Core Stack", description: "Decentralized consensus virtual machine hosting yield and tokens.", accent: "#3c3c3d" },
  { name: "Web3.js", category: "blockchain", level: 90, status: "Fluent", description: "Interfacing frontend clients with blockchain node states and RPC layers.", accent: "#f16822" },
  { name: "Firebase", category: "devops", level: 85, status: "Integrated", description: "Real-time key-value sync datastores and serverless auth systems.", accent: "#ffca28" }
];

// 22 Pre-calculated home coordinates distributed evenly in 3D space
const HOME_COORDS = [
  { x: -3.2, y: 1.6, z: 0.2 }, { x: -1.9, y: 1.8, z: -0.5 }, { x: -0.6, y: 1.5, z: 0.4 }, { x: 0.7, y: 1.7, z: -0.2 }, { x: 2.0, y: 1.9, z: 0.5 }, { x: 3.2, y: 1.6, z: -0.4 },
  { x: -2.5, y: 0.6, z: -0.3 }, { x: -1.3, y: 0.8, z: 0.3 }, { x: 0.0, y: 0.5, z: -0.6 }, { x: 1.3, y: 0.7, z: 0.2 }, { x: 2.5, y: 0.6, z: -0.5 },
  { x: -3.0, y: -0.4, z: 0.4 }, { x: -1.6, y: -0.6, z: -0.2 }, { x: -0.2, y: -0.5, z: 0.5 }, { x: 1.1, y: -0.4, z: -0.4 }, { x: 2.3, y: -0.6, z: 0.3 }, { x: 3.2, y: -0.5, z: -0.6 },
  { x: -2.1, y: -1.5, z: -0.5 }, { x: -0.9, y: -1.8, z: 0.4 }, { x: 0.3, y: -1.6, z: -0.2 }, { x: 1.5, y: -1.7, z: 0.5 }, { x: 2.7, y: -1.5, z: -0.4 }
];

interface SpherePhysics {
  item: TechItem;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  home: THREE.Vector3;
  radius: number;
  mass: number;
  mesh: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
  hoverFactor: number;
  phase: number;
}

const TechUniverse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionRef = useRef<HTMLDivElement>(null);
  
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  // Keep mouse in 3D coordinates tracked
  const mouse3DRef = useRef<THREE.Vector3>(new THREE.Vector3(-9999, -9999, 0));
  const normalizedMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-9999, -9999));
  const hoveredIndexRef = useRef<number | null>(null);

  // Callback to force dynamic highlight update inside the render loop
  const selectedTechCategoryRef = useRef<string | null>(null);

  const isDraggingSphereRef = useRef(false);
  const draggedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    selectedTechCategoryRef.current = selectedTech ? selectedTech.category : null;
  }, [selectedTech]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Three.js setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 7.0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // --- Lights ---
    // High ambient light to make them bright white
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight1.position.set(6, 6, 6);
    scene.add(directionalLight1);

    // Dynamic point light following the cursor (bright orange glow reflection)
    const cursorLight = new THREE.PointLight(0xe8652a, 4.0, 10);
    cursorLight.position.set(-9999, -9999, 2);
    scene.add(cursorLight);

    // Rim lighting (Directional from behind to highlight sphere edges)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-6, -6, -6);
    scene.add(rimLight);

    // --- Create Swarm of Spheres ---
    const spheres: SpherePhysics[] = [];
    const meshes: THREE.Mesh[] = [];

    // Scale layout coordinates dynamically on mobile
    const getMobileScale = () => {
      if (window.innerWidth < 480) return 0.52;
      if (window.innerWidth < 768) return 0.7;
      return 1.0;
    };
    let mobileScale = getMobileScale();

    // Helper to generate dynamic texture for sphere wrapping
    const generateTexture = (name: string, category: string) => {
      const size = 512;
      const canvasTex = document.createElement("canvas");
      canvasTex.width = size;
      canvasTex.height = size;
      const ctx = canvasTex.getContext("2d");
      if (ctx) {
        // Bright white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        if (name === "React") {
          // React Blue Logo (scaled down)
          ctx.strokeStyle = "#00d8ff";
          ctx.lineWidth = 10;
          
          const drawEllipse = (angle: number) => {
            ctx.save();
            ctx.translate(size / 2, size / 2 - 20);
            ctx.rotate(angle);
            ctx.scale(1, 0.36);
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          };
          drawEllipse(0);
          drawEllipse(Math.PI / 3);
          drawEllipse(-Math.PI / 3);
          
          ctx.fillStyle = "#00d8ff";
          ctx.beginPath();
          ctx.arc(size / 2, size / 2 - 20, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#00d8ff";
          ctx.font = "bold 44px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("React", size / 2, size / 2 + 130);
        }
        else if (name === "JavaScript") {
          // JS Yellow square (scaled down)
          ctx.fillStyle = "#f7df1e";
          ctx.fillRect(156, 136, 200, 200);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 80px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("JS", 346, 326);
          
          ctx.fillStyle = "#111111";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("JavaScript", size / 2, size / 2 + 130);
        }
        else if (name === "TypeScript") {
          // TS Blue square (scaled down)
          ctx.fillStyle = "#3178c6";
          ctx.fillRect(156, 136, 200, 200);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 72px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("TS", 346, 326);

          ctx.fillStyle = "#3178c6";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TypeScript", size / 2, size / 2 + 130);
        }
        else if (name === "MongoDB") {
          // MongoDB Leaf (scaled down)
          ctx.fillStyle = "#13aa52";
          ctx.beginPath();
          ctx.moveTo(256, 130);
          ctx.quadraticCurveTo(300, 210, 256, 310);
          ctx.quadraticCurveTo(212, 210, 256, 130);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(256, 145);
          ctx.lineTo(256, 295);
          ctx.stroke();

          ctx.fillStyle = "#13aa52";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("MongoDB", 256, 375);
        }
        else if (name === "Python") {
          // Python snakes (scaled down)
          ctx.fillStyle = "#3776ab";
          ctx.beginPath();
          ctx.arc(230, 210, 45, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = "#ffd343";
          ctx.beginPath();
          ctx.arc(282, 262, 45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#111111";
          ctx.font = "bold 38px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Python", 256, 360);
        }
        else if (name === "OpenAI API") {
          // OpenAI spiral (scaled down)
          ctx.strokeStyle = "#10a37f";
          ctx.lineWidth = 8;
          for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.translate(256, 220);
            ctx.rotate((i * Math.PI) / 3);
            ctx.beginPath();
            ctx.arc(0, -32, 35, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
          ctx.fillStyle = "#10a37f";
          ctx.font = "bold 34px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("OpenAI", 256, 340);
        }
        else {
          // Standard Clean Luxury Branding (with smaller font size)
          ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - 40, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#111111";
          ctx.font = name.length > 8 ? "bold 38px sans-serif" : "bold 46px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(name, size / 2, size / 2);
        }
      }
      const texture = new THREE.CanvasTexture(canvasTex);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    TECH_ITEMS.forEach((item, index) => {
      // Core techs are larger
      const isCore = ["React", "Next.js", "TypeScript", "Python", "OpenAI API", "Solidity"].includes(item.name);
      const radius = (isCore ? 0.5 : 0.38) * mobileScale;

      const geom = new THREE.SphereGeometry(radius, 32, 32);

      const texture = generateTexture(item.name, item.category);

      const mat = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.05,
        metalness: 0.02,
        transmission: 0.0, // Opaque bright white
        thickness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        transparent: false
      });

      const mesh = new THREE.Mesh(geom, mat);
      
      // Predefined home coordinates scaled down tightly to clump in the center
      const home = new THREE.Vector3(
        HOME_COORDS[index].x * 0.16 * mobileScale,
        HOME_COORDS[index].y * 0.16 * mobileScale,
        HOME_COORDS[index].z * 0.16 * mobileScale
      );

      const initialPos = new THREE.Vector3(
        home.x + (Math.random() - 0.5) * 0.5,
        home.y + (Math.random() - 0.5) * 0.5,
        home.z + (Math.random() - 0.5) * 0.5
      );

      mesh.position.copy(initialPos);
      mesh.rotation.y = -Math.PI / 2; // Face texture center to the camera
      mesh.userData = { index };
      scene.add(mesh);
      meshes.push(mesh);

      spheres.push({
        item,
        position: initialPos,
        velocity: new THREE.Vector3(0, 0, 0),
        home,
        radius,
        mass: radius * radius * radius * 10,
        mesh,
        material: mat,
        hoverFactor: 0,
        phase: Math.random() * Math.PI * 2
      });
    });

    // Raycaster for checking mouse hovers
    const raycaster = new THREE.Raycaster();

    // Resize Handler
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Re-adjust mobile scaling on resize
      mobileScale = getMobileScale();
      spheres.forEach((sphere, index) => {
        sphere.home.set(
          HOME_COORDS[index].x * 0.16 * mobileScale,
          HOME_COORDS[index].y * 0.16 * mobileScale,
          HOME_COORDS[index].z * 0.16 * mobileScale
        );
        const isCore = ["React", "Next.js", "TypeScript", "Python", "OpenAI API", "Solidity"].includes(sphere.item.name);
        sphere.radius = (isCore ? 0.5 : 0.38) * mobileScale;
        sphere.mesh.geometry.dispose();
        sphere.mesh.geometry = new THREE.SphereGeometry(sphere.radius, 32, 32);
      });
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // 1. Raycast for hovers
      raycaster.setFromCamera(normalizedMouseRef.current, camera);
      const intersects = raycaster.intersectObjects(meshes);

      let hoveredIdx: number | null = null;
      if (intersects.length > 0) {
        hoveredIdx = intersects[0].object.userData.index;
      }
      hoveredIndexRef.current = hoveredIdx;

      // 2. Locate cursor 3D position at plane depth (z = 0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const mouse3D = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, mouse3D);
      mouse3DRef.current.copy(mouse3D);

      // Interpolate cursor point light position
      if (hoveredIdx !== null) {
        cursorLight.position.lerp(mouse3D, 0.15);
      } else {
        cursorLight.position.lerp(new THREE.Vector3(-9999, -9999, 2), 0.1);
      }

      // Category highlighting multiplier check
      const currentCategory = selectedTechCategoryRef.current;

      // 3. Physics Simulation
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        const isHovered = i === hoveredIdx;
        const isDragged = i === draggedIndexRef.current;

        if (isDragged) {
          // Follow the cursor and calculate drag throw velocity
          const prevPos = s.position.clone();
          
          s.position.x = mouse3DRef.current.x;
          s.position.y = mouse3DRef.current.y;
          s.position.z += (0.0 - s.position.z) * 0.15; // lerp drag plane depth to center z

          s.velocity.subVectors(s.position, prevPos);
          s.velocity.clampLength(0.0, 0.95); // clamp max throw velocity for high-speed throwing

          s.mesh.position.copy(s.position);

          // Keep scale and opacity high
          s.hoverFactor += (1.0 - s.hoverFactor) * 0.15;
          s.mesh.scale.setScalar(1.0 + s.hoverFactor * 0.15);
          s.material.opacity += (1.0 - s.material.opacity) * 0.1;
          continue;
        }

        // Hover interpolation
        s.hoverFactor += ((isHovered ? 1.0 : 0.0) - s.hoverFactor) * 0.15;

        // Mesh scale animation based on hover status
        const currentScale = 1.0 + s.hoverFactor * 0.15;
        s.mesh.scale.setScalar(currentScale);

        // Mesh opacity/highlight logic
        if (currentCategory) {
          // Dim other categories, keep selected category bright
          const match = s.item.category === currentCategory;
          const targetOpacity = match ? 1.0 : 0.18;
          s.material.opacity += (targetOpacity - s.material.opacity) * 0.1;
        } else {
          s.material.opacity += (1.0 - s.material.opacity) * 0.1;
        }

        // Target calculation (Idle drift)
        const driftX = Math.sin(elapsed * 0.6 + s.phase) * 0.04 * mobileScale;
        const driftY = Math.cos(elapsed * 0.5 + s.phase) * 0.04 * mobileScale;
        const target = s.home.clone().add(new THREE.Vector3(driftX, driftY, 0));

        // Spring force towards home (extremely gentle to allow free flight)
        const springForce = new THREE.Vector3().subVectors(target, s.position);
        springForce.multiplyScalar(0.0018);
        s.velocity.add(springForce);

        // Constant micro-jitter to keep them flying and jumping in active Brownian motion
        s.velocity.x += (Math.random() - 0.5) * 0.007;
        s.velocity.y += (Math.random() - 0.5) * 0.007;
        s.velocity.z += (Math.random() - 0.5) * 0.004;

        // Apply velocity & Damping friction
        s.position.add(s.velocity);
        
        // High conservation (0.985) when far to fly freely,
        // and gentle conservation (0.968) when at home to remain loose, jumping, and fluid.
        const distToHome = s.position.distanceTo(target);
        const damping = THREE.MathUtils.lerp(0.968, 0.985, THREE.MathUtils.clamp((distToHome - 0.5) / 1.5, 0.0, 1.0));
        s.velocity.multiplyScalar(damping);
        
        s.mesh.position.copy(s.position);
      }

      // 4. Elastic Sphere-to-Sphere Collisions
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const s1 = spheres[i];
          const s2 = spheres[j];

          const distVec = new THREE.Vector3().subVectors(s2.position, s1.position);
          const dist = distVec.length();

          // Combined radii + a tiny collision margin
          const minDist = s1.radius + s2.radius + 0.05 * mobileScale;

          if (dist < minDist) {
            const normal = distVec.clone().normalize();
            const overlap = minDist - dist;

            const isDragged1 = i === draggedIndexRef.current;
            const isDragged2 = j === draggedIndexRef.current;

            // 1. Instantly separate spheres along normal based on their relative mass to resolve overlaps
            if (isDragged1 && !isDragged2) {
              s2.position.add(normal.clone().multiplyScalar(overlap));
              s2.velocity.add(normal.clone().multiplyScalar(overlap * 0.4)); // push velocity impulse
            } else if (isDragged2 && !isDragged1) {
              s1.position.sub(normal.clone().multiplyScalar(overlap));
              s1.velocity.sub(normal.clone().multiplyScalar(overlap * 0.4));
            } else if (!isDragged1 && !isDragged2) {
              const totalMass = s1.mass + s2.mass;
              s1.position.sub(normal.clone().multiplyScalar(overlap * (s2.mass / totalMass)));
              s2.position.add(normal.clone().multiplyScalar(overlap * (s1.mass / totalMass)));
            }

            // 2. Elastic bounce impulse calculation
            if (!isDragged1 && !isDragged2) {
              const relVelocity = new THREE.Vector3().subVectors(s2.velocity, s1.velocity);
              const velAlongNormal = relVelocity.dot(normal);

              if (velAlongNormal < 0) {
                const bounciness = 0.55; // Lively bounciness to transfer energy, causing others to jump and fly
                const impulseScalar = -(1 + bounciness) * velAlongNormal / (1 / s1.mass + 1 / s2.mass);

                // Apply velocity impulse
                s1.velocity.sub(normal.clone().multiplyScalar(impulseScalar / s1.mass));
                s2.velocity.add(normal.clone().multiplyScalar(impulseScalar / s2.mass));
              }
            } else {
              // Transfer drag velocity impulse to free balls on contact
              if (isDragged1 && !isDragged2) {
                s2.velocity.add(normal.clone().multiplyScalar(s1.velocity.length() * 0.8));
              } else if (isDragged2 && !isDragged1) {
                s1.velocity.sub(normal.clone().multiplyScalar(s2.velocity.length() * 0.8));
              }
            }
          }
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // --- Interaction Layer Event Handlers ---
  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Convert to normalized coordinates [-1, 1] for Three.js camera projection
    normalizedMouseRef.current.x = x * 2 - 1;
    normalizedMouseRef.current.y = -y * 2 + 1;
  };

  const handleMouseLeave = () => {
    if (isDraggingSphereRef.current) return;
    // Put cursor offscreen when mouse leaves canvas viewport
    normalizedMouseRef.current.set(-9999, -9999);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const idx = hoveredIndexRef.current;
    if (idx !== null) {
      isDraggingSphereRef.current = true;
      draggedIndexRef.current = idx;
      setSelectedTech(TECH_ITEMS[idx]);
      
      // Lock pointer capture
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      setSelectedTech(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingSphereRef.current = false;
    draggedIndexRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if pointer capture was already released or not supported
    }

    // Reset mouse coordinates if the pointer is actually outside the wrapper boundaries
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      normalizedMouseRef.current.set(-9999, -9999);
    }
  };

  return (
    <section className={styles.techSection} id="tech-stack">
      
      {/* Dynamic WebGL Canvas */}
      <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>



      {/* Floating Header */}
      <div className={styles.hudHeader}>
        <span className={styles.subtitle}>TECHNOLOGY SWARM</span>
        <h2 className={`${styles.title} spotlight-text`}>My Tech Stack</h2>
      </div>

      {/* Capture clicks and cursor movements */}
      <div 
        ref={interactionRef}
        className={styles.interactionWrapper}
        onPointerMove={handlePointerMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Detail HUD Overlay */}
      {selectedTech && (
        <div 
          className={styles.detailOverlay}
          style={{ "--orange-glow": `rgba(232, 101, 42, ${selectedTech.level * 0.005})` } as React.CSSProperties}
        >
          <div className={styles.detailHeader}>
            <h3 className={styles.detailTitle}>{selectedTech.name}</h3>
            <span className={styles.detailStatus}>{selectedTech.status}</span>
          </div>

          <div className={styles.detailLevelRow}>
            <div className={styles.detailLevelLabel}>
              EXPERTISE RATIO: {selectedTech.level}%
            </div>
            <div className={styles.progressBarOuter}>
              <div 
                className={styles.progressBarInner}
                style={{ width: `${selectedTech.level}%` }}
              />
            </div>
          </div>

          <p className={styles.detailDesc}>
            "{selectedTech.description}"
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
            <MagneticWrapper strength={0.4}>
              <button 
                className={styles.closeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTech(null);
                }}
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </MagneticWrapper>
          </div>
        </div>
      )}

      {/* Scroll Navigation visual aid */}
      {!selectedTech && (
        <div className={styles.navTip}>
          Hover and click nodes to open telemetry diagnostics
        </div>
      )}

    </section>
  );
};

export default TechUniverse;
