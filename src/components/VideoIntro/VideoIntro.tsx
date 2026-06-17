"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import MagneticWrapper from "../CustomCursor/MagneticWrapper";
import styles from "./VideoIntro.module.css";

const CinematicLayer = dynamic(
  () => import("../CinematicLayer/CinematicLayer"),
  { ssr: false }
);

interface VideoIntroProps {
  videoSrc: string;
  startEntrance?: boolean;
}

const ROLES = ["AI DEVELOPER", "SOFTWARE DEVELOPER", "BLOCKCHAIN DEVELOPER"];

const VideoIntro: React.FC<VideoIntroProps> = ({ videoSrc, startEntrance = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const firstName = useRef<HTMLDivElement>(null);
  const lastName = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const soundHintRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Typewriter effect state
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // GSAP entrance animation
  useEffect(() => {
    let tl: any;

    const initGsap = async () => {
      try {
        const mod = (await import("gsap")) as any;
        const gsap = mod.gsap || (mod.default && (mod.default.gsap || mod.default));
        if (!gsap) {
          console.error("GSAP module could not be resolved.");
          return;
        }

        const elements = [
          taglineRef.current,
          firstName.current,
          lastName.current,
          subtitleRef.current
        ].filter(Boolean);

        // Set initial states immediately to avoid flash
        gsap.set(elements, { opacity: 0, y: 40 });
        if (sectionRef.current) {
          gsap.set(sectionRef.current, { opacity: 0 });
        }

        // Early return if preloader is not complete
        if (!startEntrance) return;

        // Staggered cinematic entrance
        tl = gsap.timeline({ delay: 0.3 });

        if (sectionRef.current) {
          tl.to(sectionRef.current, {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          });
        }

        if (taglineRef.current) {
          tl.to(
            taglineRef.current,
            { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
            "-=0.6"
          );
        }

        if (firstName.current) {
          tl.to(
            firstName.current,
            { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
            "-=0.6"
          );
        }

        if (lastName.current) {
          tl.to(
            lastName.current,
            { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
            "-=0.9"
          );
        }

        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
            "-=0.7"
          );
        }

        // scroll indicator animation removed

        setIsLoaded(true);
      } catch (err) {
        console.error("Error loading or initializing GSAP:", err);
      }
    };

    initGsap();

    return () => {
      tl?.kill();
    };
  }, [startEntrance]);

  // Auto-hide sound hint
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSoundHint(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Handle autoplay with sound on, fall back to muted if blocked by browser autoplay policy
  useEffect(() => {
    const v = videoRef.current;
    const bg = bgVideoRef.current;
    if (!v || !bg || !startEntrance) return;

    v.muted = isMuted;
    bg.muted = isMuted;

    const promise = v.play();
    if (promise !== undefined) {
      promise.then(() => {
        bg.play().catch(() => {});
        setIsPlaying(true);
      }).catch((error) => {
        console.warn("Unmuted autoplay prevented by browser. Falling back to muted autoplay:", error);
        v.muted = true;
        bg.muted = true;
        setIsMuted(true);
        v.play().catch(() => {});
        bg.play().catch(() => {});
      });
    }
  }, [startEntrance]);

  // Typewriter effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleType = () => {
      const fullWord = ROLES[wordIndex];
      
      if (!isDeleting) {
        const nextText = fullWord.slice(0, currentText.length + 1);
        setCurrentText(nextText);
        setTypingSpeed(100 + Math.random() * 50);

        if (nextText === fullWord) {
          setTypingSpeed(2000); // Wait 2 seconds while full word is typed
          setIsDeleting(true);
        }
      } else {
        const nextText = fullWord.slice(0, currentText.length - 1);
        setCurrentText(nextText);
        setTypingSpeed(50); // Deleting faster

        if (nextText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % ROLES.length);
          setTypingSpeed(500); // Pause before typing the next word
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, typingSpeed]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    const bg = bgVideoRef.current;
    if (!v || !bg) return;
    const next = !isMuted;
    v.muted = next;
    bg.muted = next;
    setIsMuted(next);
    setShowSoundHint(false);
  }, [isMuted]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    const bg = bgVideoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      bg?.pause();
      setIsPlaying(false);
    } else {
      if (v.ended) {
        v.currentTime = 0;
        if (bg) bg.currentTime = 0;
      }
      v.play();
      bg?.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // scrollToWork callback removed

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Ambient blurred background video */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* Cinematic gradient overlays */}
      <div className={styles.overlayBottom} />
      <div className={styles.overlayTop} />
      <div className={styles.overlayLeft} />
      <div className={styles.overlayVignette} />

      {/* Foreground video */}
      <div className={styles.videoWrap}>
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsLoaded(true)}
          onEnded={() => setIsPlaying(false)}
        />
        <div className={styles.videoGlow} />
      </div>

      {/* Three.js Cinematic bokeh layer */}
      <CinematicLayer />

      {/* ── Content overlay ── */}
      <div ref={contentRef} className={styles.content}>
        <div className={styles.contentInner}>
          <span ref={taglineRef} className={styles.tagline}>
            HELLO THERE, I AM
          </span>

          <div className={styles.nameBlock}>
            <div ref={firstName} className={`${styles.nameFirst} spotlight-text`}>
              ASMI
            </div>
            <div ref={lastName} className={`${styles.nameLast} spotlight-text`}>
              <span className={styles.nameLastInner}>SHETTY</span>
              <span className={styles.nameDot} />
            </div>
          </div>

          <p ref={subtitleRef} className={styles.subtitle}>
            <span>{currentText}</span>
            <span className={styles.cursor} />
          </p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <MagneticWrapper strength={0.35}>
          <button
            className={styles.controlBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </MagneticWrapper>

        <MagneticWrapper strength={0.35}>
          <button
            className={styles.controlBtn}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                <path d="M1 4.5H3.5L7 1.5V12.5L3.5 9.5H1V4.5Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <line x1="10" y1="4" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="4" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                <path d="M1 4.5H3.5L7 1.5V12.5L3.5 9.5H1V4.5Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M9.5 3.5C11.2 4.7 12.3 6.2 12.3 7C12.3 7.8 11.2 9.3 9.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M11 1C13.8 2.8 15.5 4.8 15.5 7C15.5 9.2 13.8 11.2 11 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </svg>
            )}
          </button>
        </MagneticWrapper>
      </div>

      {/* ── Sound hint badge ── */}
      <div className={`${styles.soundHint} ${(showSoundHint && isMuted) ? styles.soundHintVisible : styles.soundHintHidden}`}>
        <span className={styles.soundPulse} />
        Tap for sound
      </div>

    </section>
  );
};

export default VideoIntro;
