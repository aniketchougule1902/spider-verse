/**
 * AKASHGANGA visual system: a true WebGL globe with axial motion, atmospheric depth,
 * observational overlays, and restrained orbital geometry for the Milky Way field lab.
 */
import { PointerEvent, useEffect, useRef } from "react";
import * as THREE from "three";

type GlobeSize = "card" | "detail";

type Globe3DProps = {
  visual: string;
  label: string;
  size?: GlobeSize;
  animate?: boolean;
  interactive?: boolean;
};

const palettes: Record<string, { base: number; accent: number; glow: number }> = {
  aurelia: { base: 0xc9781c, accent: 0xffdc70, glow: 0xff9f3f }, noctis: { base: 0x11162e, accent: 0x4f78c4, glow: 0x3b5fa9 }, solara: { base: 0xd36724, accent: 0xffd26b, glow: 0xff7b1b }, mistral: { base: 0x8d67bf, accent: 0xd8a9ff, glow: 0xba7eff }, ember: { base: 0x8a261c, accent: 0xff7148, glow: 0xcf2e1c }, cobalt: { base: 0x134b92, accent: 0x68c7ff, glow: 0x238fe7 }, verdant: { base: 0x1d795c, accent: 0x8cdb94, glow: 0x31aa87 }, ibis: { base: 0x9f2930, accent: 0xff7962, glow: 0xde372f }, fable: { base: 0x88a2bf, accent: 0xf0eaff, glow: 0xc2c9ff }, quartz: { base: 0x7d91a3, accent: 0xf3fbff, glow: 0xa8d6f0 }, nara: { base: 0xa74471, accent: 0xffb8d4, glow: 0xe666a0 }, crimson: { base: 0x891d2e, accent: 0xff5d59, glow: 0xef2d3c }, aster: { base: 0xa2a5ad, accent: 0xffffff, glow: 0xbdcced }, pollen: { base: 0xc59622, accent: 0xffe98b, glow: 0xfac63d }, glass: { base: 0x17273e, accent: 0xd7edff, glow: 0x5c9edb },
};

function disposeObject(object: THREE.Object3D) { object.traverse((item) => { const mesh = item as THREE.Mesh; mesh.geometry?.dispose(); const material = mesh.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(material)) material.forEach((entry) => entry.dispose()); else material?.dispose(); }); }

export default function Globe3D({ visual, label, size = "card", animate = true, interactive = false }: Globe3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef({ tiltX: 0, tiltY: 0, targetX: 0, targetY: 0, dragging: false });
  useEffect(() => {
    const host = hostRef.current; if (!host) return;
    const palette = palettes[visual] ?? palettes.aurelia;
    const scene = new THREE.Scene(); const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.domElement.setAttribute("aria-label", `${label} 3D globe`); host.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100); camera.position.set(0, size === "detail" ? 0.15 : 0.05, size === "detail" ? 4.15 : 3.4);
    const globeRig = new THREE.Group(); globeRig.rotation.z = size === "detail" ? 0.13 : 0.09; scene.add(globeRig); scene.add(new THREE.HemisphereLight(0xb9ddff, palette.base, 1.15)); const keyLight = new THREE.DirectionalLight(0xfff0d0, 2.7); keyLight.position.set(-3.5, 3.2, 4.5); scene.add(keyLight); const rimLight = new THREE.PointLight(palette.glow, 4.6, 9); rimLight.position.set(2.8, -1.4, 2.8); scene.add(rimLight);
    const globe = new THREE.Group(); globeRig.add(globe); const core = new THREE.Mesh(new THREE.SphereGeometry(1, size === "detail" ? 80 : 54, size === "detail" ? 56 : 40), new THREE.MeshPhysicalMaterial({ color: palette.base, emissive: palette.glow, emissiveIntensity: 0.17, metalness: 0.22, roughness: 0.62, clearcoat: 0.38, clearcoatRoughness: 0.38 })); globe.add(core); globe.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.006, 4), new THREE.MeshBasicMaterial({ color: palette.accent, wireframe: true, transparent: true, opacity: size === "detail" ? 0.13 : 0.08 }))); globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.045, 56, 40), new THREE.MeshPhongMaterial({ color: palette.accent, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending })));
    const seamMaterial = new THREE.MeshBasicMaterial({ color: palette.accent, transparent: true, opacity: 0.32 }); [-0.5, 0.08, 0.58].forEach((latitude, index) => { const seam = new THREE.Mesh(new THREE.TorusGeometry(Math.sqrt(1 - latitude * latitude) * 1.012, 0.008, 6, 80), seamMaterial.clone()); seam.rotation.x = Math.PI / 2; seam.position.y = latitude; seam.rotation.z = index * 0.25; globe.add(seam); }); const meridian = new THREE.Mesh(new THREE.TorusGeometry(1.018, 0.007, 6, 84), seamMaterial.clone()); meridian.rotation.y = Math.PI / 2; globe.add(meridian);
    if (size === "detail") { const orbitalGroup = new THREE.Group(); globeRig.add(orbitalGroup); [[1.38, 0.18, 0.78, palette.accent], [1.52, -0.36, -0.45, palette.glow]].forEach(([radius, rotateX, rotateZ, color]) => { const orbit = new THREE.Mesh(new THREE.TorusGeometry(radius as number, 0.011, 8, 140), new THREE.MeshBasicMaterial({ color: color as number, transparent: true, opacity: 0.52 })); orbit.rotation.x = rotateX as number; orbit.rotation.z = rotateZ as number; orbitalGroup.add(orbit); }); const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshStandardMaterial({ color: palette.accent, emissive: palette.accent, emissiveIntensity: 1.2 })); satellite.position.set(1.33, 0.55, 0.22); orbitalGroup.add(satellite); }
    const resize = () => { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }; const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize(); const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; let frameId = 0; let previous = performance.now(); const draw = (time: number) => { const delta = Math.min((time - previous) / 1000, 0.04); previous = time; const motion = motionRef.current; motion.tiltX += (motion.targetX - motion.tiltX) * 0.085; motion.tiltY += (motion.targetY - motion.tiltY) * 0.085; globeRig.rotation.x = motion.tiltX; globeRig.rotation.y = motion.tiltY; if (animate && !reducedMotion) { globe.rotation.y += delta * (size === "detail" ? 0.68 : 0.48); globe.rotation.z = Math.sin(time * 0.0005) * 0.035; } renderer.render(scene, camera); frameId = requestAnimationFrame(draw); }; frameId = requestAnimationFrame(draw); return () => { cancelAnimationFrame(frameId); resizeObserver.disconnect(); disposeObject(scene); renderer.dispose(); renderer.domElement.remove(); };
  }, [visual, label, size, animate]);
  const updateTilt = (event: PointerEvent<HTMLDivElement>) => { if (!interactive) return; const host = hostRef.current; if (!host) return; const bounds = host.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - 0.5; const y = (event.clientY - bounds.top) / bounds.height - 0.5; motionRef.current.targetY = x * 0.9; motionRef.current.targetX = -y * 0.55; }; const resetTilt = () => { if (!interactive || motionRef.current.dragging) return; motionRef.current.targetX = 0; motionRef.current.targetY = 0; };
  return <div ref={hostRef} className={`globe3d globe3d-${size}${interactive ? " is-interactive" : ""}`} role={interactive ? "application" : "img"} aria-label={interactive ? `${label} interactive 3D globe. Drag or move to tilt.` : `${label} rotating 3D globe`} onPointerDown={(event) => { if (!interactive) return; event.currentTarget.setPointerCapture(event.pointerId); motionRef.current.dragging = true; updateTilt(event); }} onPointerMove={updateTilt} onPointerUp={(event) => { if (!interactive) return; motionRef.current.dragging = false; event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerLeave={resetTilt} onPointerCancel={() => { motionRef.current.dragging = false; resetTilt(); }} />;
}
