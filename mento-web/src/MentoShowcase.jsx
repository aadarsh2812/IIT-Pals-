import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ── tiny helpers ────────────────────────────────────────────────────────── */
function useReveal(margin = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return [ref, inView];
}

function Reveal({ children, delay = 0, y = 24, className = "" }) {
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useReveal();
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-500"
      style={{
        background: scrolled ? "rgba(6,6,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/Atomic minds logo.webp" alt="Atomic Minds" style={{ height: 42, width: "auto", objectFit: "contain", background: "#fff", padding: "2px 6px", borderRadius: 4 }} />
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>Mento</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Problem", "Solution", "App", "Impact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >{l}</a>
          ))}
          <a href="#demo" style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, background: "#E63946", color: "#fff", padding: "9px 22px", borderRadius: 100, textDecoration: "none", letterSpacing: "0.02em" }}>Watch Demo</a>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", background: "#06060A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "100px 24px 60px" }}>
      {/* background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(230,57,70,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 0, right: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        {/* grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}>
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* diagonal accent */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "40%", background: "linear-gradient(to bottom, transparent, #E63946, transparent)" }} />
      </div>

      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, textAlign: "center", maxWidth: 900 }}>
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 12, border: "1px solid rgba(230,57,70,0.3)", background: "rgba(230,57,70,0.08)", borderRadius: 100, padding: "6px 20px", marginBottom: 32 }}
        >
          <img src="/Atomic minds logo.webp" alt="Atomic Minds" style={{ height: 28, width: "auto", objectFit: "contain", background: "#fff", padding: "2px 4px", borderRadius: 3 }} />
          <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Atomic Minds · Smart Wearable System</span>
        </motion.div>

        {/* main headline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <h1 style={{ fontFamily: "Bebas Neue", fontSize: "clamp(80px, 14vw, 180px)", lineHeight: 0.9, color: "#fff", letterSpacing: "0.01em", margin: 0 }}>
            BEFORE
          </h1>
          <h1 style={{ fontFamily: "Bebas Neue", fontSize: "clamp(80px, 14vw, 180px)", lineHeight: 0.9, background: "linear-gradient(90deg, #E63946, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.01em", margin: 0 }}>
            INJURY
          </h1>
          <h1 style={{ fontFamily: "Bebas Neue", fontSize: "clamp(80px, 14vw, 180px)", lineHeight: 0.9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.01em", margin: "0 0 32px" }}>
            STRIKES.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ fontFamily: "DM Sans", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.45)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}
        >
          Mento is a real-time wearable system that predicts sports injuries before they happen — using multi-sensor fusion, edge computing, and an LSTM trained on continuous biometric streams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <a href="#demo" style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, background: "#E63946", color: "#fff", padding: "14px 32px", borderRadius: 100, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 0 40px rgba(230,57,70,0.35)" }}>
            ▶ Watch Demo
          </a>
          <a href="#solution" style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "14px 32px", borderRadius: 100, textDecoration: "none" }}>
            Explore System →
          </a>
        </motion.div>

        {/* 3 live indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
          style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 64, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", maxWidth: 560, margin: "64px auto 0" }}
        >
          {[
            { v: "3", u: "Sensors", sub: "fused in real-time" },
            { v: "< ₹3K", u: "Cost", sub: "full hardware BOM" },
            { v: "LSTM", u: "AI Engine", sub: "continuous inference" },
          ].map((s, i) => (
            <div key={s.u} style={{ flex: 1, padding: "24px 16px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 32, color: "#fff", letterSpacing: "0.02em" }}>{s.v}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 11, color: "#E63946", textTransform: "uppercase", letterSpacing: "0.1em", margin: "2px 0" }}>{s.u}</div>
              <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Problem ─────────────────────────────────────────────────────────────── */
function Problem() {
  return (
    <section id="problem" style={{ background: "#06060A", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#E63946" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#E63946", textTransform: "uppercase", letterSpacing: "0.12em" }}>The Problem</span>
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", lineHeight: 1.05, margin: "0 0 60px", letterSpacing: "-0.02em" }}>
            Athletes are getting injured.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>And we're not stopping it.</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { stat: 60, suffix: "%", label: "of all sports injuries", sub: "occur during training sessions — not in competition.", color: "#E63946" },
            { stat: 30, suffix: "%", label: "of athletes sidelined", sub: "every single year from preventable time-loss injuries.", color: "#FF6B35" },
            { stat: 0, suffix: "", label: "real-time predictive systems", sub: "exist at affordable scale. Coaches still rely on naked-eye observation.", color: "#00D4FF" },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 0.1}>
              <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "40px 32px", background: "rgba(255,255,255,0.02)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                <div style={{ fontFamily: "Bebas Neue", fontSize: 80, color: c.color, lineHeight: 1, letterSpacing: "0.01em" }}>
                  <CountUp target={c.stat} suffix={c.suffix} />
                </div>
                <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#fff", margin: "8px 0 6px" }}>{c.label}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{c.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ marginTop: 24, border: "1px solid rgba(230,57,70,0.2)", borderRadius: 16, padding: "24px 32px", background: "rgba(230,57,70,0.05)", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 20, marginTop: 2 }}>⚠</div>
            <p style={{ fontFamily: "DM Sans", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#fff" }}>The system gap is clear:</strong> Current approaches are entirely reactive. A coach watches. An athlete feels pain. Then injury is confirmed. There is no continuous, objective signal that catches biomechanical stress <em style={{ color: "#E63946" }}>before</em> the damage is done.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Solution / System ───────────────────────────────────────────────────── */
function Solution() {
  const steps = [
    {
      num: "01", icon: "◈", color: "#00D4FF", title: "Sense",
      items: ["MAX30102 → SpO₂ & Heart Rate", "MPU6050 → Kinematics / IMU", "EMG BioAmp → Muscle Electrical Activity"],
      sub: "Three sensors, one wrist. Continuous physiological capture at the edge."
    },
    {
      num: "02", icon: "⬡", color: "#E63946", title: "Process",
      items: ["ESP32-S3 @ 240MHz dual-core", "FreeRTOS task scheduling", "BLE 4.0 + MQTT pub/sub"],
      sub: "On-device processing with sub-100ms latency. Cloud sync via Firebase."
    },
    {
      num: "03", icon: "◇", color: "#A78BFA", title: "Predict",
      items: ["LSTM trained on continuous streams", "Rolling injury risk score (0–100%)", "Custom-trained AI Coach — personalised guidance"],
      sub: "The model flags danger before pain begins. Not reactive — anticipatory."
    },
  ];

  return (
    <section id="solution" style={{ background: "#080810", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#00D4FF" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#00D4FF", textTransform: "uppercase", letterSpacing: "0.12em" }}>The System</span>
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 72px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Sense. Process. Predict.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>One wearable. Full picture.</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, position: "relative" }}>
          {/* connector line */}
          <div style={{ position: "absolute", top: 60, left: "17%", right: "17%", height: 1, background: "linear-gradient(90deg, #00D4FF, #E63946, #A78BFA)", opacity: 0.3, display: "none" }} />

          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.15}>
              <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "40px 32px", background: "rgba(255,255,255,0.015)", height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: -40, right: -20, fontFamily: "Bebas Neue", fontSize: 140, color: s.color, opacity: 0.04, lineHeight: 1 }}>{s.num}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <span style={{ fontFamily: "Bebas Neue", fontSize: 48, color: s.color, lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontSize: 28, color: s.color, opacity: 0.6 }}>{s.icon}</span>
                </div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ color: s.color, fontSize: 8 }}>●</span> {item}
                    </li>
                  ))}
                </ul>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, margin: 0 }}>{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── App Screenshots (auto-scroll) ───────────────────────────────────────── */
function AppScreens() {
  const [active, setActive] = useState(0);
  const screens = [
    { img: "/screen1.png", label: "Dashboard", desc: "Real-time biometric overview with synced vitals — HR, SpO₂, Fatigue, Injury Risk — plus HRV, Body Temp, and Muscle Load." },
    { img: "/screen2.png", label: "Injury Risk", desc: "Body stress heatmap with 3D model, medical risk thresholds, and risk percentage display." },
    { img: "/screen3.png", label: "Risk Analytics", desc: "Pro athlete comparison, weekly risk trend chart with peer benchmarks, and AI-generated insight cards." },
    { img: "/screen4.png", label: "Performance", desc: "6-axis radar benchmarking — your score vs peer and pro athlete benchmarks, with key metrics." },
    { img: "/screen5.png", label: "Wearables", desc: "Raw sensor stream — HR, SpO₂, Skin Temp, Motion Index, ECG, Cadence, all live from dual bands." },
    { img: "/screen6.png", label: "AI Coach", desc: "Custom-trained conversational coaching with context-aware recovery plans and injury assessment." },
    { img: "/screen7.png", label: "Profile", desc: "Privacy controls, device management, account settings, and data sharing preferences." },
  ];

  // auto-advance every 8s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % screens.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="app" style={{ background: "#06060A", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#A78BFA" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.12em" }}>Mobile App</span>
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 56px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Seven screens.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>Zero guesswork.</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "center" }}>
          {/* phone frame */}
          <Reveal>
            <div style={{ position: "relative", maxWidth: 300, margin: "0 auto" }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 40, overflow: "hidden", background: "#111", boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(167,139,250,0.1)" }}>
                <div style={{ height: 24, background: "#0a0a0a", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 100 }} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={screens[active].img}
                    alt={screens[active].label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", display: "block" }}
                  />
                </AnimatePresence>
              </div>
              {/* progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
                {screens.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 100, background: i === active ? "#A78BFA" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* screen list */}
          <Reveal delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {screens.map((s, i) => (
                <button key={s.label} onClick={() => setActive(i)}
                  style={{
                    textAlign: "left",
                    background: active === i ? "rgba(167,139,250,0.08)" : "transparent",
                    border: active === i ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
                    borderRadius: 14, padding: "16px 20px", cursor: "pointer",
                    transition: "all 0.25s", display: "flex", alignItems: "center", gap: 16
                  }}>
                  <span style={{ fontFamily: "Bebas Neue", fontSize: 20, color: active === i ? "#A78BFA" : "rgba(255,255,255,0.2)", minWidth: 28, transition: "color 0.2s" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: active === i ? "#fff" : "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>{s.label}</div>
                    <AnimatePresence>
                      {active === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                          style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.5 }}>
                          {s.desc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* auto-progress bar */}
                  {active === i && (
                    <div style={{ width: 3, height: 40, background: "rgba(167,139,250,0.15)", borderRadius: 100, overflow: "hidden", flexShrink: 0 }}>
                      <motion.div key={active} initial={{ height: "0%" }} animate={{ height: "100%" }} transition={{ duration: 8.0, ease: "linear" }}
                        style={{ width: "100%", background: "#A78BFA", borderRadius: 100 }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Impact ──────────────────────────────────────────────────────────────── */
function Impact() {
  return (
    <section id="impact" style={{ background: "#080810", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#34D399" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.12em" }}>Feasibility & Impact</span>
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 72px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Built to scale.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>Priced for everyone.</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* cost */}
          <Reveal>
            <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "40px", background: "rgba(255,255,255,0.02)", gridColumn: "span 1" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Hardware BOM — Full Unit</p>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 72, color: "#34D399", lineHeight: 1, marginBottom: 32 }}>&lt;₹3,000</div>
              {[
                ["ESP32-S3 Module", "~₹400", 40],
                ["MAX30102 SpO₂", "~₹180", 18],
                ["MPU6050 IMU", "~₹80", 8],
                ["EMG BioAmp", "~₹350", 35],
                ["PCB + Assembly", "~₹600", 60],
                ["Enclosure + Straps", "~₹500", 50],
              ].map(([item, cost, pct]) => (
                <div key={item} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{item}</span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{cost}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                      style={{ height: "100%", background: "linear-gradient(90deg,#34D399,#059669)", borderRadius: 100 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* SDGs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { code: "SDG 3", title: "Good Health & Well-Being", desc: "Proactive, real-time injury prevention making sports science accessible to every athlete — not just elite squads.", color: "#34D399", bg: "rgba(52,211,153,0.07)" },
              { code: "SDG 9", title: "Industry & Innovation", desc: "Affordable IoT + ML stack that democratises professional-grade wearable analytics for schools, colleges, and grassroots clubs.", color: "#60A5FA", bg: "rgba(96,165,250,0.07)" },
              { code: "SDG 10", title: "Reduced Inequalities", desc: "Under ₹3,000 per device brings championship-level injury monitoring to athletes who cannot afford commercial systems.", color: "#F472B6", bg: "rgba(244,114,182,0.07)" },
            ].map((s, i) => (
              <Reveal key={s.code} delay={i * 0.1}>
                <div style={{ border: `1px solid ${s.color}22`, borderRadius: 20, padding: "28px 28px", background: s.bg, display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 13, color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}40`, borderRadius: 8, padding: "4px 10px", whiteSpace: "nowrap", marginTop: 2, letterSpacing: "0.05em" }}>{s.code}</div>
                  <div>
                    <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#fff", margin: "0 0 6px" }}>{s.title}</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Demo ────────────────────────────────────────────────────────────────── */
function Demo() {
  return (
    <section id="demo" style={{ background: "#06060A", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#E63946" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#E63946", textTransform: "uppercase", letterSpacing: "0.12em" }}>Live Demo</span>
            <div style={{ width: 32, height: 1, background: "#E63946" }} />
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em", textAlign: "center" }}>See it in action.</h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 15, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 56 }}>Real hardware. Real data. Real prediction.</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

            {/* Portrait — Wearable close-up */}
            <div style={{ flex: "0 0 auto", width: "clamp(200px, 28%, 320px)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E63946", opacity: 0.8 }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", opacity: 0.8 }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", opacity: 0.8 }} />
                </div>
                <video
                  src="/video1.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", display: "block", background: "#000" }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#fff", margin: "0 0 4px" }}>Wearable in Use</p>
                <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Hardware prototype on-body</p>
              </div>
            </div>

            {/* Landscape — App / System demo */}
            <div style={{ flex: "1 1 0", minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E63946", opacity: 0.8 }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", opacity: 0.8 }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", opacity: 0.8 }} />
                </div>
                <video
                  src="/video2.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", display: "block", background: "#000" }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "#fff", margin: "0 0 4px" }}>System in Use</p>
                <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>App, sensors & live data pipeline</p>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Team ────────────────────────────────────────────────────────────────── */
function Team() {
  return (
    <section style={{ background: "#080810", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: "#FBBF24" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#FBBF24", textTransform: "uppercase", letterSpacing: "0.12em" }}>The Team</span>
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", color: "#fff", margin: "0 0 64px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Atomic Minds.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>We build and ship.</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { role: "Hardware Engineer", icon: "⚙", color: "#00D4FF", sub: "ESP32-S3, sensor integration & PCB design" },
            { role: "ML Engineer", icon: "◈", color: "#A78BFA", sub: "LSTM model training & real-time inference pipeline" },
            { role: "Flutter Developer", icon: "◇", color: "#F472B6", sub: "7-screen app, BLE integration & cloud data sync" },
            { role: "System Architect", icon: "⬡", color: "#FBBF24", sub: "MQTT, cloud infra, end-to-end system design" },
          ].map((m, i) => (
            <Reveal key={m.role} delay={i * 0.08}>
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "32px 28px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ fontSize: 28, color: m.color, marginBottom: 16 }}>{m.icon}</div>
                <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#fff", margin: "0 0 8px" }}>{m.role}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>{m.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section style={{ background: "#06060A", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(230,57,70,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Reveal className="relative z-10">
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Bebas Neue", fontSize: "clamp(56px,8vw,100px)", color: "#fff", lineHeight: 0.95, letterSpacing: "0.01em", margin: "0 0 24px" }}>
            READY TO<br />
            <span style={{ color: "#E63946" }}>PROTECT</span><br />
            YOUR ATHLETES?
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 40 }}>
            Mento is a complete, working system — hardware prototype, mobile app, AI model, and cloud backend. Built by Team Atomic Minds.
          </p>
          <a href="#demo" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#E63946", color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15, padding: "16px 40px", borderRadius: 100, textDecoration: "none", boxShadow: "0 0 60px rgba(230,57,70,0.4)", letterSpacing: "0.02em" }}>
            ▶ Watch the Demo
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#06060A", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#E63946,#FF6B35)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <img src="/Atomic minds logo.webp" alt="Atomic Minds" style={{ height: 32, width: "auto", objectFit: "contain", background: "#fff", padding: "2px 4px", borderRadius: 4 }} />
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, color: "#fff", marginLeft: 4 }}>Mento</span>
          <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "rgba(255,255,255,0.25)", marginLeft: 4 }}>Smart Wearable</span>
        </div>
        <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          Developed by <strong style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Atomic Minds</strong>
        </p>
      </div>
    </footer>
  );
}

/* ── Validation / Proof ──────────────────────────────────────────────────── */
function Proof() {
  return (
    <section style={{ background: "#06060A", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, justifyContent: "center" }}>
            <div style={{ width: 32, height: 1, background: "#00D4FF" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#00D4FF", textTransform: "uppercase", letterSpacing: "0.12em" }}>Validation</span>
            <div style={{ width: 32, height: 1, background: "#00D4FF" }} />
          </div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(32px,5vw,48px)", color: "#fff", textAlign: "center", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Not just an idea.<br /><span style={{ color: "rgba(255,255,255,0.25)" }}>A working prototype.</span>
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 16, color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 }}>
            Mentored by experts and showcased live at the Smart India Hackathon (SIH) Finals.
          </p>
          <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 80px rgba(0,0,0,0.5)", maxWidth: 500, margin: "0 auto" }}>
            <img src="/proto-team.jpeg" alt="Team showcasing prototype at SIH Finals" style={{ width: "100%", height: "auto", display: "block", maxHeight: 500, objectFit: "cover" }} />
          </div>

          {/* Use cases beyond prevention */}
          <div style={{ marginTop: 80 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontFamily: "DM Sans", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>What else it solves</span>
                <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.2)" }} />
              </div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 36px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Prevention is just the start.
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                {
                  num: "01",
                  color: "#34D399",
                  title: "Rehabilitation",
                  sub: "Track recovery, not just time.",
                  desc: "After injury, Mento's EMG and IMU data maps how muscles and joints reload during physiotherapy — so you know when an athlete is truly ready to return, not just when they feel ready.",
                },
                {
                  num: "02",
                  color: "#60A5FA",
                  title: "Recovery Monitoring",
                  sub: "Rest smarter. Train harder.",
                  desc: "HRV, SpO₂ patterns, and overnight muscle load data tell you whether an athlete recovered from yesterday — or is carrying stress into today's session. Optimise rest days with actual numbers, not guesses.",
                },
                {
                  num: "03",
                  color: "#A78BFA",
                  title: "Return-to-Sport Clearance",
                  sub: "Data says when — not gut feel.",
                  desc: "Doctors clear athletes on time, not tissue state. Mento's movement symmetry score shows whether the injured limb is loading and firing like the healthy one — before the athlete steps back on the field.",
                },
                {
                  num: "04",
                  color: "#FBBF24",
                  title: "Overtraining Prevention",
                  sub: "Injuries are built over weeks.",
                  desc: "Most tears don't come from one bad session — they come from four days of accumulated EMG stress no coach ever saw. Mento's rolling risk score catches that build-up before it becomes a breakdown.",
                },
                {
                  num: "05",
                  color: "#E63946",
                  title: "Performance Optimisation",
                  sub: "Benchmark. Adjust. Improve.",
                  desc: "Six-axis radar scoring against peer and pro athlete benchmarks shows exactly where technique and load management can be tightened — so training effort goes where it actually converts to performance.",
                },
                {
                  num: "06",
                  color: "#F97316",
                  title: "Grassroots Access",
                  sub: "Pro-grade insight. ₹3K price.",
                  desc: "College squads and district clubs don't have physiologists on the bench. Mento's AI Coach delivers the same pattern recognition elite teams pay lakhs for — at a cost every school can actually afford.",
                },
              ].map((u) => (
                <div key={u.num} style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "32px 28px", background: "rgba(255,255,255,0.015)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${u.color}, transparent)` }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <span style={{ fontFamily: "Bebas Neue", fontSize: 13, color: u.color, background: `${u.color}18`, border: `1px solid ${u.color}40`, borderRadius: 6, padding: "3px 9px", letterSpacing: "0.06em" }}>{u.num}</span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{u.sub}</span>
                  </div>
                  <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 17, color: u.color, margin: "0 0 12px", letterSpacing: "-0.01em", textShadow: `0 0 24px ${u.color}55` }}>{u.title}</p>
                  <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Root ────────────────────────────────────────────────────────────────── */
export default function MentoShowcase() {
  return (
    <div style={{ background: "#06060A", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <AppScreens />
      <Impact />
      <Demo />
      <Team />
      <Proof />
      <CTA />
      <Footer />
    </div>
  );
}
