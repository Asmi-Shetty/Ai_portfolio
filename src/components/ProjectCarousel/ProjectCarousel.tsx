"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./ProjectCarousel.module.css";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Meeting Intelligence and RAG Assistant",
    subtitle: "Meeting transcription & conversational RAG insights",
    description: "AI-powered meeting assistant transcribing English/Hindi meetings from URLs or files. Built with LangChain and ChromaDB for conversational query retrieval, automated summaries, and exported PDF reports.",
    image: "/project_ai.png",
    tech: ["Python", "LangChain LCEL", "OpenAI Whisper", "Sarvam AI", "Mistral AI", "ChromaDB", "Hugging Face Embeddings", "RAG", "Streamlit"]
  },
  {
    id: 2,
    title: "Adaptive RAG: Agentic AI Chatbot",
    subtitle: "LangGraph multi-agent routing & semantic document search",
    description: "Adaptive RAG system dynamically routing queries between Qdrant document search and web search. Implements a multi-agent LangGraph workflow for relevance grading, chunking, and query rewriting.",
    image: "/project_security.png",
    tech: ["Python", "LangGraph", "FastAPI", "Qdrant", "LLM", "MongoDB", "OpenAI API", "Streamlit", "REST APIs"]
  },
  {
    id: 3,
    title: "Loops: Full-Stack AI Platform",
    subtitle: "Networking, collaborative coding & structured learning ecosystem",
    description: "Upgraded a full-stack AI platform integrating collaborative coding, networking, learning, and assessments. Built Loops real-time messaging and geolocation event discovery.",
    image: "/project_defi.png",
    tech: ["React.js", "Node.js", "Python", "MERN", "Socket.io", "PostgreSQL", "Prisma", "Geolocation API"]
  },
  {
    id: 4,
    title: "Ayushman Bharat Health Portal",
    subtitle: "ABDM-aligned digital healthcare scaling platform",
    description: "ABDM-aligned portal enabling 10,000+ patient registrations and empowering 1,000+ professionals. Refactored backend architecture with 10+ REST APIs for facility management.",
    image: "/project_iot.png",
    tech: ["Node.js", "Express", "MongoDB", "REST APIs", "ABDM SDK", "Docker"]
  },
  {
    id: 5,
    title: "Real Estate Platform",
    subtitle: "Property discovery, locality insights & smart search portal",
    description: "Full-stack property discovery platform across Nagpur. Features property listings, locality insights, and an intuitive search experience with FastAPI and PostgreSQL.",
    image: "/project_security.png",
    tech: ["React.js", "Tailwind CSS", "FastAPI", "SQLAlchemy", "SQLite", "PostgreSQL"]
  }
];

export default function ProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef(0);

  const length = PROJECTS.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  // Viewport entrance observation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Trigger once for a clean fanning spin-in
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Stagger cooldown timer
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setEntranceFinished(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Start autoplay when not hovering or dragging
  useEffect(() => {
    if (hoveredIndex === null && entranceFinished) {
      autoplayRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hoveredIndex, activeIndex, entranceFinished]);

  // Support Mouse Wheel scroll navigation
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 450) return; // Throttled wheel triggers
    lastWheelTime.current = now;

    if (e.deltaY > 15 || e.deltaX > 15) {
      nextSlide();
    } else if (e.deltaY < -15 || e.deltaX < -15) {
      prevSlide();
    }
  };

  const getCardMotionProps = (index: number) => {
    if (!isInView) {
      // Initial state: Cards collapsed in center, spun 180deg, pushed back in depth
      return {
        x: 0,
        y: 20,
        z: -300,
        rotateY: -180,
        rotateZ: 0,
        scale: 0.4,
        opacity: 0,
        zIndex: 1,
      };
    }

    let diff = index - activeIndex;

    // Handle circular offsets
    if (diff < -length / 2) diff += length;
    if (diff > length / 2) diff -= length;

    if (diff === 0) {
      // Active center card
      return {
        x: 0,
        y: 0,
        z: 50,
        rotateY: 0,
        rotateZ: 0,
        scale: 1.1,
        opacity: 1,
        zIndex: 10,
      };
    } else if (diff === -1 || (diff === length - 1 && length === 3)) {
      // Left slide (tilted outward, Y-slanted, dropped vertically)
      return {
        x: -190,
        y: 12,
        z: -60,
        rotateY: 26,
        rotateZ: -3,
        scale: 0.88,
        opacity: 0.8,
        zIndex: 5,
      };
    } else if (diff === 1 || (diff === 1 - length && length === 3)) {
      // Right slide (tilted outward, Y-slanted, dropped vertically)
      return {
        x: 190,
        y: 12,
        z: -60,
        rotateY: -26,
        rotateZ: 3,
        scale: 0.88,
        opacity: 0.8,
        zIndex: 5,
      };
    } else {
      // Far background slides
      const dir = diff > 0 ? 1 : -1;
      return {
        x: dir * 330,
        y: 36,
        z: -180,
        rotateY: -dir * 46,
        rotateZ: dir * 6,
        scale: 0.8,
        opacity: 0.35,
        zIndex: 2,
      };
    }
  };

  // spring configuration for Apple-style fluid motion
  const springTransition = {
    type: "spring" as const,
    stiffness: 160,
    damping: 22,
    mass: 0.9,
  };

  return (
    <section ref={sectionRef} id="projects" className={styles.projectSection} onWheel={handleWheel}>
      {/* Ambient glows */}
      <div className={styles.bgGlowOrange} />
      <div className={styles.bgGlowBlue} />

      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.headerBlock}>
          <span className={styles.badge}>PORTFOLIO</span>
          <h2 className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>
            A showcase of AI agents, Web3 applications, and advanced system tools
          </p>
        </div>

        {/* 3D Orbit Carousel Wrapper */}
        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            {PROJECTS.map((project, index) => {
              const isActive = index === activeIndex;
              const isHovered = hoveredIndex === index;
              const motionProps = getCardMotionProps(index);

              return (
                <motion.div
                  key={project.id}
                  className={`${styles.cardWrapper} ${isActive ? styles.activeCard : ""}`}
                  // Framer Motion spring positioning
                  animate={{
                    x: motionProps.x,
                    y: motionProps.y,
                    z: motionProps.z,
                    rotateY: motionProps.rotateY,
                    rotateZ: motionProps.rotateZ,
                    scale: motionProps.scale,
                    opacity: motionProps.opacity,
                  }}
                  style={{
                    zIndex: motionProps.zIndex,
                  }}
                  transition={
                    !entranceFinished
                      ? { ...springTransition, delay: index * 0.12 }
                      : springTransition
                  }
                  onClick={() => {
                    if (!isActive) setActiveIndex(index);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  // Drag swiping gestures
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(event, info) => {
                    const threshold = 40;
                    if (info.offset.x < -threshold) {
                      nextSlide();
                    } else if (info.offset.x > threshold) {
                      prevSlide();
                    }
                  }}
                >
                  <div className={styles.card}>
                    {/* Project Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.cardImg}
                      draggable={false} // Disable default image drag
                    />

                    {/* Default bottom footer */}
                    <div className={styles.cardFooter}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <span className={styles.projectSubtitle}>{project.subtitle}</span>
                    </div>

                    {/* Hover popup description panel */}
                    <div className={`${styles.popupOverlay} ${isHovered ? styles.popupVisible : ""}`}>
                      <div className={styles.popupBorderGlow} />
                      <div className={styles.popupContent}>
                        <h3 className={styles.popupTitle}>{project.title}</h3>
                        <span className={styles.popupSubtitle}>{project.subtitle}</span>
                        <p className={styles.popupDesc}>{project.description}</p>
                        
                        <div className={styles.techList}>
                          {project.tech.map((t, tIdx) => (
                            <span key={tIdx} className={styles.techPill}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous Project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next Project">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className={styles.dotsContainer}>
          {PROJECTS.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
