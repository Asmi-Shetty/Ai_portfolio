"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "@/components/Preloader/Preloader";
import MagneticWrapper from "@/components/CustomCursor/MagneticWrapper";
import styles from "./page.module.css";

// Dynamically import heavy interactive elements to resolve hydration mismatch errors and lazy load assets
const VideoIntro = dynamic(() => import("@/components/VideoIntro/VideoIntro"), { ssr: false });
const ExperienceCube = dynamic(() => import("@/components/ExperienceCube/ExperienceCube"), { ssr: false });
const TechUniverse = dynamic(() => import("@/components/TechUniverse/TechUniverse"), { ssr: false });
const Work = dynamic(() => import("@/components/Work/Work"), { ssr: false });
const Education = dynamic(() => import("@/components/Education/Education"), { ssr: false });
const SocialDock = dynamic(() => import("@/components/SocialDock/SocialDock"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor/CustomCursor"), { ssr: false });
const GetInTouch = dynamic(() => import("@/components/GetInTouch/GetInTouch"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false });

export default function Home() {
  const unifiedRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const projectsFlexRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  const scrollToSection = (section: string) => {
    if (typeof window === "undefined") return;

    const trigger = ScrollTrigger.getById("unified-flow-trigger");
    if (!trigger) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const start = trigger.start;
    const end = trigger.end;
    const range = end - start;

    if (section === "about") {
      window.scrollTo({
        top: start + range * (0.1 / 4.65),
        behavior: "smooth"
      });
    } else if (section === "skills") {
      window.scrollTo({
        top: start + range * (0.85 / 4.65),
        behavior: "smooth"
      });
    } else if (section === "projects") {
      window.scrollTo({
        top: start + range * (2.6 / 4.65),
        behavior: "smooth"
      });
    } else if (section === "experience") {
      const el = experienceSectionRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top,
          behavior: "smooth"
        });
      }
    } else if (section === "contact") {
      const el = document.getElementById("get-in-touch-portal");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    if (!isPreloaderComplete) return; // Wait for preloader to complete
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const unified = unifiedRef.current;
      const deck = deckRef.current;
      const projectsSection = projectsSectionRef.current;
      const projectsFlex = projectsFlexRef.current;

      if (!unified || !deck || !projectsSection || !projectsFlex) return;

      const getScrollAmount = () => {
        return projectsFlex.scrollWidth - window.innerWidth;
      };

      // Set initial state of projects section to be translated out of view (on the right)
      gsap.set(projectsSection, { x: "100vw" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: unified,
          start: "top top",
          end: () => `+=${2 * window.innerHeight + getScrollAmount()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          id: "unified-flow-trigger",
        },
      });

      // 1. Cards Stack Transition: Map the first unit of scroll to cards progress (0 to 1)
      tl.to({}, {
        duration: 1,
        onUpdate: function () {
          setScrollProgress(this.progress());
        },
      });

      // 2. Section Transition: Slide the deck out to the left and projects in from the right
      tl.to(deck, {
        x: "-100vw",
        opacity: 0,
        ease: "power2.inOut",
        duration: 1,
      }, "+=0.15");

      tl.to(projectsSection, {
        x: "0vw",
        ease: "power2.inOut",
        duration: 1,
      }, "<"); // start at the same time

      // 3. Projects Horizontal Scroll
      tl.to(projectsFlex, {
        x: () => -getScrollAmount(),
        ease: "none",
        duration: 2.5,
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getById("unified-flow-trigger")?.kill();
    };
  }, [isPreloaderComplete]);

  const activeIndex = scrollProgress < 0.5 ? 0 : 1;

  const getCardStyle = (index: number) => {
    const diff = activeIndex - index;

    if (diff === 0) {
      // Active card at the front
      return {
        opacity: 1,
        zIndex: 30,
        transform: "translate3d(0, 0, 0) scale(1)",
        pointerEvents: "auto" as const,
      };
    } else if (diff > 0) {
      // Card is in the background stack (previous card)
      return {
        opacity: 0.9 - diff * 0.15,
        zIndex: 30 - diff * 10,
        transform: `translate3d(0, ${-diff * 25}px, ${-diff * 50}px) scale(${1 - diff * 0.04})`,
        pointerEvents: "none" as const,
      };
    } else {
      // Card has not entered yet (in front)
      return {
        opacity: 0,
        zIndex: 40,
        transform: "translate3d(0, 350px, -100px) scale(0.95)",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <main className={styles.main}>
      <div id="preloader-portal">
        <Preloader onComplete={() => setIsPreloaderComplete(true)} />
      </div>
      
      <div id="cursor-portal">
        <CustomCursor />
      </div>

      <Navbar onNavigate={scrollToSection} visible={isPreloaderComplete} />

      <div id="social-dock-portal">
        {isPreloaderComplete && (
          <SocialDock 
            githubUser="asmi-shetty" 
            linkedinUser="asmi-shetty" 
            leetcodeUser="asmi-shetty" 
            instagramUser="asmi-shetty"
            twitterUser="asmi-shetty"
          />
        )}
      </div>

      <div
        style={{
          opacity: isPreloaderComplete ? 1 : 0,
          visibility: isPreloaderComplete ? "visible" : "hidden",
          transition: "opacity 0.8s ease, visibility 0.8s ease"
        }}
      >
        <VideoIntro videoSrc="/hero.mp4" startEntrance={isPreloaderComplete} />

        {/* Unified Scroll Flow Section */}
        <div ref={unifiedRef} className={styles.unifiedSection}>
          
          {/* Part 1: Cards Stacking Deck */}
          <section ref={deckRef} id="about" className={styles.deckSection}>
            <div className={styles.stickyContainer}>
              <div className={styles.deckInner}>
                <div className={styles.cardStack}>

                  {/* Card 1: WHO I AM */}
                  <div className={styles.cardWrapper} style={getCardStyle(0)}>
                    <MagneticWrapper range={220} strength={0.06}>
                      <div className={styles.card}>
                        <span className={styles.cardHeader}>ABOUT - PROFILE</span>
                        <h3 className={`${styles.cardTitle} spotlight-text`}>WHO I AM</h3>

                      <p className={styles.cardBody}>
                        I build <em>Software applications</em>, <em>AI agents</em>, and <em>Blockchain Solutions</em> that transform ideas into scalable products. From <em>intelligent automation</em> and <em>agentic workflows</em> to <em>Full-stack applications</em> and <em>Web3 platforms</em>, I leverage cutting-edge technologies to create innovative and user-centric experiences.
                      </p>

                      <div className={styles.badgeContainer}>
                        {["SOFTWARE DEV", "AI AGENTS", "BLOCKCHAIN", "FULL STACK", "WEB3"].map((badge, idx) => (
                          <span key={idx} className={styles.badge}>{badge}</span>
                        ))}
                      </div>
                    </div>
                  </MagneticWrapper>
                </div>

                  {/* Card 2: TECHNICAL SKILLS */}
                  <div className={styles.cardWrapper} style={getCardStyle(1)}>
                    <MagneticWrapper range={220} strength={0.06}>
                      <div className={styles.card}>
                        <span className={styles.cardHeader}>ABOUT - ARSENAL</span>
                        <h3 className={`${styles.cardTitle} spotlight-text`}>TECHNICAL SKILLS</h3>
                      <span className={styles.outlineNumber}>02</span>

                      <div className={styles.skillsGrid}>
                        {/* Column 1 */}
                        <div className={styles.skillsColumn}>
                          <div className={styles.skillsCategory}>
                            <span className={styles.skillsLabel}>TECH STACK</span>
                            <div className={styles.skillsList}>
                              {["Python", "SQL", "C", "C++", "HTML", "CSS", "JavaScript", "React.js", "Node.js", "MongoDB", "MySQL"].map((item, idx) => (
                                <span key={idx} className={styles.skillPill}>{item}</span>
                              ))}
                            </div>
                          </div>

                          <div className={styles.skillsCategory}>
                            <span className={styles.skillsLabel}>OTHER SKILLS</span>
                            <div className={styles.skillsList}>
                              {["Communication", "Teamwork", "Leadership", "Problem-Solving", "Performance management"].map((item, idx) => (
                                <span key={idx} className={styles.skillPill}>{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className={styles.skillsColumn}>
                          <div className={styles.skillsCategory}>
                            <span className={styles.skillsLabel}>AI / ML</span>
                            <div className={styles.skillsList}>
                              {["Agentic Systems", "AI Security", "Generative AI Agents", "Generative Model Architectures", "LLM Application Development", "Retrieval-Augmented Generation (RAG)", "Tool Calling"].map((item, idx) => (
                                <span key={idx} className={styles.skillPill}>{item}</span>
                              ))}
                            </div>
                          </div>

                          <div className={styles.skillsCategory}>
                            <span className={styles.skillsLabel}>BLOCKCHAIN</span>
                            <div className={styles.skillsList}>
                              {["Solidity", "Ethereum", "Smart Contracts", "DApps", "DeFi", "Cryptocurrency", "NFTs"].map((item, idx) => (
                                <span key={idx} className={styles.skillPill}>{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 3 */}
                        <div className={styles.skillsColumn}>
                          <div className={styles.skillsCategory}>
                            <span className={styles.skillsLabel}>TOOLS</span>
                            <div className={styles.skillsList}>
                              {["LangChain", "LangGraph", "OpenAI API", "Vector Databases", "Model Context Protocol (MCP)", "Prompt Engineering", "Agentic Workflows", "GitHub", "Version Control", "ETL", "AWS"].map((item, idx) => (
                                <span key={idx} className={styles.skillPill}>{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MagneticWrapper>
                </div>

                </div>
              </div>
            </div>
          </section>

          {/* Part 2: Featured Projects */}
          <Work sectionRef={projectsSectionRef} flexRef={projectsFlexRef} />

        </div>

        {/* Part 3: Interactive Holographic Experience (placed outside to scroll naturally) */}
        <ExperienceCube sectionRef={experienceSectionRef} />

        {/* Part 4: Tech Stack Universe */}
        <TechUniverse />

        {/* Part 5: Education Details */}
        <Education />

        {/* Part 6: Get in Touch / Waitlist */}
        <div id="get-in-touch-portal">
          <GetInTouch />
        </div>
      </div>
    </main>
  );
}
