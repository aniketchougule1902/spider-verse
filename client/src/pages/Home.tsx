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
  Download,
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
import Globe3D, { type GlobeMaterialProfile } from "@/components/Globe3D";

const authSpiderUrl = "/assets/white-highkey-webslinger-cutout.png";
const managedAuthSpiderFallbackUrl = "/manus-storage/white-highkey-webslinger-cutout-v2_8fd40822.png";
const heroGalaxyUrl = "/manus-storage/ufo-milkyway-observatory_66054443.jpg";
const galaxyTextureUrl = "/manus-storage/spider-verse-milkyway-hero_84834daa.jpg";

const worlds = [
  { code: "ORBIT // 01", title: "Aurelia", body: "A gold-lit world with a volatile upper atmosphere and long, quiet daybreaks.", detail: "Aurelia is a simulated inner-rim discovery: warm cloud bands, sudden auroras, and a horizon that glows like a fresh webline at dawn.", signature: "AURORA GLINT", origin: "INNER MILKY WAY", distance: "4.2 × 10¹³ km", visual: "aurelia" },
  { code: "ORBIT // 02", title: "Noctis Ring", body: "A midnight planet circled by dust rings that fracture starlight into blue-black ribbons.", detail: "Noctis Ring turns every approach into a night flight. Its reflective halo is ideal for tracing faint anomaly signatures across the Milky Way.", signature: "OBSIDIAN HALO", origin: "INNER MILKY WAY", distance: "5.7 × 10¹³ km", visual: "noctis" },
  { code: "ORBIT // 03", title: "Solara Nexus", body: "A bright desert sphere threaded with solar mirrors and magnetic storms.", detail: "Solara Nexus catches more light than its charted orbit should allow, making it a high-contrast marker for Akashganga field crews.", signature: "SOLAR ARC", origin: "SCUTUM ARM", distance: "7.9 × 10¹³ km", visual: "solara" },
  { code: "ORBIT // 04", title: "Mistral Bloom", body: "A soft violet gas-world where wind currents create petals large enough to chart.", detail: "Mistral Bloom is a painterly atmosphere in motion. Its endless weather roses carry data streams through a lavender sky.", signature: "VIOLET DRAFT", origin: "ORION SPUR", distance: "8.6 × 10¹³ km", visual: "mistral" },
  { code: "ORBIT // 05", title: "Ember Veil", body: "A coal-red rocky world wrapped in an electric ember mist.", detail: "Ember Veil has a restless surface and a stubborn heat signature. Its distant glow makes a reliable waypoint beyond the local dust lanes.", signature: "CINDER STATIC", origin: "PERSEUS ARM", distance: "9.4 × 10¹³ km", visual: "ember" },
  { code: "ORBIT // 06", title: "Cobalt Halo", body: "A cobalt ocean planet with an ice-bright ring of frozen spray.", detail: "Cobalt Halo reflects its home star in layered blue gradients. When its polar ring tilts, the planet reads like an orbital lens.", signature: "ICE LENS", origin: "ORION SPUR", distance: "1.1 × 10¹⁴ km", visual: "cobalt" },
  { code: "ORBIT // 07", title: "Verdant Echo", body: "A green-blue superworld alive with luminous storm forests.", detail: "Verdant Echo turns deep-space radio noise into patterned flashes across its cloud cover, making it feel almost like a planet answering back.", signature: "BIO LUMEN", origin: "SAGITTARIUS ARM", distance: "1.3 × 10¹⁴ km", visual: "verdant" },
  { code: "ORBIT // 08", title: "Ibis Rift", body: "A narrow crimson planet split by a continent-long rift of reflected magma.", detail: "Ibis Rift is a sharp red punctuation mark against a dark field. Its cracked surface amplifies every scan and makes dimensional readings easier to compare.", signature: "RIFT ECHO", origin: "CARINA ARM", distance: "1.5 × 10¹⁴ km", visual: "ibis" },
  { code: "ORBIT // 09", title: "Fable Orbit", body: "A storybook moon-world whose pale clouds loop in impossible spirals.", detail: "Fable Orbit holds soft white storms in a slow gravitational dance. It is the kind of world that makes a navigation chart feel hand drawn.", signature: "CLOUD THREAD", origin: "ORION SPUR", distance: "1.7 × 10¹⁴ km", visual: "fable" },
  { code: "ORBIT // 10", title: "Quartz Tide", body: "A silver shoreline planet where mineral tides flash against a dark sea.", detail: "Quartz Tide catches distant starlight in bright metallic swells. Field teams use its rhythmic glints to calibrate long-range web beacons.", signature: "SILVER TIDE", origin: "OUTER DISK", distance: "2.0 × 10¹⁴ km", visual: "quartz" },
  { code: "ORBIT // 11", title: "Nebula Nara", body: "A rose-cloud planet suspended inside the glow of a diffuse stellar nursery.", detail: "Nebula Nara lives inside a haze of newborn stars. Its atmosphere absorbs and re-emits color in a rolling pink signal.", signature: "ROSE HAZE", origin: "CYGNUS ARM", distance: "2.4 × 10¹⁴ km", visual: "nara" },
  { code: "ORBIT // 12", title: "Crimson Lumen", body: "A deep red giant with a flickering bright-side pulse every forty minutes.", detail: "Crimson Lumen behaves like a cosmic warning light. Its timed flare helps Akashganga distinguish a stable route from a noisy one.", signature: "PULSE BEACON", origin: "PERSEUS ARM", distance: "2.8 × 10¹⁴ km", visual: "crimson" },
  { code: "ORBIT // 13", title: "Aster Vault", body: "A pale ceramic planet locked beneath a vault of crystalline auroras.", detail: "Aster Vault is cool, quiet, and almost architectural. Its geometric light bands make it a clean reference for planetary tilt simulations.", signature: "CRYSTAL ARC", origin: "OUTER DISK", distance: "3.2 × 10¹⁴ km", visual: "aster" },
  { code: "ORBIT // 14", title: "Pollen Arc", body: "A bright citrus world that scatters star dust into its yellow-green sky.", detail: "Pollen Arc is small but unforgettable, casting a warm grainy halo that makes it easy to find across the larger Milky Way field.", signature: "GOLD DUST", origin: "SAGITTARIUS ARM", distance: "3.7 × 10¹⁴ km", visual: "pollen" },
  { code: "ORBIT // 15", title: "Glass Meridian", body: "A midnight glass sphere marked by a single mirrored equator.", detail: "Glass Meridian reflects the galactic band as a clean silver seam. It is a final horizon for this field set, calm and sharply defined.", signature: "MIRROR LINE", origin: "OUTER DISK", distance: "4.1 × 10¹⁴ km", visual: "glass" },
];

const worldMaterialProfiles: Record<string, GlobeMaterialProfile> = {
  aurelia: { surface: "#b56a24", crust: "#25130d", lava: "#ff9a31", atmosphere: "#ffd373", roughness: 0.76, metalness: 0.12, relief: 0.026, crackDensity: 0.56, lavaIntensity: 1.18, atmosphereOpacity: 0.28, seed: 11 },
  noctis: { surface: "#263b69", crust: "#070b18", lava: "#4b8aff", atmosphere: "#8fc6ff", roughness: 0.52, metalness: 0.42, relief: 0.018, crackDensity: 0.18, lavaIntensity: 0.48, atmosphereOpacity: 0.18, seed: 17 },
  solara: { surface: "#d86b1e", crust: "#341208", lava: "#ffb23d", atmosphere: "#ffe094", roughness: 0.82, metalness: 0.08, relief: 0.031, crackDensity: 0.64, lavaIntensity: 1.34, atmosphereOpacity: 0.3, seed: 23 },
  mistral: { surface: "#7860a7", crust: "#1d1738", lava: "#d396ff", atmosphere: "#d9baff", roughness: 0.46, metalness: 0.2, relief: 0.016, crackDensity: 0.22, lavaIntensity: 0.55, atmosphereOpacity: 0.32, seed: 29 },
  ember: { surface: "#8f2b1d", crust: "#1d0a08", lava: "#ff5b2e", atmosphere: "#ff7e48", roughness: 0.86, metalness: 0.06, relief: 0.036, crackDensity: 0.88, lavaIntensity: 1.72, atmosphereOpacity: 0.42, seed: 31 },
  cobalt: { surface: "#1762a5", crust: "#061d4b", lava: "#52c8ff", atmosphere: "#8fe1ff", roughness: 0.31, metalness: 0.32, relief: 0.014, crackDensity: 0.12, lavaIntensity: 0.34, atmosphereOpacity: 0.26, seed: 37 },
  verdant: { surface: "#238768", crust: "#09261f", lava: "#56d7a2", atmosphere: "#a7f0b7", roughness: 0.68, metalness: 0.1, relief: 0.022, crackDensity: 0.28, lavaIntensity: 0.64, atmosphereOpacity: 0.32, seed: 41 },
  ibis: { surface: "#9a3031", crust: "#260807", lava: "#ff4d2e", atmosphere: "#ff8e70", roughness: 0.9, metalness: 0.04, relief: 0.042, crackDensity: 0.94, lavaIntensity: 1.86, atmosphereOpacity: 0.46, seed: 43 },
  fable: { surface: "#9baac1", crust: "#26334d", lava: "#d8e6ff", atmosphere: "#e8efff", roughness: 0.38, metalness: 0.26, relief: 0.013, crackDensity: 0.1, lavaIntensity: 0.24, atmosphereOpacity: 0.24, seed: 47 },
  quartz: { surface: "#829bb1", crust: "#1d2a3e", lava: "#bcecff", atmosphere: "#e8fbff", roughness: 0.29, metalness: 0.64, relief: 0.017, crackDensity: 0.15, lavaIntensity: 0.38, atmosphereOpacity: 0.2, seed: 53 },
  nara: { surface: "#b74d7c", crust: "#321126", lava: "#ff8fc7", atmosphere: "#ffbddd", roughness: 0.56, metalness: 0.14, relief: 0.02, crackDensity: 0.3, lavaIntensity: 0.66, atmosphereOpacity: 0.4, seed: 59 },
  crimson: { surface: "#8f2331", crust: "#210709", lava: "#ff3d45", atmosphere: "#ff766f", roughness: 0.84, metalness: 0.08, relief: 0.033, crackDensity: 0.78, lavaIntensity: 1.48, atmosphereOpacity: 0.4, seed: 61 },
  aster: { surface: "#a9acb8", crust: "#263148", lava: "#e7f6ff", atmosphere: "#d9e7ff", roughness: 0.34, metalness: 0.5, relief: 0.018, crackDensity: 0.13, lavaIntensity: 0.3, atmosphereOpacity: 0.21, seed: 67 },
  pollen: { surface: "#c7891c", crust: "#352405", lava: "#ffd543", atmosphere: "#fff0a6", roughness: 0.72, metalness: 0.1, relief: 0.025, crackDensity: 0.4, lavaIntensity: 0.94, atmosphereOpacity: 0.31, seed: 71 },
  glass: { surface: "#263b57", crust: "#07101d", lava: "#75bff5", atmosphere: "#c9edff", roughness: 0.12, metalness: 0.78, relief: 0.01, crackDensity: 0.08, lavaIntensity: 0.22, atmosphereOpacity: 0.17, seed: 73 },
};

const planetSetCount = Math.ceil(worlds.length / 3);

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
  const [planetsInView, setPlanetsInView] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState<(typeof worlds)[number] | null>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const planetsSectionRef = useRef<HTMLElement>(null);
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
    if (!selectedWorld && !downloadOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedWorld(null); setDownloadOpen(false); }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedWorld, downloadOpen]);

  useEffect(() => {
    const section = planetsSectionRef.current;
    if (!section || !connected) return;
    const observer = new IntersectionObserver(([entry]) => setPlanetsInView(entry.isIntersecting), { threshold: 0.42 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [connected]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!cursorReady) setCursorReady(true);
    cursorRef.current?.style.setProperty(
      "transform",
      `translate3d(${event.clientX}px, ${event.clientY}px, 0)`,
    );
  };

  const throwWeb = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button, a, input, label, select, textarea")) return;
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
        <section className="auth-stage" aria-label="Akashganga entrance">
          <div className="auth-galaxy" />
          <div className="auth-grain" />
          <a className="auth-brand" href="#top" aria-label="Akashganga home">
            <span className="akashganga-logo" aria-hidden="true"><i /><i /><i /></span>
            <span><b>AKASHGANGA</b><small>MILKY WAY FIELD LAB</small></span>
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
            <img
              className="auth-spider"
              src={authSpiderUrl}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = managedAuthSpiderFallbackUrl;
              }}
            />
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
            <a className="nav-brand" href="#home" aria-label="Akashganga home">
              <span className="akashganga-logo" aria-hidden="true"><i /><i /><i /></span>
              <span>AKASHGANGA<br /><small>MILKY WAY FIELD LAB</small></span>
            </a>
            <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
              <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#exoplanets" onClick={() => setMenuOpen(false)}>Exoplanets</a>
              <a href="#exploration" onClick={() => setMenuOpen(false)}>Exploration</a>
              <a href="#facts" onClick={() => setMenuOpen(false)}>Facts</a>
              <a href="#download-app" onClick={(event) => { event.preventDefault(); setDownloadOpen(true); setMenuOpen(false); }}>Download app</a>
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
                <button type="button" className="signal-button" onClick={() => setDownloadOpen(true)}><Download size={17} /> Download app</button>
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

          <section id="exoplanets" ref={planetsSectionRef} className={`worlds-section section-shell ${planetsInView ? "planets-in-view" : ""}`}>
            <div className="section-kicker"><span>01</span> EXOPLANETS / KNOWN FREQUENCIES</div>
            <div className="worlds-heading carousel-heading">
              <h2>Milky Way worlds.<br /><em>One living orbit.</em></h2>
              <p>Trace three planets at a time, then open any signal to tilt a living 3D model with your cursor or touch.</p>
            </div>
            <div className="planet-carousel" aria-label="Spider-Verse world carousel">
              <div className="carousel-toolbar">
                <p><span>{String(planetSlide + 1).padStart(2, "0")}</span> / {String(planetSetCount).padStart(2, "0")} TRANSMISSION SETS</p>
                <div className="carousel-controls">
                  <button type="button" onPointerDown={(event) => { event.stopPropagation(); carouselPointerRef.current = true; setPlanetSlide((currentSlide) => (currentSlide + planetSetCount - 1) % planetSetCount); }} onClick={(event) => { event.stopPropagation(); if (!carouselPointerRef.current) setPlanetSlide((currentSlide) => (currentSlide + planetSetCount - 1) % planetSetCount); carouselPointerRef.current = false; }} aria-label="Previous three planets"><ChevronLeft size={19} /></button>
                  <button type="button" onPointerDown={(event) => { event.stopPropagation(); carouselPointerRef.current = true; setPlanetSlide((currentSlide) => (currentSlide + 1) % planetSetCount); }} onClick={(event) => { event.stopPropagation(); if (!carouselPointerRef.current) setPlanetSlide((currentSlide) => (currentSlide + 1) % planetSetCount); carouselPointerRef.current = false; }} aria-label="Next three planets"><ChevronRight size={19} /></button>
                </div>
              </div>
              <div className="carousel-window">
                <div className="carousel-track" style={{ transform: `translateX(-${planetSlide * 100}%)` }}>
                  {Array.from({ length: planetSetCount }, (_, group) => (
                    <div className="planet-slide" key={group}>
                      {worlds.slice(group * 3, group * 3 + 3).map((world, index) => (
                        <button className={`planet-card planet-${world.visual}`} type="button" key={world.code} onClick={() => setSelectedWorld(world)}>
                          <span className="planet-card-number">{String(group * 3 + index + 1).padStart(2, "0")}</span>
                          <div className="planet-card-visual"><Globe3D visual={world.visual} label={world.title} material={worldMaterialProfiles[world.visual]} animate={planetsInView} /></div>
                          <div className="planet-card-copy"><p className="eyebrow">{world.origin}</p><h3>{world.title}</h3><span>{world.body}</span><p className="planet-distance">SIM DISTANCE <b>{world.distance}</b></p></div>
                          <span className="planet-open">VIEW PLANET <ArrowUpRight size={14} /></span>
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
              <a className="footer-brand" href="#home"><span className="akashganga-logo" aria-hidden="true"><i /><i /><i /></span><span>AKASHGANGA<br /><small>MILKY WAY FIELD LAB</small></span></a>
              <p>Built for curious minds tracing planets, stories, and the bright lanes between them.</p>
              <button type="button" className="signal-button footer-cta" onClick={() => setDownloadOpen(true)}>Download app <Download size={16} /></button>
            </div>
            <div className="footer-bottom section-shell">
              <span>© 2026 AKASHGANGA FIELD LAB</span>
              <div><a href="#home">Home</a><a href="#exoplanets">Exoplanets</a><a href="#exploration">Exploration</a><a href="#facts">Facts</a></div>
              <span>FAN FIELD STUDY // 08-616</span>
            </div>
          </footer>

          {selectedWorld && (
            <div className="world-dialog-backdrop" role="presentation" onPointerDown={() => setSelectedWorld(null)}>
              <article className={`world-dialog planet-${selectedWorld.visual}`} role="dialog" aria-modal="true" aria-labelledby="world-dialog-title" onPointerDown={(event) => event.stopPropagation()}>
                <button className="world-dialog-close" type="button" onClick={() => setSelectedWorld(null)} aria-label="Close world detail"><X size={20} /></button>
                <div className="world-dialog-copy">
                  <p className="eyebrow"><Crosshair size={13} /> AKASHGANGA PLANET READOUT // {selectedWorld.code}</p>
                  <h2 id="world-dialog-title">{selectedWorld.title}</h2>
                  <p>{selectedWorld.detail}</p>
                  <div className="world-readouts"><span>GALACTIC REGION <b>{selectedWorld.origin}</b></span><span>SIM DISTANCE <b>{selectedWorld.distance}</b></span><span>KEY TRACE <b>{selectedWorld.signature}</b></span></div>
                  <p className="planet-instruction">DRAG OR SWIPE THE WORLD TO ORBIT ITS VOLCANIC SURFACE — FOLLOW THE LAVA LINES AND ATMOSPHERIC EDGE</p>
                </div>
                <div className="detail-planet-stage">
                  <span className="detail-stage-starfield" aria-hidden="true" />
                  <span className="detail-stage-haze" aria-hidden="true" />
                  <Globe3D visual={selectedWorld.visual} label={selectedWorld.title} material={worldMaterialProfiles[selectedWorld.visual]} size="detail" interactive />
                  <span className="detail-stage-readout" aria-hidden="true">LIVE ORBIT // DRAG TO ROTATE</span>
                </div>
              </article>
            </div>
          )}
          {downloadOpen && (
            <section id="download-app" className="download-page" role="dialog" aria-modal="true" aria-labelledby="download-app-title">
              <div className="download-starfield" />
              <button className="world-dialog-close download-close" type="button" onClick={() => setDownloadOpen(false)} aria-label="Close download page"><X size={20} /></button>
              <div className="download-layout">
                <div className="download-copy">
                  <p className="eyebrow"><Download size={13} /> AKASHGANGA APP / DEMO RELEASE</p>
                  <h2 id="download-app-title">Keep the<br /><em>Milky Way</em><br />in your pocket.</h2>
                  <p>AKASHGANGA is a fictional field companion for saving planetary signals, rotating 3D worlds, and following the next bright webline home.</p>
                  <div className="download-actions"><button className="signal-button" type="button">Download for iOS <ArrowUpRight size={16} /></button><button className="app-outline-button" type="button">Download for Android <ArrowUpRight size={16} /></button></div>
                  <small>DEMO DOWNLOAD ONLY // NO APP FILE WILL BE INSTALLED</small>
                </div>
                <div className="download-visual" aria-hidden="true"><div className="app-web"><i /><i /><i /><i /><i /><i /></div><div className="app-phone"><div className="app-phone-top">AKASHGANGA <span>●</span></div><div className="app-mini-planet"><i /><b /></div><p>GLASS MERIDIAN</p><small>4.1 × 10¹⁴ KM</small><div className="app-phone-bars"><span /><span /><span /></div></div></div>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
