/**
 * AKASHGANGA visual system: original procedural worlds with volcanic material depth,
 * cinematic atmosphere, axial motion, and direct-manipulation orbital controls.
 */
import { PointerEvent, useEffect, useRef } from "react";
import * as THREE from "three";

type GlobeSize = "card" | "detail";

export type GlobeMaterialProfile = {
  surface: string;
  crust: string;
  lava: string;
  atmosphere: string;
  roughness?: number;
  metalness?: number;
  relief?: number;
  crackDensity?: number;
  lavaIntensity?: number;
  atmosphereOpacity?: number;
  seed?: number;
};

type Globe3DProps = {
  visual: string;
  label: string;
  material?: GlobeMaterialProfile;
  size?: GlobeSize;
  animate?: boolean;
  interactive?: boolean;
};

const palettes: Record<string, { base: number; accent: number; glow: number }> = {
  aurelia: { base: 0xc9781c, accent: 0xffdc70, glow: 0xff9f3f },
  noctis: { base: 0x11162e, accent: 0x4f78c4, glow: 0x3b5fa9 },
  solara: { base: 0xd36724, accent: 0xffd26b, glow: 0xff7b1b },
  mistral: { base: 0x8d67bf, accent: 0xd8a9ff, glow: 0xba7eff },
  ember: { base: 0x8a261c, accent: 0xff7148, glow: 0xcf2e1c },
  cobalt: { base: 0x134b92, accent: 0x68c7ff, glow: 0x238fe7 },
  verdant: { base: 0x1d795c, accent: 0x8cdb94, glow: 0x31aa87 },
  ibis: { base: 0x9f2930, accent: 0xff7962, glow: 0xde372f },
  fable: { base: 0x88a2bf, accent: 0xf0eaff, glow: 0xc2c9ff },
  quartz: { base: 0x7d91a3, accent: 0xf3fbff, glow: 0xa8d6f0 },
  nara: { base: 0xa74471, accent: 0xffb8d4, glow: 0xe666a0 },
  crimson: { base: 0x891d2e, accent: 0xff5d59, glow: 0xef2d3c },
  aster: { base: 0xa2a5ad, accent: 0xffffff, glow: 0xbdcced },
  pollen: { base: 0xc59622, accent: 0xffe98b, glow: 0xfac63d },
  glass: { base: 0x17273e, accent: 0xd7edff, glow: 0x5c9edb },
};

type CrackStroke = { points: Array<[number, number]>; width: number; alpha: number };

function colorCss(color: THREE.Color) {
  return `#${color.getHexString()}`;
}

function seededRandom(seedText: string) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createCrackStrokes(width: number, height: number, density: number, seed: string) {
  const random = seededRandom(seed);
  const strokes: CrackStroke[] = [];
  const total = Math.round(11 + density * 23);
  for (let index = 0; index < total; index += 1) {
    const points: Array<[number, number]> = [];
    let x = random() * width;
    let y = random() * height;
    let direction = random() * Math.PI * 2;
    const segments = 5 + Math.floor(random() * 9);
    for (let segment = 0; segment < segments; segment += 1) {
      points.push([x, y]);
      direction += (random() - 0.5) * 1.14;
      const step = width * (0.018 + random() * 0.027);
      x += Math.cos(direction) * step;
      y += Math.sin(direction) * step * 0.58;
    }
    strokes.push({ points, width: 0.55 + random() * (1.1 + density * 1.8), alpha: 0.45 + random() * 0.5 });
    if (random() < density * 0.78 && points.length > 4) {
      const branchOrigin = points[2 + Math.floor(random() * (points.length - 3))];
      const branch: Array<[number, number]> = [branchOrigin];
      let branchX = branchOrigin[0];
      let branchY = branchOrigin[1];
      direction += random() > 0.5 ? Math.PI * 0.65 : -Math.PI * 0.65;
      for (let branchStep = 0; branchStep < 3 + Math.floor(random() * 4); branchStep += 1) {
        direction += (random() - 0.5) * 0.9;
        const step = width * (0.012 + random() * 0.016);
        branchX += Math.cos(direction) * step;
        branchY += Math.sin(direction) * step * 0.66;
        branch.push([branchX, branchY]);
      }
      strokes.push({ points: branch, width: 0.38 + random() * 0.8, alpha: 0.38 + random() * 0.42 });
    }
  }
  return strokes;
}

function drawStrokes(context: CanvasRenderingContext2D, strokes: CrackStroke[], color: string, blur = 0) {
  context.save();
  context.strokeStyle = color;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = color;
  context.shadowBlur = blur;
  strokes.forEach((stroke) => {
    context.globalAlpha = stroke.alpha;
    context.lineWidth = stroke.width;
    context.beginPath();
    stroke.points.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  });
  context.restore();
}

function createPlanetTextures(profile: GlobeMaterialProfile, visual: string, size: GlobeSize) {
  const textureSize = size === "detail" ? 512 : 224;
  const surfaceCanvas = document.createElement("canvas");
  const emissiveCanvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  [surfaceCanvas, emissiveCanvas, bumpCanvas].forEach((canvas) => {
    canvas.width = textureSize;
    canvas.height = textureSize / 2;
  });

  const surfaceContext = surfaceCanvas.getContext("2d");
  const emissiveContext = emissiveCanvas.getContext("2d");
  const bumpContext = bumpCanvas.getContext("2d");
  if (!surfaceContext || !emissiveContext || !bumpContext) return { textures: [] as THREE.Texture[] };

  const surface = new THREE.Color(profile.surface);
  const crust = new THREE.Color(profile.crust);
  const lava = new THREE.Color(profile.lava);
  const random = seededRandom(`${visual}-${profile.seed ?? 0}-surface`);
  const width = surfaceCanvas.width;
  const height = surfaceCanvas.height;
  const density = profile.crackDensity ?? 0.5;

  surfaceContext.fillStyle = colorCss(crust);
  surfaceContext.fillRect(0, 0, width, height);
  bumpContext.fillStyle = "#707070";
  bumpContext.fillRect(0, 0, width, height);
  emissiveContext.fillStyle = "#000000";
  emissiveContext.fillRect(0, 0, width, height);

  for (let index = 0; index < Math.round(180 + density * 130); index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 1 + random() * width * (0.006 + density * 0.008);
    const mineral = crust.clone().lerp(surface, 0.18 + random() * 0.72);
    surfaceContext.globalAlpha = 0.08 + random() * 0.24;
    surfaceContext.fillStyle = colorCss(mineral);
    surfaceContext.beginPath();
    surfaceContext.ellipse(x, y, radius * (0.5 + random()), radius * (0.34 + random() * 0.65), random() * Math.PI, 0, Math.PI * 2);
    surfaceContext.fill();
    bumpContext.globalAlpha = 0.14 + random() * 0.22;
    bumpContext.fillStyle = random() > 0.54 ? "#9e9e9e" : "#4a4a4a";
    bumpContext.beginPath();
    bumpContext.arc(x, y, radius, 0, Math.PI * 2);
    bumpContext.fill();
  }
  surfaceContext.globalAlpha = 1;
  bumpContext.globalAlpha = 1;

  const strokes = createCrackStrokes(width, height, density, `${visual}-${profile.seed ?? 0}-cracks`);
  const darkLava = lava.clone().multiplyScalar(0.5).lerp(crust, 0.18);
  drawStrokes(surfaceContext, strokes, colorCss(darkLava), 0);
  drawStrokes(emissiveContext, strokes, colorCss(lava), size === "detail" ? 8 : 3);
  drawStrokes(bumpContext, strokes, "#1f1f1f", 0);

  const surfaceTexture = new THREE.CanvasTexture(surfaceCanvas);
  const emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  [surfaceTexture, emissiveTexture, bumpTexture].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 2;
  });
  surfaceTexture.colorSpace = THREE.SRGBColorSpace;
  emissiveTexture.colorSpace = THREE.SRGBColorSpace;
  return { surfaceTexture, emissiveTexture, bumpTexture, textures: [surfaceTexture, emissiveTexture, bumpTexture] };
}

function createReliefGeometry(size: GlobeSize, relief: number, seed: string) {
  const geometry = new THREE.SphereGeometry(1, size === "detail" ? 92 : 50, size === "detail" ? 68 : 38);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const random = seededRandom(seed);
  const offsetOne = random() * Math.PI * 2;
  const offsetTwo = random() * Math.PI * 2;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const normal = new THREE.Vector3(x, y, z).normalize();
    const ridge = Math.sin(normal.x * 9 + offsetOne) * 0.32 + Math.sin(normal.y * 13 - offsetTwo) * 0.24 + Math.cos(normal.z * 7 + offsetOne) * 0.2;
    const scale = 1 + Math.max(-0.5, ridge) * relief;
    position.setXYZ(index, normal.x * scale, normal.y * scale, normal.z * scale);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createAtmosphereMaterial(color: THREE.Color, opacity: number) {
  return new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: color }, opacity: { value: opacity } },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float opacity;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float rim = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDirection)), 2.1);
        gl_FragColor = vec4(glowColor, rim * opacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
}

function addStarfield(scene: THREE.Scene, seed: string) {
  const random = seededRandom(`${seed}-starfield`);
  const positions = new Float32Array(170 * 3);
  for (let index = 0; index < 170; index += 1) {
    positions[index * 3] = (random() - 0.5) * 7;
    positions[index * 3 + 1] = (random() - 0.5) * 5.8;
    positions[index * 3 + 2] = -2.4 - random() * 3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xd6e9ff, size: 0.021, transparent: true, opacity: 0.72, depthWrite: false }));
  scene.add(stars);
  return stars;
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((item) => {
    const mesh = item as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
    else material?.dispose();
  });
}

export default function Globe3D({ visual, label, material, size = "card", animate = true, interactive = false }: Globe3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef({ rotationX: 0.05, rotationY: 0, targetX: 0.05, targetY: 0, dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const palette = palettes[visual] ?? palettes.aurelia;
    const fallbackProfile: GlobeMaterialProfile = {
      surface: colorCss(new THREE.Color(palette.base)),
      crust: colorCss(new THREE.Color(palette.base).multiplyScalar(0.38)),
      lava: colorCss(new THREE.Color(palette.glow)),
      atmosphere: colorCss(new THREE.Color(palette.accent)),
      roughness: 0.66,
      metalness: 0.16,
      relief: 0.022,
      crackDensity: 0.44,
      lavaIntensity: 0.8,
      atmosphereOpacity: 0.24,
    };
    const profile = { ...fallbackProfile, ...material };
    const atmosphereColor = new THREE.Color(profile.atmosphere);
    const lavaColor = new THREE.Color(profile.lava);
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, size === "detail" ? 1.85 : 1.4));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = size === "detail" ? 1.22 : 1.04;
    renderer.domElement.setAttribute("aria-label", `${label} 3D globe`);
    host.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(size === "detail" ? 31 : 34, 1, 0.1, 100);
    camera.position.set(0, size === "detail" ? 0.12 : 0.05, size === "detail" ? 4.42 : 3.42);
    const globeRig = new THREE.Group();
    globeRig.rotation.z = size === "detail" ? 0.09 : 0.06;
    scene.add(globeRig);
    if (size === "detail") addStarfield(scene, `${visual}-${profile.seed ?? 0}`);

    scene.add(new THREE.HemisphereLight(0xb9ddff, new THREE.Color(profile.crust), 1.08));
    scene.add(new THREE.AmbientLight(0x0c1531, 0.64));
    const keyLight = new THREE.DirectionalLight(0xffe6c6, size === "detail" ? 5.6 : 3.2);
    keyLight.position.set(-3.9, 3.1, 4.9);
    scene.add(keyLight);
    const lavaRimLight = new THREE.PointLight(lavaColor, size === "detail" ? 7.5 : 4.4, 10, 1.85);
    lavaRimLight.position.set(2.85, -1.15, 3.25);
    scene.add(lavaRimLight);
    const coldRimLight = new THREE.PointLight(atmosphereColor, size === "detail" ? 3.2 : 1.8, 8, 2);
    coldRimLight.position.set(-2.8, 1.1, -2.5);
    scene.add(coldRimLight);

    const globe = new THREE.Group();
    globeRig.add(globe);
    const textureResult = createPlanetTextures(profile, visual, size);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textureResult.surfaceTexture,
      emissive: lavaColor,
      emissiveMap: textureResult.emissiveTexture,
      emissiveIntensity: profile.lavaIntensity ?? 0.8,
      bumpMap: textureResult.bumpTexture,
      bumpScale: (profile.relief ?? 0.022) * 3.6,
      metalness: profile.metalness ?? 0.15,
      roughness: profile.roughness ?? 0.7,
      clearcoat: size === "detail" ? 0.18 : 0.12,
      clearcoatRoughness: 0.54,
    });
    const core = new THREE.Mesh(createReliefGeometry(size, profile.relief ?? 0.022, `${visual}-${profile.seed ?? 0}`), coreMaterial);
    globe.add(core);

    const mineralLattice = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.009, size === "detail" ? 5 : 4),
      new THREE.MeshBasicMaterial({ color: atmosphereColor, wireframe: true, transparent: true, opacity: size === "detail" ? 0.025 : 0.018, depthWrite: false }),
    );
    globe.add(mineralLattice);

    const atmosphereMaterial = createAtmosphereMaterial(atmosphereColor, profile.atmosphereOpacity ?? 0.24);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.065, 72, 48), atmosphereMaterial);
    atmosphere.renderOrder = 2;
    globe.add(atmosphere);
    const outerHazeMaterial = createAtmosphereMaterial(lavaColor.clone().lerp(atmosphereColor, 0.58), (profile.atmosphereOpacity ?? 0.24) * 0.3);
    const outerHaze = new THREE.Mesh(new THREE.SphereGeometry(1.115, 64, 44), outerHazeMaterial);
    outerHaze.renderOrder = 2;
    globe.add(outerHaze);

    let orbitalGroup: THREE.Group | undefined;
    if (size === "detail") {
      orbitalGroup = new THREE.Group();
      globeRig.add(orbitalGroup);
      [
        [1.39, 0.22, 0.72, atmosphereColor, 0.38],
        [1.58, -0.38, -0.48, lavaColor, 0.24],
      ].forEach(([radius, rotateX, rotateZ, color, opacity]) => {
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(radius as number, 0.009, 6, 160),
          new THREE.MeshBasicMaterial({ color: color as THREE.Color, transparent: true, opacity: opacity as number, depthWrite: false }),
        );
        orbit.rotation.x = rotateX as number;
        orbit.rotation.z = rotateZ as number;
        orbitalGroup?.add(orbit);
      });
      const tracer = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshStandardMaterial({ color: atmosphereColor, emissive: lavaColor, emissiveIntensity: 2.1 }));
      tracer.position.set(1.22, 0.64, 0.28);
      orbitalGroup.add(tracer);
    }

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let previous = performance.now();
    const draw = (time: number) => {
      const delta = Math.min((time - previous) / 1000, 0.04);
      previous = time;
      const motion = motionRef.current;
      motion.rotationX += (motion.targetX - motion.rotationX) * 0.1;
      motion.rotationY += (motion.targetY - motion.rotationY) * 0.1;
      globeRig.rotation.x = motion.rotationX;
      globeRig.rotation.y = motion.rotationY;
      if (animate && !reducedMotion) {
        globe.rotation.y += delta * (size === "detail" ? 0.31 : 0.48);
        globe.rotation.z = Math.sin(time * 0.0005) * 0.022;
        atmosphereMaterial.uniforms.opacity.value = (profile.atmosphereOpacity ?? 0.24) * (0.88 + Math.sin(time * 0.0013) * 0.12);
        outerHazeMaterial.uniforms.opacity.value = (profile.atmosphereOpacity ?? 0.24) * (0.26 + Math.sin(time * 0.0018 + 1.2) * 0.05);
        if (orbitalGroup) orbitalGroup.rotation.y += delta * 0.24;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      disposeObject(scene);
      textureResult.textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [visual, label, material, size, animate]);

  const updateDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const motion = motionRef.current;
    if (!motion.dragging) return;
    const deltaX = event.clientX - motion.lastX;
    const deltaY = event.clientY - motion.lastY;
    motion.lastX = event.clientX;
    motion.lastY = event.clientY;
    motion.targetY += deltaX * 0.012;
    motion.targetX = THREE.MathUtils.clamp(motion.targetX + deltaY * 0.008, -0.68, 0.68);
  };

  return (
    <div
      ref={hostRef}
      className={`globe3d globe3d-${size}${interactive ? " is-interactive" : ""}`}
      role={interactive ? "application" : "img"}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${label} interactive 3D globe. Drag or swipe to orbit the volcanic surface.` : `${label} rotating 3D globe`}
      onPointerDown={(event) => {
        if (!interactive) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const motion = motionRef.current;
        motion.dragging = true;
        motion.lastX = event.clientX;
        motion.lastY = event.clientY;
      }}
      onPointerMove={updateDrag}
      onPointerUp={(event) => {
        if (!interactive) return;
        motionRef.current.dragging = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { motionRef.current.dragging = false; }}
    />
  );
}
