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
const EmailDock = dynamic(() => import("@/components/EmailDock/EmailDock"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor/CustomCursor"), { ssr: false });
const GetInTouch = dynamic(() => import("@/components/GetInTouch/GetInTouch"), { ssr: false });

export default function Home() {
  const deckUnifiedRef = useRef<HTMLDivElement>(null);
  const projectsUnifiedRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const projectsFlexRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  useEffect(() => {
    if (!isPreloaderComplete) return; // Wait for preloader to complete
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const deckUnified = deckUnifiedRef.current;
      const projectsUnified = projectsUnifiedRef.current;
      const deck = deckRef.current;
      const projectsSection = projectsSectionRef.current;
      const projectsFlex = projectsFlexRef.current;

      if (deckUnified && deck) {
        gsap.timeline({
          scrollTrigger: {
            trigger: deckUnified,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.2}`, // Pinned duration for 3 cards stack
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            id: "deck-trigger",
          },
        }).to({}, {
          duration: 1,
          onUpdate: function () {
            setScrollProgress(this.progress());
          },
        });
      }

      if (projectsUnified && projectsSection && projectsFlex) {
        const getScrollAmount = () => {
          return projectsFlex.scrollWidth - window.innerWidth;
        };

        // Ensure projects section starts at 0vw horizontal offset (not translated since it's naturally scrolled)
        gsap.set(projectsSection, { x: "0vw" });

        gsap.timeline({
          scrollTrigger: {
            trigger: projectsUnified,
            start: "top top",
            end: () => `+=${getScrollAmount()}`, // Horizontal scrolling range
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            id: "projects-trigger",
          },
        }).to(projectsFlex, {
          x: () => -getScrollAmount(),
          ease: "none",
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getById("deck-trigger")?.kill();
      ScrollTrigger.getById("projects-trigger")?.kill();
    };
  }, [isPreloaderComplete]);

  const activeIndex = scrollProgress < 0.33 ? 0 : scrollProgress < 0.66 ? 1 : 2;

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
      // Fade out previous cards completely when Card 3 (activeIndex = 2) is active
      const isCard3Active = activeIndex === 2;
      return {
        opacity: isCard3Active ? 0 : 0.9 - diff * 0.15,
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

      <div id="social-dock-portal">
        {isPreloaderComplete && (
          <>
            <SocialDock 
              githubUser="asmi-shetty" 
              linkedinUser="asmi-shetty" 
              instagramUser="asmi-shetty"
              twitterUser="asmi-shetty"
            />
            <EmailDock 
              email="asmishetty010@gmail.com"
            />
          </>
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

        {/* Part 1: Cards Stacking Deck (Unified Pinned Section) */}
        <div ref={deckUnifiedRef} className={styles.unifiedSection}>
          <section ref={deckRef} id="work" className={styles.deckSection}>
            <div className={styles.stickyContainer}>
              <div className={styles.deckInner}>
                <div className={styles.cardStack}>

                  {/* Card 1: WHO I AM */}
                  <div className={styles.cardWrapper} style={getCardStyle(0)}>
                    <MagneticWrapper range={220} strength={0.06} style={{ width: "100%", height: "100%" }}>
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
                    <MagneticWrapper range={220} strength={0.06} style={{ width: "100%", height: "100%" }}>
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

                  {/* Card 3: MY TECH STACK */}
                  <div className={styles.cardWrapper} style={getCardStyle(2)}>
                    <div className={styles.card} style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", background: "transparent", border: "none", boxShadow: "none", backdropFilter: "none" }}>
                      <TechUniverse showHeader={true} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Part 2: Featured Projects (Unified Pinned Section) */}
        <div ref={projectsUnifiedRef} className={styles.unifiedSection}>
          <Work sectionRef={projectsSectionRef} flexRef={projectsFlexRef} />
        </div>

        {/* Part 3: Interactive Holographic Experience (placed outside to scroll naturally) */}
        <ExperienceCube sectionRef={experienceSectionRef} />

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
