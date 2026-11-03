"use client";

import { useEffect, useRef } from "react";
import type * as ThreeTypes from "three";
import { simulationState } from "@/lib/simulation-state";

const ATLAS_GRID = 8;
const GLYPHS =
  "01アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ$#%&+<>/\\[]{}=_";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCore;
  uniform float uIntensity;
  uniform float uViewScale;
  uniform float uDpr;
  uniform float uCoreScale;
  uniform float uCoreOffset;
  uniform vec2 uPointer;

  attribute float aTrail;
  attribute float aGlyph;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aSeed;

  varying float vGlyph;
  varying float vAlpha;
  varying float vSeed;
  varying vec3 vColor;

  void main() {
    vec3 p = position;

    float fall = fract(aPhase + uTime * aSpeed);
    float y = mix(7.8, -7.8, fall);
    y += aTrail * 0.42;

    p.y = y;
    p.x += sin(uTime * 0.35 + aSeed * 6.28318) * 0.12;

    float pointSeed = fract(aSeed * 13.13 + aTrail * 0.618 + aGlyph * 0.0713);
    float theta = pointSeed * 6.2831853;
    float phi = acos(
      1.0 - 2.0 * fract(aPhase * 1.37 + aTrail * 0.413 + aGlyph * 0.031)
    );
    float radius = (2.1 + sin(pointSeed * 51.0) * 0.18) * uCoreScale;
    float spin = uTime * 0.085;

    vec3 target = vec3(
      cos(theta + spin) * sin(phi) * radius + uCoreOffset,
      cos(phi) * radius * 0.82,
      sin(theta + spin) * sin(phi) * radius
    );

    p = mix(p, target, uCore);
    p.x += uPointer.x * mix(0.62, 0.13, uCore);
    p.y += uPointer.y * mix(0.38, 0.08, uCore);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float worldSize = mix(0.25, 0.4, aSize);
    float pointSize = worldSize * uViewScale / max(1.0, -mvPosition.z);
    gl_PointSize = clamp(pointSize, 2.0 * uDpr, 26.0 * uDpr);

    float depthFade = smoothstep(39.0, 8.0, -mvPosition.z);
    float trailFade = pow(1.0 - aTrail, 1.35);
    float flicker = 0.82 + 0.18 * sin(uTime * 4.0 + aSeed * 30.0);

    vAlpha = uIntensity * mix(0.07, 0.9, trailFade) * depthFade * flicker;
    vGlyph = aGlyph;
    vSeed = aSeed;
    vColor = mix(
      vec3(0.045, 0.72, 0.26),
      vec3(0.72, 1.0, 0.83),
      pow(1.0 - aTrail, 5.0)
    );

    if (aSeed > 0.9935) {
      vColor = vec3(1.0, 0.14, 0.18);
      vAlpha *= 1.25;
    }
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;

  varying float vGlyph;
  varying float vAlpha;
  varying float vSeed;
  varying vec3 vColor;

  void main() {
    vec2 cell = vec2(mod(vGlyph, 8.0), floor(vGlyph / 8.0));
    vec2 localUv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec2 uv = (cell + localUv) / 8.0;

    vec4 glyph = texture2D(uAtlas, uv);
    if (glyph.a < 0.035) discard;

    float glint = step(0.998, vSeed);
    vec3 color = mix(vColor, vec3(0.92, 1.0, 0.96), glint * 0.6);
    gl_FragColor = vec4(color, glyph.a * vAlpha);

    #include <colorspace_fragment>
  }
`;

function makeGlyphAtlas(THREE: typeof ThreeTypes) {
  const cell = 128;
  const size = cell * ATLAS_GRID;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D canvas context unavailable");
  }

  context.clearRect(0, 0, size, size);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font =
    '500 82px "IBM Plex Mono", "Hiragino Kaku Gothic ProN", "Yu Gothic", monospace';

  GLYPHS.split("").forEach((glyph, index) => {
    const column = index % ATLAS_GRID;
    const row = Math.floor(index / ATLAS_GRID);
    const x = column * cell + cell / 2;
    const y = row * cell + cell / 2 + 4;
    context.fillText(glyph, x, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function makeCircle(THREE: typeof ThreeTypes, radius: number, segments = 160) {
  const points: ThreeTypes.Vector3[] = [];
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0),
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0x45ff92,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

function damp(
  current: number,
  target: number,
  lambda: number,
  delta: number,
) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

export function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup = () => {};

    const boot = async () => {
      try {
        const THREE = await import("three");
        if (cancelled) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const lowPower =
          coarsePointer || (navigator.hardwareConcurrency ?? 8) <= 4;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: lowPower ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
        camera.position.set(0, 0, 8);

        const atlas = makeGlyphAtlas(THREE);

        const columnCount = lowPower ? 72 : 156;
        const trailCount = lowPower ? 7 : 10;
        const pointCount = columnCount * trailCount;

        const positions = new Float32Array(pointCount * 3);
        const trails = new Float32Array(pointCount);
        const glyphs = new Float32Array(pointCount);
        const phases = new Float32Array(pointCount);
        const speeds = new Float32Array(pointCount);
        const sizes = new Float32Array(pointCount);
        const seeds = new Float32Array(pointCount);

        let pointIndex = 0;
        for (let column = 0; column < columnCount; column += 1) {
          const x = (Math.random() * 2 - 1) * 14;
          const z = -3 - Math.random() * 27;
          const phase = Math.random();
          const speed = 0.055 + Math.random() * 0.13;
          const seed = Math.random();
          const size = 0.7 + Math.random() * 0.65;

          for (let trail = 0; trail < trailCount; trail += 1) {
            const offset = pointIndex * 3;
            positions[offset] = x;
            positions[offset + 1] = 0;
            positions[offset + 2] = z;
            trails[pointIndex] = trail / Math.max(1, trailCount - 1);
            glyphs[pointIndex] = Math.floor(Math.random() * ATLAS_GRID * ATLAS_GRID);
            phases[pointIndex] = phase;
            speeds[pointIndex] = speed;
            sizes[pointIndex] = size;
            seeds[pointIndex] = seed;
            pointIndex += 1;
          }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aTrail", new THREE.BufferAttribute(trails, 1));
        geometry.setAttribute("aGlyph", new THREE.BufferAttribute(glyphs, 1));
        geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

        const uniforms = {
          uTime: { value: 0 },
          uCore: { value: 0 },
          uIntensity: { value: 1 },
          uViewScale: { value: 900 },
          uDpr: { value: 1 },
          uCoreScale: { value: 1 },
          uCoreOffset: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uAtlas: { value: atlas },
        };

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          blending: THREE.AdditiveBlending,
        });

        const rain = new THREE.Points(geometry, material);
        rain.frustumCulled = false;
        scene.add(rain);

        const coreGroup = new THREE.Group();
        coreGroup.position.set(0, 0, -1.5);

        const orbitA = makeCircle(THREE, 2.8);
        const orbitB = makeCircle(THREE, 3.2);
        const orbitC = makeCircle(THREE, 2.4);
        orbitA.rotation.set(1.22, 0.18, 0.4);
        orbitB.rotation.set(0.24, 1.14, -0.32);
        orbitC.rotation.set(1.48, -0.68, 0.2);
        coreGroup.add(orbitA, orbitB, orbitC);

        const shellGeometry = new THREE.WireframeGeometry(
          new THREE.IcosahedronGeometry(3.15, 1),
        );
        const shellMaterial = new THREE.LineBasicMaterial({
          color: 0x45ff92,
          transparent: true,
          opacity: 0.04,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const shell = new THREE.LineSegments(shellGeometry, shellMaterial);
        coreGroup.add(shell);

        scene.add(coreGroup);

        const glowCanvas = document.createElement("canvas");
        glowCanvas.width = 128;
        glowCanvas.height = 128;
        const glowContext = glowCanvas.getContext("2d");
        if (glowContext) {
          const gradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
          gradient.addColorStop(0, "rgba(69,255,146,0.3)");
          gradient.addColorStop(0.34, "rgba(69,255,146,0.1)");
          gradient.addColorStop(1, "rgba(69,255,146,0)");
          glowContext.fillStyle = gradient;
          glowContext.fillRect(0, 0, 128, 128);
        }
        const glowTexture = new THREE.CanvasTexture(glowCanvas);
        const glowMaterial = new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x45ff92,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(11, 11, 1);
        glow.position.set(0, 0, -2.4);
        scene.add(glow);

        const pointerTarget = new THREE.Vector2(0, 0);
        const pointerCurrent = new THREE.Vector2(0, 0);
        let smoothCore = 0;
        let smoothIntensity = 1;
        let smoothDilation = 1;
        let time = 0;
        let lastFrame = performance.now();
        let animationFrame = 0;
        let running = !reduceMotion;

        const updateSize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const dprCap = lowPower ? 1.15 : width > 2200 ? 1.35 : 1.5;
          const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
          const aspect = width / Math.max(1, height);
          const coreOffset =
            aspect < 1.05 ? 0 : Math.min(4.2, (aspect - 1.05) * 5.6);

          renderer.setPixelRatio(dpr);
          renderer.setSize(width, height, false);
          camera.aspect = aspect;
          camera.updateProjectionMatrix();

          uniforms.uViewScale.value =
            (height * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
          uniforms.uDpr.value = dpr;
          uniforms.uCoreOffset.value = coreOffset;
          uniforms.uCoreScale.value = width < 720 ? 0.68 : 1;
          coreGroup.position.x = coreOffset;
          glow.position.x = coreOffset;
          glow.scale.setScalar(width < 720 ? 6 : 11);

          if (reduceMotion) {
            renderer.render(scene, camera);
          }
        };

        const setPointer = (x: number, y: number) => {
          simulationState.pointerX = x;
          simulationState.pointerY = y;
        };

        const onPointerMove = (event: PointerEvent) => {
          const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
          const normalizedY = -((event.clientY / window.innerHeight) * 2 - 1);
          pointerTarget.set(normalizedX, normalizedY);
          setPointer(normalizedX, normalizedY);
        };

        const onPointerLeave = () => {
          pointerTarget.set(0, 0);
          setPointer(0, 0);
        };

        const onVisibility = () => {
          if (document.hidden) {
            running = false;
            cancelAnimationFrame(animationFrame);
          } else if (!reduceMotion && !running) {
            running = true;
            lastFrame = performance.now();
            animationFrame = requestAnimationFrame(render);
          }
        };

        const onContextLost = (event: Event) => {
          event.preventDefault();
        };

        const render = (now: number) => {
          if (!running) return;
          const delta = Math.min((now - lastFrame) / 1000, 0.034);
          lastFrame = now;

          // Frame-rate-independent damping keeps the scene calm at 60, 120,
          // and 30 Hz — no per-frame snap when a refresh rate changes.
          smoothCore = damp(smoothCore, simulationState.core, 3.2, delta);
          smoothIntensity = damp(
            smoothIntensity,
            simulationState.intensity,
            2.4,
            delta,
          );
          smoothDilation = damp(
            smoothDilation,
            simulationState.dilation,
            6.5,
            delta,
          );
          time += delta * (smoothDilation < 0.002 ? 0 : smoothDilation);
          pointerCurrent.lerp(pointerTarget, 1 - Math.exp(-7.5 * delta));

          uniforms.uTime.value = time;
          uniforms.uCore.value = smoothCore;
          uniforms.uIntensity.value = smoothIntensity;
          uniforms.uPointer.value.copy(pointerCurrent);

          coreGroup.rotation.y += delta * 0.08 * smoothDilation;
          coreGroup.rotation.x = Math.sin(time * 0.12) * 0.18;
          coreGroup.scale.setScalar(0.9 + smoothCore * 0.1);
          glowMaterial.opacity = 0.04 + smoothCore * 0.16;
          shellMaterial.opacity = 0.025 + smoothCore * 0.055;
          for (const child of coreGroup.children) {
            if (child instanceof THREE.LineLoop) {
              (child.material as ThreeTypes.LineBasicMaterial).opacity =
                0.055 + smoothCore * 0.17;
            }
          }

          renderer.render(scene, camera);
          animationFrame = requestAnimationFrame(render);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerleave", onPointerLeave);
        document.addEventListener("visibilitychange", onVisibility);
        canvas.addEventListener("webglcontextlost", onContextLost);

        if (!reduceMotion) {
          animationFrame = requestAnimationFrame(render);
        }

        cleanup = () => {
          running = false;
          cancelAnimationFrame(animationFrame);
          window.removeEventListener("resize", updateSize);
          window.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerleave", onPointerLeave);
          document.removeEventListener("visibilitychange", onVisibility);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          geometry.dispose();
          material.dispose();
          atlas.dispose();
          orbitA.geometry.dispose();
          orbitB.geometry.dispose();
          orbitC.geometry.dispose();
          (orbitA.material as ThreeTypes.Material).dispose();
          (orbitB.material as ThreeTypes.Material).dispose();
          (orbitC.material as ThreeTypes.Material).dispose();
          shellGeometry.dispose();
          shellMaterial.dispose();
          glowTexture.dispose();
          glowMaterial.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.warn("WebGL scene unavailable; using fallback atmosphere.", error);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="simulation-layer" aria-hidden="true">
      <div className="simulation-atmosphere" />
      <canvas ref={canvasRef} className="simulation-canvas" />
      <div className="simulation-vignette" />
      <div className="simulation-grain" />
      <div className="simulation-scanlines" />
    </div>
  );
}
