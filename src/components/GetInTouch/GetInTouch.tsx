"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./GetInTouch.module.css";

export const GetInTouch: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);

  // 1. Twinkling Stars Background Animation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = starCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let W = (canvas.width = window.innerWidth + 60);
    let H = (canvas.height = window.innerHeight + 60);

    const handleResize = () => {
      W = canvas.width = window.innerWidth + 60;
      H = canvas.height = window.innerHeight + 60;
    };
    window.addEventListener("resize", handleResize);

    // Mouse Move Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX / window.innerWidth - 0.5) * -20;
      const offsetY = (e.clientY / window.innerHeight - 0.5) * -20;
      canvas.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Star Class
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      phase: number;
    }

    const stars: Star[] = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    const animateStars = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentOpacity = star.opacity * (0.45 + Math.sin(star.phase) * 0.45);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(animateStars);
    };

    animateStars();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 2. Interactive WebGL Three.js Globe & Floating Ribbons
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = globeCanvasRef.current;
    const container = globeContainerRef.current;
    if (!canvas || !container) return;

    // A. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6.8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Parent group to handle matched rotation and mouse inertia
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // B. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7c3aed, 2.5);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // C. Procedural Earth Continent & City Lights Texture Generation
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = 1024;
    mapCanvas.height = 512;
    const mapCtx = mapCanvas.getContext("2d");
    if (mapCtx) {
      // Background (Oceans) - Solid glossy dark space tone
      mapCtx.fillStyle = "#010008";
      mapCtx.fillRect(0, 0, 1024, 512);

      // Continent base (Dark navy)
      mapCtx.fillStyle = "#090526";
      mapCtx.strokeStyle = "rgba(139, 92, 246, 0.4)"; // Subtle neon continent borders
      mapCtx.lineWidth = 1.5;

      const continentsData: number[][][] = [
        // North America
        [
          [-168, 65], [-160, 70], [-140, 70], [-120, 75], [-90, 75], [-70, 70],
          [-60, 60], [-80, 50], [-70, 45], [-75, 40], [-80, 25], [-82, 23],
          [-80, 25], [-85, 20], [-90, 15], [-95, 15], [-100, 18], [-105, 20],
          [-110, 22], [-115, 30], [-125, 48], [-135, 55], [-145, 60], [-160, 60]
        ],
        // Greenland
        [
          [-73, 78], [-60, 83], [-20, 83], [-10, 75], [-35, 60], [-50, 60], [-55, 65]
        ],
        // South America
        [
          [-78, 8], [-72, 11], [-60, 10], [-50, -5], [-35, -6], [-40, -20],
          [-65, -45], [-70, -53], [-75, -53], [-73, -40], [-80, -15],
          [-81, -5], [-80, 0], [-78, 5]
        ],
        // Africa
        [
          [-17, 15], [-15, 20], [-5, 35], [10, 37], [25, 32], [32, 31],
          [34, 27], [43, 12], [51, 11], [46, -5], [39, -20], [33, -34],
          [18, -34], [12, -15], [8, 0], [4, 5], [-10, 5]
        ],
        // Madagascar
        [
          [49, -12], [50, -16], [47, -25], [44, -25], [43, -20], [46, -12]
        ],
        // Eurasia
        [
          [-10, 36], [-9, 43], [-5, 48], [5, 50], [5, 55], [10, 60], [15, 68],
          [25, 71], [35, 68], [45, 60], [60, 60], [80, 73], [100, 77], [120, 77],
          [140, 72], [160, 73], [170, 65], [160, 55], [140, 50], [142, 43],
          [130, 40], [128, 37], [121, 37], [122, 35], [119, 25], [108, 15],
          [104, 1], [98, 10], [90, 22], [80, 22], [73, 8], [68, 24],
          [58, 25], [58, 12], [45, 12], [35, 30], [28, 40], [15, 38],
          [5, 40], [0, 36]
        ],
        // United Kingdom / Ireland
        [
          [-10, 51], [-5, 58], [0, 58], [2, 50], [-5, 50]
        ],
        // Japan
        [
          [130, 32], [140, 38], [142, 40], [145, 43], [140, 40], [135, 35]
        ],
        // Australia
        [
          [113, -26], [114, -35], [120, -35], [130, -32], [138, -35], [147, -38],
          [151, -34], [153, -28], [148, -20], [143, -10], [136, -12], [130, -22],
          [122, -17]
        ],
        // Tasmania
        [
          [145, -41], [148, -41], [147, -43], [145, -43]
        ],
        // Antarctica
        [
          [-180, -72], [-140, -74], [-100, -72], [-60, -65], [-20, -70], [20, -72],
          [60, -72], [100, -72], [140, -74], [180, -72], [180, -90], [-180, -90]
        ]
      ];

      // Draw all continents on canvas texture
      continentsData.forEach((pathPoints) => {
        if (pathPoints.length === 0) return;
        mapCtx.beginPath();
        pathPoints.forEach(([lon, lat], index) => {
          const px = (lon + 180) * (1024 / 360);
          const py = (90 - lat) * (512 / 180);
          if (index === 0) {
            mapCtx.moveTo(px, py);
          } else {
            mapCtx.lineTo(px, py);
          }
        });
        mapCtx.closePath();
        mapCtx.fill();
        mapCtx.stroke();
      });

      // Scatter general background light particles EXCLUSIVELY on landmasses
      const scatterLights = (x: number, y: number, w: number, h: number, count: number) => {
        for (let i = 0; i < count; i++) {
          const rx = x + Math.random() * w;
          const ry = y + Math.random() * h;
          const pixel = mapCtx.getImageData(rx, ry, 1, 1).data;
          // Red channel of continent base (#090526) is 9, Ocean base (#010008) is 1
          if (pixel[0] > 5) {
            mapCtx.fillStyle = Math.random() > 0.35 ? "#ffea78" : "#ffffff";
            mapCtx.beginPath();
            mapCtx.arc(rx, ry, 0.4 + Math.random() * 0.8, 0, Math.PI * 2);
            mapCtx.fill();
          }
        }
      };
      scatterLights(0, 0, 1024, 512, 4000);

      // Create dense clusters representing real-world metropolitan centers on land
      const cities = [
        [-74, 40],   // New York
        [-118, 34],  // Los Angeles
        [-87, 41],   // Chicago
        [-99, 19],   // Mexico City
        [-46, -23],  // Sao Paulo
        [-58, -34],  // Buenos Aires
        [-9, 38],    // Lisbon
        [-3, 40],    // Madrid
        [2, 48],     // Paris
        [0, 51],     // London
        [12, 42],    // Rome
        [21, 52],    // Warsaw
        [37, 55],    // Moscow
        [31, 30],    // Cairo
        [39, 9],     // Addis Ababa
        [28, -26],   // Johannesburg
        [46, 24],    // Riyadh
        [55, 25],    // Dubai
        [77, 28],    // New Delhi
        [72, 19],    // Mumbai
        [80, 13],    // Chennai
        [90, 23],    // Dhaka
        [100, 13],   // Bangkok
        [103, 1],    // Singapore
        [116, 39],   // Beijing
        [121, 31],   // Shanghai
        [114, 22],   // Hong Kong
        [126, 37],   // Seoul
        [139, 35],   // Tokyo
        [115, -31],  // Perth
        [144, -37],  // Melbourne
        [151, -33]   // Sydney
      ];

      cities.forEach(([lon, lat]) => {
        const px = (lon + 180) * (1024 / 360);
        const py = (90 - lat) * (512 / 180);
        const density = 20 + Math.floor(Math.random() * 20);
        for (let i = 0; i < density; i++) {
          const r = Math.random() * 14;
          const theta = Math.random() * Math.PI * 2;
          const cx = px + Math.cos(theta) * r;
          const cy = py + Math.sin(theta) * r;
          const pixel = mapCtx.getImageData(cx, cy, 1, 1).data;
          // Render cluster points only on continent landmass
          if (pixel[0] > 5) {
            mapCtx.fillStyle = Math.random() > 0.4 ? "#ffea78" : "#ffffff";
            mapCtx.beginPath();
            mapCtx.arc(cx, cy, 0.4 + Math.random() * 0.6, 0, Math.PI * 2);
            mapCtx.fill();
          }
        }
      });
    }

    const earthTex = new THREE.CanvasTexture(mapCanvas);
    earthTex.colorSpace = THREE.SRGBColorSpace;

    // D. Glossy Globe Material & Mesh
    const earthGeom = new THREE.SphereGeometry(2.0, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.15,
      metalness: 0.9,
      emissive: new THREE.Color("#ffffff"), // Neutral white multiplier keeps city lights natural
      emissiveMap: earthTex,
      emissiveIntensity: 1.0
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    sceneGroup.add(earthMesh);

    // E. Atmosphere Glow Effect
    const glowGeom = new THREE.SphereGeometry(2.06, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(clamp(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.0);
          gl_FragColor = vec4(0.48, 0.38, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    sceneGroup.add(glowMesh);

    // F. Pointer tracking for inertia rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // G. Animation Loop
    let animationId = 0;
    const clock = new THREE.Clock();

    const animateGlobe = () => {
      const elapsed = clock.getElapsedTime();

      // Earth rotation (faster, clearly visible rotation)
      earthMesh.rotation.y = elapsed * 0.22;

      // Inertia mouse tracking
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      sceneGroup.rotation.y = mouseX * 0.8;
      sceneGroup.rotation.x = mouseY * 0.5;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animateGlobe);
    };

    animateGlobe();

    // I. Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);
    const dataToSend = { ...formData };

    // Immediately show the success state for instant visual feedback
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setIsLoading(false);

    // Dispatch the message in the background silently
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    if (formspreeId && formspreeId.trim() !== "") {
      try {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      } catch (error) {
        console.warn("Background contact form submission failed:", error);
      }
    }
  };

  return (
    <section className={styles.section} id="get-in-touch">
      {/* Twinkling Stars Background */}
      <canvas ref={starCanvasRef} className={styles.starsCanvas} />

      <div className={styles.container}>
        {/* Left Side: Contact Form Card */}
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-state"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <span className={styles.categoryLabel}>GET IN TOUCH</span>
                <h2 className={`${styles.title} spotlight-text`}>Contact.</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="What's your good name?"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.input}
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="What's your web address?"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.input}
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Message</label>
                    <textarea
                      name="message"
                      required
                      placeholder="What you want to say?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={styles.textarea}
                      disabled={isLoading}
                    />
                  </div>

                  <MagneticWrapper strength={0.25} range={80}>
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </MagneticWrapper>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.successWrapper}
              >
                <div className={styles.successIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Message Sent!</h2>
                <p className={styles.successDesc}>
                  Thank you for reaching out. Your message has been received, and I'll get back to you shortly.
                </p>
                <button onClick={() => setIsSubmitted(false)} className={styles.resetBtn}>
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Side: Interactive 3D WebGL Globe */}
        <motion.div
          ref={globeContainerRef}
          className={styles.globeContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <canvas ref={globeCanvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default GetInTouch;
