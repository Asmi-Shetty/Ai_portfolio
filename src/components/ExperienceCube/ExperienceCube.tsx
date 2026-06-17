"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./ExperienceCube.module.css";

interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  shortDesc: string;
  description: string;
  tech: string[];
  achievements: string[];
  status: string;
  theme: "Cyan" | "Emerald" | "Blue" | "Gold" | "Orange" | "Holo";
  faceClass: string;
  logo: string;
}

const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "Software AI Developer Intern",
    company: "Arithwise Solutions",
    duration: "Dec 2025 – Apr 2026",
    shortDesc: "Upgraded a full-stack AI platform integrating 4 core modules: networking, coding, learning, and assessments.",
    description: "Upgraded a full-stack AI platform integrating 4 core modules: professional networking, collaborative coding, structured learning, and gamified assessments in a single ecosystem.",
    tech: ["React.js", "Node.js", "Socket.io", "PostgreSQL", "Prisma", "Geolocation API"],
    achievements: [
      "Created Loops, a real-time social networking module supporting 1:1 messaging, user connections, and interest-based public channels for community-driven interaction.",
      "Built a geolocation-based event discovery system supporting radius-based search and location tagging for 100+ events, improving event discoverability and user participation."
    ],
    status: "COGNITION: ONLINE",
    theme: "Cyan",
    faceClass: styles.faceFront,
    logo: "🧠"
  },
  {
    id: 2,
    role: "Software Engineer Intern",
    company: "Avijo Healthcare",
    duration: "Apr 2025 – July 2025",
    shortDesc: "Refactored backend architecture and integrated ABDM-aligned health portal.",
    description: "Refactored backend architecture and integrated ABDM-aligned healthcare portal enabling registrations and facility management.",
    tech: ["Node.js", "Express", "MongoDB", "REST APIs", "ABDM SDK", "Docker"],
    achievements: [
      "Developed ABDM-aligned healthcare portal that can enable 10,000+ patient registrations and empower 1,000+ professionals.",
      "Refactored backend architecture and developed 10+ REST APIs, models, and controllers for user and facility management."
    ],
    status: "HEALTH_PORTAL: OK",
    theme: "Emerald",
    faceClass: styles.faceRight,
    logo: "🏥"
  },
  {
    id: 3,
    role: "AI Developer",
    company: "Freelancer",
    duration: "Present",
    shortDesc: "Designed smart real estate platform with interactive search and comparisons.",
    description: "A real estate platform that helps users discover, compare, and evaluate properties with personalized recommendations. Combines smart search, interactive maps, and market insights to simplify buying and renting.",
    tech: ["React.js", "Tailwind CSS", "FastAPI", "SQLAlchemy", "SQLite", "PostgreSQL"],
    achievements: [
      "Built property comparison modules and smart search tools, simplifying property buying and renting.",
      "Integrated interactive maps and market data insights for property valuation and personalized recommendations.",
      "Created owner dashboard enabling easy property listing and management for faster search experiences."
    ],
    status: "REAL_ESTATE: ACTIVE",
    theme: "Blue",
    faceClass: styles.faceBack,
    logo: "🏠"
  },
  {
    id: 4,
    role: "Co Lead",
    company: "Google Developer's Group",
    duration: "GDG on Campus",
    shortDesc: "Organized technical workshops and fostered developer community engagement.",
    description: "As Co-Lead of the Google Developer Groups (GDG) on Campus, I helped organize technical workshops, coding events, and community-building activities for students.",
    tech: ["Leadership", "Public Speaking", "Event Management", "Community Building", "Technical Workshops"],
    achievements: [
      "Collaborated with team members to drive student engagement and coordinate community-building activities.",
      "Fostered a campus culture of learning and innovation, empowering peers to explore emerging technologies."
    ],
    status: "LEADERSHIP: ACTIVE",
    theme: "Gold",
    faceClass: styles.faceLeft,
    logo: "🚀"
  }
];

interface ExperienceCubeProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const ExperienceCube = ({ sectionRef }: ExperienceCubeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cube3DRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);

  // Rotation angles (degrees)
  const rotationXRef = useRef(-15);
  const rotationYRef = useRef(45);
  const targetRotationXRef = useRef(-15);
  const targetRotationYRef = useRef(45);

  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const startRotationXRef = useRef(0);
  const startRotationYRef = useRef(0);

  const [activeModal, setActiveModal] = useState<Experience | null>(null);

  // Theme mapping to tailwind css variables or classes
  const getThemeClass = (theme: string) => {
    switch (theme) {
      case "Cyan": return styles.themeCyan;
      case "Emerald": return styles.themeEmerald;
      case "Blue": return styles.themeBlue;
      case "Gold": return styles.themeGold;
      case "Orange": return styles.themeOrange;
      default: return styles.themeHolo;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Parent group to handle matched rotation
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Core Wireframe Box
    const boxGeom = new THREE.BoxGeometry(3.6, 3.6, 3.6);
    const edges = new THREE.EdgesGeometry(boxGeom);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.15
    });
    const wireframe = new THREE.LineSegments(edges, wireMaterial);
    coreGroup.add(wireframe);

    // 2. Glowing Gyro Rings
    const rings: THREE.Line[] = [];
    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.45 }),
      new THREE.LineBasicMaterial({ color: 0x05ffc4, transparent: true, opacity: 0.45 }),
      new THREE.LineBasicMaterial({ color: 0xffb450, transparent: true, opacity: 0.35 })
    ];

    for (let i = 0; i < 3; i++) {
      const points: THREE.Vector3[] = [];
      const radius = 2.4 - i * 0.4;
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.Line(ringGeom, ringMaterials[i]);
      if (i === 1) ring.rotation.x = Math.PI / 2;
      if (i === 2) ring.rotation.y = Math.PI / 2;
      coreGroup.add(ring);
      rings.push(ring);
    }

    // 3. Neural Node Particles
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 3.2;
      const y = (Math.random() - 0.5) * 3.2;
      const z = (Math.random() - 0.5) * 3.2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const vec = new THREE.Vector3(x, y, z);
      nodes.push(vec);

      particleVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008
      ));
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.09,
      transparent: true,
      opacity: 0.85
    });

    const pointsObj = new THREE.Points(particleGeom, particleMat);
    coreGroup.add(pointsObj);

    // 4. Connecting Synapse Lines (Dynamic)
    const maxConnections = 150;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0070f3,
      transparent: true,
      opacity: 0.22
    });
    const lineSegments = new THREE.LineSegments(lineGeom, lineMat);
    coreGroup.add(lineSegments);

    // 5. Laser Scanning Plane
    const gridHelper = new THREE.GridHelper(3.5, 12, 0x05ffc4, 0x05ffc4);
    // Cast material to LineBasicMaterial to tweak transparency
    (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
    (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.2;
    coreGroup.add(gridHelper);

    // 6. Ambient Stars (Outer Dust)
    const dustCount = 180;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.25
    });
    const dustSwarm = new THREE.Points(dustGeom, dustMat);
    scene.add(dustSwarm);

    // Resize Handler
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // 1. Slow automatic rotation when idle
      if (!isDraggingRef.current) {
        if (!isHoveringRef.current) {
          targetRotationYRef.current += 0.08;
        } else {
          // Slow down drastically on hover
          targetRotationYRef.current += 0.015;
        }
      }

      // 2. Physics Easing (Lerp)
      rotationXRef.current += (targetRotationXRef.current - rotationXRef.current) * 0.06;
      rotationYRef.current += (targetRotationYRef.current - rotationYRef.current) * 0.06;

      // 3. Apply rotation to Three.js Group (converting deg to rad)
      coreGroup.rotation.x = rotationXRef.current * (Math.PI / 180);
      coreGroup.rotation.y = rotationYRef.current * (Math.PI / 180);

      // 4. Synchronize CSS 3D DOM Cube rotation
      if (cube3DRef.current) {
        cube3DRef.current.style.transform = `rotateX(${rotationXRef.current}deg) rotateY(${rotationYRef.current}deg)`;
      }

      // 5. Animate Gyro rings
      rings[0].rotation.z = elapsed * 0.2;
      rings[1].rotation.y = elapsed * 0.25;
      rings[2].rotation.x = elapsed * 0.15;

      // 6. Laser scanner sweep
      gridHelper.position.y = Math.sin(elapsed * 1.5) * 1.8;

      // 7. Update Neural Nodes
      const positionsArr = pointsObj.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Move particle
        nodes[i].x += particleVelocities[i].x;
        nodes[i].y += particleVelocities[i].y;
        nodes[i].z += particleVelocities[i].z;

        // Bounce boundaries
        const bound = 1.75;
        if (Math.abs(nodes[i].x) > bound) { particleVelocities[i].x *= -1; nodes[i].x = Math.sign(nodes[i].x) * bound; }
        if (Math.abs(nodes[i].y) > bound) { particleVelocities[i].y *= -1; nodes[i].y = Math.sign(nodes[i].y) * bound; }
        if (Math.abs(nodes[i].z) > bound) { particleVelocities[i].z *= -1; nodes[i].z = Math.sign(nodes[i].z) * bound; }

        positionsArr[i * 3] = nodes[i].x;
        positionsArr[i * 3 + 1] = nodes[i].y;
        positionsArr[i * 3 + 2] = nodes[i].z;
      }
      pointsObj.geometry.attributes.position.needsUpdate = true;

      // 8. Dynamic connections geometry update
      let lineIndex = 0;
      const linePosArr = lineSegments.geometry.attributes.position.array as Float32Array;

      // Clear positions
      linePosArr.fill(0);

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dist = nodes[i].distanceTo(nodes[j]);
          if (dist < 1.15 && lineIndex < maxConnections) {
            // Node A
            linePosArr[lineIndex * 6] = nodes[i].x;
            linePosArr[lineIndex * 6 + 1] = nodes[i].y;
            linePosArr[lineIndex * 6 + 2] = nodes[i].z;
            // Node B
            linePosArr[lineIndex * 6 + 3] = nodes[j].x;
            linePosArr[lineIndex * 6 + 4] = nodes[j].y;
            linePosArr[lineIndex * 6 + 5] = nodes[j].z;

            lineIndex++;
          }
        }
      }
      lineSegments.geometry.attributes.position.needsUpdate = true;

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

  // --- Drag Interactions ---
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    startRotationXRef.current = targetRotationXRef.current;
    startRotationYRef.current = targetRotationYRef.current;

    // Set pointer capture to support dragging off-element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) {
      // Mouse move perspective shift (subtle parallax)
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

      // Tilt camera targets slightly based on hover coords
      targetRotationXRef.current = -15 - relativeY * 20;
      // Allow slow auto-rotation to slide, but let mouse influence it slightly
      return;
    }

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    // Adjust factor for speed of drag
    targetRotationYRef.current = startRotationYRef.current + deltaX * 0.35;
    const newTargetX = startRotationXRef.current - deltaY * 0.35;

    // Limit X axis rotation so the user cannot flip it entirely upside down
    targetRotationXRef.current = Math.max(-65, Math.min(65, newTargetX));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div ref={sectionRef} className={styles.experienceSection} id="experience">
      <div className={styles.cubeWrapper}>

        {/* WebGL Hologram Core */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        {/* HUD UI Header */}
        <div className={styles.hudOverlay}>
          <h2 className={`${styles.hudTitle} spotlight-text`}>My Experiences</h2>
        </div>

        {/* 3D Scene viewport */}
        <div
          className={styles.scene3D}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={cube3DRef}
            className={styles.cube3D}
          >
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.id}
                className={`${styles.cubeFace} ${exp.faceClass} ${getThemeClass(exp.theme)}`}
                onMouseEnter={() => { isHoveringRef.current = true; }}
                onMouseLeave={() => { isHoveringRef.current = false; }}
                onClick={() => setActiveModal(exp)}
                style={{ cursor: "pointer" }}
                data-cursor="hover"
              >
                {/* Visual accents */}
                <div className={styles.scannerLine} />
                <div className={styles.faceGrid} />

                {/* Card Top */}
                <div className={styles.cardTop}>
                  <div className={styles.logoContainer}>
                    {exp.logo}
                  </div>
                  <span className={`${styles.statusIndicator} ${styles.indicatorActive}`}>
                    {exp.status}
                  </span>
                </div>

                {/* Card Mid */}
                <div className={styles.cardMid}>
                  <h3 className={styles.roleTitle}>{exp.role}</h3>
                  <div className={styles.companyRow}>
                    <span className={styles.companyName}>{exp.company}</span>
                    <span className={styles.duration}>{exp.duration}</span>
                  </div>
                  <p className={styles.description}>
                    "{exp.shortDesc}"
                  </p>
                </div>

                {/* Card Bottom */}
                <div className={styles.cardBottom}>
                  <div className={styles.techContainer}>
                    {exp.tech.slice(0, 4).map((techName, index) => (
                      <span className={styles.techPill} key={index}>
                        {techName}
                      </span>
                    ))}
                    {exp.tech.length > 4 && (
                      <span className={styles.techPill}>
                        +{exp.tech.length - 4}
                      </span>
                    )}
                  </div>

                  <MagneticWrapper strength={0.35}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModal(exp);
                      }}
                    >
                      Load Diagnostics
                    </button>
                  </MagneticWrapper>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Drag visual tip */}
        <div className={styles.dragTip}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          Drag to Rotate Cube
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </div>

      </div>

      {/* Immersive Diagnostics Modal Overlay */}
      {activeModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModal(null)}
        >
          <div
            className={`${styles.modalContent} ${getThemeClass(activeModal.theme)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrapper}>
                <h3 className={styles.modalTitle}>{activeModal.role}</h3>
                <span className={styles.modalSubtitle}>
                  {activeModal.company} — {activeModal.duration}
                </span>
              </div>
              <MagneticWrapper strength={0.4}>
                <button
                  className={styles.closeButton}
                  onClick={() => setActiveModal(null)}
                >
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </MagneticWrapper>
            </div>

            <div className={styles.modalBody}>

              <div>
                <span className={styles.modalSectionTitle}>OPERATIONAL DESCRIPTION</span>
                <p className={styles.description} style={{ fontSize: "14px", marginTop: "6px" }}>
                  {activeModal.description}
                </p>
              </div>

              <div>
                <span className={styles.modalSectionTitle}>KEY ACCOMPLISHMENTS</span>
                <div className={styles.achievementsList}>
                  {activeModal.achievements.map((ach, idx) => (
                    <div className={styles.achievementItem} key={idx}>
                      <div className={styles.bulletDot} />
                      <p className={styles.achievementText}>{ach}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className={styles.modalSectionTitle}>STACK ARCHITECTURE</span>
                <div className={styles.techContainer} style={{ marginTop: "6px", gap: "8px" }}>
                  {activeModal.tech.map((techName, idx) => (
                    <span
                      className={styles.techPill}
                      key={idx}
                      style={{ fontSize: "11px", padding: "5px 12px", background: "rgba(255,255,255,0.05)" }}
                    >
                      {techName}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExperienceCube;
