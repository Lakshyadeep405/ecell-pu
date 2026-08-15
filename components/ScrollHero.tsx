"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_FILES = [
  "frame_0:00_0f.jpeg",
  "frame_0:00_3f.jpeg",
  "frame_0:00_5f.jpeg",
  "frame_0:00_6f.jpeg",
  "frame_0:00_7f.jpeg",
  "frame_0:00_8f.jpeg",
  "frame_0:00_9f.jpeg",
  "frame_0:00_10f.jpeg",
  "frame_0:00_11f.jpeg",
  "frame_0:00_12f.jpeg",
  "frame_0:00_13f.jpeg",
  "frame_0:00_14f.jpeg",
  "frame_0:00_15f.jpeg",
  "frame_0:00_16f.jpeg",
  "frame_0:00_17f.jpeg",
  "frame_0:00_18f.jpeg",
  "frame_0:00_19f.jpeg",
  "frame_0:00_20f.jpeg",
  "frame_0:00_21f.jpeg",
  "frame_0:00_22f.jpeg",
  "frame_0:00_23f.jpeg",
  "frame_0:01_0f.jpeg",
  "frame_0:01_1f.jpeg",
  "frame_0:01_2f.jpeg",
  "frame_0:01_3f.jpeg",
  "frame_0:01_4f.jpeg",
  "frame_0:01_6f.jpeg",
  "frame_0:01_7f.jpeg",
  "frame_0:01_9f.jpeg",
  "frame_0:01_10f.jpeg",
  "frame_0:01_12f.jpeg",
  "frame_0:01_13f.jpeg",
  "frame_0:01_15f.jpeg",
  "frame_0:01_16f.jpeg",
  "frame_0:01_18f.jpeg",
  "frame_0:01_19f.jpeg",
  "frame_0:01_21f.jpeg",
  "frame_0:02_3f.jpeg",
  "frame_0:02_6f.jpeg",
  "frame_0:02_7f.jpeg",
  "frame_0:02_9f.jpeg",
  "frame_0:02_10f.jpeg",
  "frame_0:02_11f.jpeg",
  "frame_0:02_12f.jpeg",
  "frame_0:02_13f.jpeg",
  "frame_0:02_14f.jpeg",
  "frame_0:02_15f.jpeg",
  "frame_0:02_16f.jpeg",
  "frame_0:02_17f.jpeg",
  "frame_0:02_18f.jpeg",
  "frame_0:02_19f.jpeg",
  "frame_0:02_20f.jpeg",
  "frame_0:02_21f.jpeg",
  "frame_0:02_22f.jpeg",
  "frame_0:02_23f.jpeg",
  "frame_0:03_0f.jpeg",
  "frame_0:03_1f.jpeg",
  "frame_0:03_2f.jpeg",
  "frame_0:03_3f.jpeg",
  "frame_0:03_4f.jpeg",
  "frame_0:03_5f.jpeg",
  "frame_0:03_6f.jpeg",
  "frame_0:03_7f.jpeg",
  "frame_0:03_8f.jpeg",
  "frame_0:03_9f.jpeg",
  "frame_0:03_13f.jpeg",
  "frame_0:03_14f.jpeg",
  "frame_0:03_15f.jpeg",
  "frame_0:03_16f.jpeg",
  "frame_0:03_17f.jpeg",
  "frame_0:03_18f.jpeg",
  "frame_0:03_19f.jpeg",
  "frame_0:03_20f.jpeg",
  "frame_0:04_1f.jpeg",
  "frame_0:04_2f.jpeg",
  "frame_0:04_3f.jpeg",
  "frame_0:04_4f.jpeg",
  "frame_0:04_5f.jpeg",
  "frame_0:04_6f.jpeg",
  "frame_0:04_7f.jpeg",
  "frame_0:04_8f.jpeg",
  "frame_0:04_9f.jpeg",
  "frame_0:04_10f.jpeg",
  "frame_0:04_11f.jpeg",
  "frame_0:04_12f.jpeg",
  "frame_0:04_13f.jpeg",
  "frame_0:04_14f.jpeg",
  "frame_0:04_15f.jpeg",
  "frame_0:04_16f.jpeg",
  "frame_0:04_17f.jpeg",
  "frame_0:04_21f.jpeg",
  "frame_0:05_1f.jpeg",
  "frame_0:05_6f.jpeg",
  "frame_0:05_9f.jpeg",
  "frame_0:05_12f.jpeg",
  "frame_0:05_15f.jpeg",
  "frame_0:06_4f.jpeg",
  "frame_0:06_6f.jpeg",
  "frame_0:06_7f.jpeg",
  "frame_0:06_9f.jpeg",
  "frame_0:06_10f.jpeg",
  "frame_0:06_12f.jpeg",
  "frame_0:06_15f.jpeg",
  "frame_0:06_16f.jpeg",
  "frame_0:06_18f.jpeg",
  "frame_0:06_21f.jpeg",
  "frame_0:07_0f.jpeg",
  "frame_0:07_1f.jpeg",
  "frame_0:07_3f.jpeg",
  "frame_0:07_6f.jpeg",
  "frame_0:07_7f.jpeg",
  "frame_0:07_9f.jpeg",
  "frame_0:07_12f.jpeg",
  "frame_0:07_13f.jpeg",
  "frame_0:08_15f.jpeg",
  "frame_0:08_16f.jpeg",
  "frame_0:08_18f.jpeg",
  "frame_0:08_21f.jpeg",
  "frame_0:09_0f.jpeg",
  "frame_0:09_1f.jpeg",
  "frame_0:09_3f.jpeg",
  "frame_0:09_4f.jpeg",
  "frame_0:09_6f.jpeg",
  "frame_0:09_7f.jpeg",
  "frame_0:09_9f.jpeg",
  "frame_0:09_12f.jpeg",
];

const TOTAL = FRAME_FILES.length;

export default function ScrollHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL).fill(null));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadPct, setLoadPct] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [midOpacity, setMidOpacity] = useState(0);
  const [endOpacity, setEndOpacity] = useState(0);
  const [isPastHero, setIsPastHero] = useState(false);

  // Draw a frame onto canvas (cover-fit)
  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[Math.round(index)];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    const ox = (cw - sw) / 2, oy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, sw, sh);
  }

  // Resize canvas to window
  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameRef.current);
  }

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // RAF animation loop with easing
    function loop() {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) < 0.2) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * 0.12;
      }
      drawFrame(currentFrameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload frames
  useEffect(() => {
    let loaded = 0;

    FRAME_FILES.forEach((file, i) => {
      const img = new Image();
      img.src = `/frames/${file}`;
      img.onload = () => {
        imagesRef.current[i] = img;
        loaded++;
        setLoadPct(Math.round((loaded / TOTAL) * 100));
        if (loaded === TOTAL) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        imagesRef.current[i] = imagesRef.current[Math.max(0, i - 1)];
        loaded++;
        if (loaded === TOTAL) setIsReady(true);
      };
    });
  }, []);

  // Scroll handler
  useEffect(() => {
    function onScroll() {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = window.scrollY;
      const sectionTop = container.offsetTop;
      const scrollable = container.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / scrollable));

      targetFrameRef.current = progress * (TOTAL - 1);

      // Hero text: 0→15%
      setHeroOpacity(
        progress < 0.15 ? 1 : Math.max(0, 1 - (progress - 0.15) / 0.1)
      );
      // Mid text: 30→55%
      setMidOpacity(
        progress < 0.30 ? 0
          : progress < 0.40 ? (progress - 0.30) / 0.10
          : progress < 0.55 ? 1
          : Math.max(0, 1 - (progress - 0.55) / 0.08)
      );
      // End text: 70→100%
      setEndOpacity(Math.min(1, progress < 0.70 ? 0 : (progress - 0.70) / 0.10));

      // Disable pointer events when scrolled past the hero track
      setIsPastHero(progress >= 0.95);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── LOADER ── */}
      {!isReady && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background">
          <div className="font-[family-name:var(--font-outfit)] text-3xl font-black uppercase tracking-wider text-center">
            <span className="text-[#D4AF37]">Entrepreneurship</span>
            <span className="text-foreground block mt-1">Cell JNCT PU</span>
          </div>
          <div className="w-48 h-[6px] rounded-none border border-foreground bg-foreground/5 overflow-hidden">
            <div
              className="h-full rounded-none bg-[#D4AF37] transition-all duration-100"
              style={{ width: `${loadPct}%` }}
            />
          </div>
          <p className="text-muted-foreground text-[10px] tracking-widest uppercase font-bold">
            Loading JNCT PU experience… {loadPct}%
          </p>
        </div>
      )}

      {/* ── SCROLL SECTION ── */}
      <section
        ref={containerRef}
        className="relative"
        style={{ height: "600vh" }}
        id="home"
      >
        {/* Sticky viewport */}
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none"
          style={{ display: isPastHero ? "none" : "block" }}
        >
          {/* Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 45%, rgba(10,10,10,0.4) 100%),
                linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, transparent 18%, transparent 75%, rgba(255,255,255,1) 100%)
              `,
            }}
          />

          {/* ── HERO TEXT (0–25%) ── */}
          <div
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center w-[90%] max-w-3xl pointer-events-none transition-opacity duration-300"
            style={{ opacity: heroOpacity }}
          >
            <p className="font-[family-name:var(--font-outfit)] text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
              JNCT PU Professional University
            </p>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black leading-[1.05] tracking-tight text-white mb-5 uppercase"
              style={{ fontSize: "clamp(1.7rem, 6vw, 5.5rem)" }}
            >
              Ignite Your<br />
              <span className="gradient-text">Entrepreneurial</span><br />
              Spirit
            </h1>
            <p className="text-sm text-white/50 tracking-[0.15em] uppercase mb-4 font-bold">
              Scroll to explore
            </p>
            {/* Scroll indicator */}
            <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full mx-auto relative overflow-hidden">
              <div className="w-1 h-2 bg-[#D4AF37] rounded-full absolute top-1 left-1/2 -translate-x-1/2 animate-bounce" />
            </div>
          </div>
  
          {/* ── MID TEXT (30–55%) ── */}
          <div
            className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-0 md:pl-[8%] pointer-events-none transition-opacity duration-300"
            style={{ opacity: midOpacity }}
          >
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              <span className="clay-badge px-3 py-1 bg-background/50 text-foreground w-fit">
                Innovation
              </span>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black leading-[1.1] tracking-tight text-white uppercase"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                Where Ideas<br />
                <span className="gradient-text-green">Come Alive</span>
              </h2>
            </div>
          </div>
  
          {/* ── END TEXT (70–100%) ── */}
          <div
            className="absolute inset-0 flex items-center justify-center md:justify-end px-6 md:px-0 md:pr-[8%] transition-opacity duration-300 pointer-events-none"
            style={{ opacity: endOpacity }}
          >
            <div 
              className="flex flex-col items-center md:items-end gap-4 text-center md:text-right"
              style={{ pointerEvents: !isPastHero && endOpacity > 0.5 ? "auto" : "none" }}
            >
              <span className="clay-badge px-3 py-1 bg-background/50 text-foreground">
                E-Cell JNCT PU
              </span>
              <h2
                className="font-[family-name:var(--font-outfit)] font-black leading-[1.1] tracking-tight text-white uppercase"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                Your Journey<br />
                Starts <span className="gradient-text">Here</span>
              </h2>
              <a
                href="#about"
                className="clay-btn clay-btn-primary px-8 py-3.5 text-sm"
              >
                Explore Entrepreneurship Cell
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
