/**
 * Orbital Noir design system: cinematic science-fiction editorialism with asymmetrical copy,
 * night-indigo space, restrained arachnid-red accents, and purposeful orbital motion.
 */
import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Headphones,
  Menu,
  Mouse,
  Orbit,
  Radio,
  Send,
  Sparkles,
  Telescope,
  Volume2,
  X,
} from "lucide-react";

const markUrl = "/assets/orbital-spider-mark.png";
const authSpiderUrl = "/assets/white-highkey-webslinger-cutout.png";
const heroGalaxyUrl = "/assets/ufo-milkyway-observatory.jpg";
const galaxyTextureUrl = "/assets/spider-verse-milkyway-hero.jpg";

const worlds = [
  { code: "EARTH-1610", title: "Brooklyn Signal", body: "A home-frequency full of first leaps, improvised heroics, and a spider that changed the channel.", detail: "Miles Morales' Brooklyn is an alive, chromatic city where every leap starts with a choice and every rooftop carries a new signal.", signature: "VENOM PULSE", visual: "brooklyn" },
  { code: "EARTH-65", title: "Gwen’s Frequency", body: "A drummer’s pulse beneath a watercolor skyline where one spider bite bends the whole score.", detail: "Gwen Stacy's world paints emotion directly into the skyline: soft washes, hard drumbeats, and a city that changes color with its hero.", signature: "WATERCOLOR WAVE", visual: "gwen" },
  { code: "EARTH-928", title: "Nueva York", body: "An elevated future-city where order is monitored, anomalies are archived, and every portal leaves a trace.", detail: "Miguel O'Hara's Nueva York runs on vertical motion, archive logic, and a future skyline where the Spider-Society watches every dimensional fracture.", signature: "LYLA GRID", visual: "nueva" },
  { code: "EARTH-42", title: "Prowler Night", body: "A city without its Spider-Man, tuned to a darker frequency and an alternate Miles with sharp edges.", detail: "Earth-42 is Brooklyn after a missing spider-bite changes the whole equation. Its purple nightscape is tense, resilient, and still waiting for its turn to swing.", signature: "PURPLE STATIC", visual: "prowler" },
  { code: "EARTH-50101", title: "Mumbattan", body: "A gravity-bending skyline where Mumbai and Manhattan share one exhilarating, impossible horizon.", detail: "Pavitr Prabhakar's Mumbattan folds bright color, vertical trains, and playful physics into a metropolis that feels built to be crossed by web.", signature: "CANON THREAD", visual: "mumbattan" },
  { code: "EARTH-138", title: "Punk Frequency", body: "A cut-and-paste London riot powered by guitar feedback, ink splatter, and Hobie Brown's refusal to conform.", detail: "Earth-138 breaks its own frame on purpose. Every collage edge and poster tear becomes a signal that the web can always be remixed.", signature: "AMP DISTORTION", visual: "punk" },
  { code: "EARTH-90214", title: "Noir City", body: "A black-and-white metropolis of rain, hard shadows, and a detective who never stops listening for trouble.", detail: "Spider-Man Noir's world filters the multiverse through film grain and noir instincts, turning every street lamp into a warning and every shadow into a question.", signature: "MONOCHROME TRACE", visual: "noir" },
  { code: "EARTH-14512", title: "SP//dr Sector", body: "A neon-mecha dimension where Peni Parker syncs heart and machine to protect a hypercharged city.", detail: "Peni's universe merges organic feeling with engineered defense. Its signal is sharp, bright, and always one step away from a giant mechanical swing.", signature: "NEURAL LINK", visual: "spdr" },
  { code: "EARTH-13122", title: "Brickline Sector", body: "A modular city where every wall can rebuild itself and one LEGO Spider-Man keeps the pieces moving.", detail: "Brickline Sector turns the web into a toybox of infinite construction: compact, colorful, and always ready to snap into a new configuration.", signature: "STUD ALIGNMENT", visual: "brick" },
];

const missions = [
  ["01", "Trace anomalies", "Map the places where dimensional signatures flare bright enough to cross a web.", "EXOPLANETS"],
  ["02", "Follow the thread", "Study the choices that turn ordinary people into dimensional constants.", "EXPLORATION"],
  ["03", "Hold the line", "Keep the canon alive without forgetting that every universe deserves room to move.", "FACTS"],
];

function playThwip() {
  try {
    const context = new AudioContext();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(780, now);
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    window.setTimeout(() => context.close(), 350);
  } catch {
    // Audio is optional; visual feedback remains available when a browser blocks synthesis.
  }
}

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [planetSlide, setPlanetSlide] = useState(0);
  const [selectedWorld, setSelectedWorld] = useState<(typeof worlds)[number] | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const detailPlanetRef = useRef<HTMLDivElement>(null);
  const carouselPointerRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!selectedWorld) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedWorld(null);
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedWorld]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!cursorReady) setCursorReady(true);
    cursorRef.current?.style.setProperty(
      "transform",
      `translate3d(${event.clientX}px, ${event.clientY}px, 0)`,
    );
  };

  const throwWeb = (event: PointerEvent<HTMLDivElement>) => {
    const shot = shotRef.current;
    if (!shot) return;
    shot.style.left = `${event.clientX}px`;
    shot.style.top = `${event.clientY}px`;
    shot.classList.remove("is-thrown");
    void shot.offsetWidth;
    shot.classList.add("is-thrown");
    playThwip();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      window.setTimeout(() => document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" }), 60);
    }, 1650);
  };

  const toggleMusic = () => {
    if (musicOn) {
      if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
      audioContextRef.current?.close();
      audioContextRef.current = null;
      setMusicOn(false);
      return;
    }

    setMusicOn(true);
    try {
      const context = new AudioContext();
      audioContextRef.current = context;
      const pulse = () => {
        const now = context.currentTime;
        const notes = [146.83, 174.61, 220];
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = index === 0 ? "sine" : "triangle";
          oscillator.frequency.setValueAtTime(frequency, now + index * 0.075);
          gain.gain.setValueAtTime(0.0001, now + index * 0.075);
          gain.gain.exponentialRampToValueAtTime(0.025, now + index * 0.075 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.075 + 0.58);
          oscillator.connect(gain).connect(context.destination);
          oscillator.start(now + index * 0.075);
          oscillator.stop(now + index * 0.075 + 0.62);
        });
      };
      pulse();
      musicTimerRef.current = window.setInterval(pulse, 1400);
    } catch {
      // Some preview browsers block Web Audio. The visual pulse still confirms the selected state.
    }
  };

  const tiltPlanet = (event: PointerEvent<HTMLDivElement>) => {
    const target = detailPlanetRef.current;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    target.style.setProperty("--tilt-x", `${-10 - y * 20}deg`);
    target.style.setProperty("--tilt-y", `${16 + x * 34}deg`);
  };

  const resetPlanetTilt = () => {
    detailPlanetRef.current?.style.removeProperty("--tilt-x");
    detailPlanetRef.current?.style.removeProperty("--tilt-y");
  };

  return (
    <div className="galaxy-site" onPointerMove={handlePointerMove} onPointerDown={throwWeb}>
      <div ref={cursorRef} className={`web-cursor ${cursorReady ? "is-visible" : ""}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div ref={shotRef} className="thrown-web" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      {!connected && (
        <section className="auth-stage" aria-label="Spider-Verse Galaxy entrance">
          <div className="auth-galaxy" />
          <div className="auth-grain" />
          <a className="auth-brand" href="#top" aria-label="Spider-Verse Galaxy home">
            <img src={markUrl} alt="" />
            <span><b>SPIDER / VERSE</b><small>GALAXY OBSERVATORY</small></span>
          </a>

          <div className="auth-panel">
            <p className="eyebrow"><Radio size={13} /> SIGNAL // 08-616</p>
            <h1>{isSignup ? "Build your portal pass." : "Your universe just gained a signal."}</h1>
            <p className="auth-intro">
              {isSignup
                ? "Choose a frequency. We will keep your coordinates ready for the next anomaly."
                : "Sign in to find the signal hiding between the stars and your next swing."}
            </p>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <label>
                  <span>Call sign</span>
                  <input type="text" placeholder="Miles / Gwen / You" required />
                </label>
              )}
              <label>
                <span>Email frequency</span>
                <input type="email" placeholder="you@multiverse.space" required />
              </label>
              <label>
                <span>Secure webline</span>
                <input type="password" placeholder="••••••••••" minLength={6} required />
              </label>
              <button className="signal-button" type="submit">
                <span>{isSignup ? "Open my portal" : "Connect to the signal"}</span>
                <ArrowUpRight size={17} />
              </button>
            </form>

            <p className="auth-switch">
              {isSignup ? "Already have a frequency?" : "New to this dimension?"}
              <button type="button" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Sign in" : "Create a pass"}
              </button>
            </p>
            <p className="auth-note"><Crosshair size={13} /> Your coordinates stay in this local dimension.</p>
          </div>

          <div className="auth-photo-wrap" aria-hidden="true">
            <div className="auth-photo-halo" />
            <div className="auth-instruments">
              <div className="auth-scope-line"><i /><b /></div>
              <div className="auth-reticle"><span /><span /><span /><span /></div>
              <div className="auth-reading">TARGET LOCK // WEB-01<br />MOONLIT CAPTURE // STABLE</div>
            </div>
            <img className="auth-spider" src={authSpiderUrl} alt="" />
            <div className="photo-coordinate coord-one">40° 42′ 46″ N</div>
            <div className="photo-coordinate coord-two">MULTI / 01</div>
          </div>
        </section>
      )}

      {connecting && (
        <div className="connection-splash" role="status" aria-live="polite">
          <div className="splash-starfield" />
          <svg className="splash-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M7 75 L24 57 L47 68 L63 35 L88 18" />
            <path d="M24 57 L35 21 L63 35 L83 72" />
            <path d="M47 68 L68 82 L83 72" />
          </svg>
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((dot) => <i key={dot} className={`splash-dot ${dot}`} />)}
          <div className="connection-copy">
            <Sparkles size={18} />
            <p>CONNECTING THREADS</p>
            <strong>Synchronizing the universe</strong>
          </div>
        </div>
      )}

      {connected && (
        <main id="top" className="experience-shell">
          <header className="site-nav">
            <a className="nav-brand" href="#home" aria-label="Spider-Verse Galaxy home">
              <img src={markUrl} alt="" />
              <span>SPIDER / VERSE<br /><small>GALAXY</small></span>
            </a>
            <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
              <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#exoplanets" onClick={() => setMenuOpen(false)}>Exoplanets</a>
              <a href="#exploration" onClick={() => setMenuOpen(false)}>Exploration</a>
              <a href="#facts" onClick={() => setMenuOpen(false)}>Facts</a>
              <button className="mobile-music" type="button" onClick={toggleMusic}><Volume2 size={15} /> {musicOn ? "Mute pulse" : "Play pulse"}</button>
            </nav>
            <button className={`pulse-button ${musicOn ? "playing" : ""}`} type="button" onClick={toggleMusic} aria-label={musicOn ? "Mute ambient pulse" : "Play ambient pulse"}>
              {musicOn ? <Volume2 size={17} /> : <Headphones size={17} />}
              <span>{musicOn ? "PULSE ON" : "PULSE"}</span>
            </button>
            <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </header>

          <section id="home" className="hero-section">
            <div className="hero-image" style={{ backgroundImage: `url(${heroGalaxyUrl})` }} />
            <div className="hero-overlay" />
            <div className="hero-grid" />
            <div className="hero-copy">
              <p className="eyebrow"><Orbit size={14} /> OBSERVATORY / HOME VECTOR</p>
              <h1>There’s a<br /><em>whole universe</em><br />to swing through.</h1>
              <p className="hero-lede">Follow the signals where Spider-heroes meet distant worlds, impossible tech, and galaxies bigger than any one canon.</p>
              <div className="hero-actions">
                <a href="#exoplanets" className="signal-button">Explore exoplanets <ArrowUpRight size={17} /></a>
                <a href="#facts" className="text-link">Read the field notes <ChevronRight size={15} /></a>
              </div>
            </div>
            <div className="observatory-assembly" aria-hidden="true">
              <div className="radio-antenna"><span /><b /><i /></div>
              <div className="telescope-model"><div className="scope" /><div className="mount" /><div className="leg l1" /><div className="leg l2" /><div className="leg l3" /></div>
              <div className="hero-web"><i /><i /><i /><i /><i /><i /></div>
              <div className="asteroid"><span /></div>
              <p className="instrument-label label-a">WAVELENGTH // 649 NM</p>
              <p className="instrument-label label-b">OBJECT // UNTRACKED</p>
            </div>
            <a className="scroll-cue" href="#exoplanets" aria-label="Scroll to exoplanets">
              <Mouse size={18} />
              <span>SCROLL TO TRACE</span>
              <ArrowDown size={16} />
            </a>
          </section>

          <section id="exoplanets" className="worlds-section section-shell">
            <div className="section-kicker"><span>01</span> EXOPLANETS / KNOWN FREQUENCIES</div>
            <div className="worlds-heading carousel-heading">
              <h2>Nine worlds.<br /><em>One fractured web.</em></h2>
              <p>Trace three signals at a time, then open any coordinate to explore a living, interactive world model.</p>
            </div>
            <div className="planet-carousel" aria-label="Spider-Verse world carousel">
              <div className="carousel-toolbar">
                <p><span>{String(planetSlide + 1).padStart(2, "0")}</span> / 03 TRANSMISSION SETS</p>
                <div className="carousel-controls">
                  <button type="button" onPointerDown={(event) => { event.stopPropagation(); carouselPointerRef.current = true; setPlanetSlide((currentSlide) => (currentSlide + 2) % 3); }} onClick={(event) => { event.stopPropagation(); if (!carouselPointerRef.current) setPlanetSlide((currentSlide) => (currentSlide + 2) % 3); carouselPointerRef.current = false; }} aria-label="Previous three worlds"><ChevronLeft size={19} /></button>
                  <button type="button" onPointerDown={(event) => { event.stopPropagation(); carouselPointerRef.current = true; setPlanetSlide((currentSlide) => (currentSlide + 1) % 3); }} onClick={(event) => { event.stopPropagation(); if (!carouselPointerRef.current) setPlanetSlide((currentSlide) => (currentSlide + 1) % 3); carouselPointerRef.current = false; }} aria-label="Next three worlds"><ChevronRight size={19} /></button>
                </div>
              </div>
              <div className="carousel-window">
                <div className="carousel-track" style={{ transform: `translateX(-${planetSlide * 100}%)` }}>
                  {[0, 1, 2].map((group) => (
                    <div className="planet-slide" key={group}>
                      {worlds.slice(group * 3, group * 3 + 3).map((world, index) => (
                        <button className={`planet-card planet-${world.visual}`} type="button" key={world.code} onClick={() => setSelectedWorld(world)}>
                          <span className="planet-card-number">{String(group * 3 + index + 1).padStart(2, "0")}</span>
                          <div className="planet-sphere" aria-hidden="true"><i /><b /></div>
                          <div className="planet-card-copy"><p className="eyebrow">{world.code}</p><h3>{world.title}</h3><span>{world.body}</span></div>
                          <span className="planet-open">OPEN WORLD <ArrowUpRight size={14} /></span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="exploration" className="exploration-section">
            <div className="exploration-image" style={{ backgroundImage: `url(${galaxyTextureUrl})` }} />
            <div className="exploration-overlay" />
            <div className="section-shell exploration-layout">
              <div className="exploration-intro">
                <p className="section-kicker"><span>02</span> EXPLORATION / WEB OF LIFE</p>
                <h2>Not every signal<br />wants to be <em>found.</em></h2>
                <p>Chart a course through portal scars, hero history, and the strange science that holds a multiverse together.</p>
                <a href="#facts" className="signal-button">Start a field route <Send size={16} /></a>
              </div>
              <div className="mission-list">
                {missions.map(([number, title, body, tag]) => (
                  <article className="mission-row" key={number}>
                    <span>{number}</span>
                    <div><p>{tag}</p><h3>{title}</h3><small>{body}</small></div>
                    <ArrowUpRight size={19} />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="facts" className="facts-section section-shell">
            <div className="facts-topline">
              <p className="section-kicker"><span>03</span> FIELD NOTES / QUICK FACTS</p>
              <a href="#home" className="back-link">Return to the sky <ArrowUpRight size={15} /></a>
            </div>
            <div className="facts-layout">
              <h2>The web is not a cage.<br /><em>It is a map.</em></h2>
              <div className="fact-entries">
                <article><b>01</b><div><h3>Canonical events are pressure points</h3><p>Some turning points recur because they test how a hero chooses to hold a world together.</p></div></article>
                <article><b>02</b><div><h3>Dimensional travel has a rhythm</h3><p>Glitches, portals, and collider tech are visual signals that one universe is listening to another.</p></div></article>
                <article><b>03</b><div><h3>Every mask changes the constellation</h3><p>A Spider-hero can be a student, a drummer, a futurist, or a rebel—the responsibility is the shared signal.</p></div></article>
              </div>
            </div>
          </section>

          <footer className="site-footer">
            <div className="footer-orbit" />
            <div className="footer-top section-shell">
              <a className="footer-brand" href="#home"><img src={markUrl} alt="" /><span>SPIDER / VERSE<br /><small>GALAXY OBSERVATORY</small></span></a>
              <p>Built for curious minds swinging between science, story, and the spaces in between.</p>
              <a className="signal-button footer-cta" href="#home">Rejoin the signal <ArrowUpRight size={16} /></a>
            </div>
            <div className="footer-bottom section-shell">
              <span>© 2026 SPIDER-VERSE GALAXY</span>
              <div><a href="#home">Home</a><a href="#exoplanets">Exoplanets</a><a href="#exploration">Exploration</a><a href="#facts">Facts</a></div>
              <span>FAN FIELD STUDY // 08-616</span>
            </div>
          </footer>

          {selectedWorld && (
            <div className="world-dialog-backdrop" role="presentation" onPointerDown={() => setSelectedWorld(null)}>
              <article className={`world-dialog planet-${selectedWorld.visual}`} role="dialog" aria-modal="true" aria-labelledby="world-dialog-title" onPointerDown={(event) => event.stopPropagation()}>
                <button className="world-dialog-close" type="button" onClick={() => setSelectedWorld(null)} aria-label="Close world detail"><X size={20} /></button>
                <div className="world-dialog-copy">
                  <p className="eyebrow"><Crosshair size={13} /> DIMENSIONAL READOUT // {selectedWorld.code}</p>
                  <h2 id="world-dialog-title">{selectedWorld.title}</h2>
                  <p>{selectedWorld.detail}</p>
                  <div className="world-readouts"><span>HOME SIGNAL <b>{selectedWorld.code}</b></span><span>KEY TRACE <b>{selectedWorld.signature}</b></span></div>
                  <p className="planet-instruction">MOVE ACROSS THE PLANET TO TILT THE ORBITAL MODEL</p>
                </div>
                <div className="detail-planet-stage" ref={detailPlanetRef} onPointerMove={tiltPlanet} onPointerLeave={resetPlanetTilt}>
                  <div className="interactive-planet"><div className="planet-sphere"><i /><b /></div><span className="planet-orbit orbit-one" /><span className="planet-orbit orbit-two" /><span className="planet-scan" /></div>
                </div>
              </article>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
