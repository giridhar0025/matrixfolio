"use client";

import { useEffect, useRef } from "react";
import type * as ThreeTypes from "three";
import { simulationState } from "@/lib/simulation-state";

const constructVertexShader = /* glsl */ `
  attribute float aOrder;

  uniform float uBuild;
  uniform float uTime;

  varying float vAlpha;

  void main() {
    float reveal = smoothstep(aOrder, aOrder + 0.16, uBuild);
    float scatter = 1.0 - reveal;

    vec3 p = position;
    p.x += sin(aOrder * 91.0 + uTime * 0.25) * scatter * 2.2;
    p.y += cos(aOrder * 67.0 + uTime * 0.18) * scatter * 1.8;
    p.z += sin(aOrder * 47.0 + uTime * 0.12) * scatter * 2.4;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = reveal * (0.18 + 0.62 * smoothstep(0.05, 1.0, uBuild));
  }
`;

const constructFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);

    #include <colorspace_fragment>
  }
`;

const tracerVertexShader = /* glsl */ `
  attribute vec2 aTrail;
  attribute vec3 aTrailColor;

  varying vec2 vTrail;
  varying vec3 vTrailColor;

  void main() {
    vTrail = aTrail;
    vTrailColor = aTrailColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const tracerFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uTint;

  varying vec2 vTrail;
  varying vec3 vTrailColor;

  void main() {
    float edge =
      smoothstep(0.0, 0.32, vTrail.x) *
      (1.0 - smoothstep(0.68, 1.0, vTrail.x));
    float fade = 1.0 - vTrail.y;
    float core =
      smoothstep(0.34, 0.48, vTrail.x) *
      (1.0 - smoothstep(0.52, 0.66, vTrail.x));
    vec3 color = mix(vTrailColor, vec3(1.0, 0.88, 0.66), core * 0.72);
    color *= uTint;

    float alpha = (edge * 0.68 + core * 0.44) * fade * uOpacity;
    gl_FragColor = vec4(color, alpha);

    #include <colorspace_fragment>
  }
`;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function damp(current: number, target: number, lambda: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makeConstructGeometry(THREE: typeof ThreeTypes, lowPower: boolean) {
  const positions: number[] = [];
  const orders: number[] = [];
  const random = mulberry32(3407);

  const addSegment = (
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number,
    orderBase: number,
  ) => {
    const order = Math.min(0.92, orderBase + random() * 0.1);
    positions.push(ax, ay, az, bx, by, bz);
    orders.push(order, order);
  };

  const xStep = lowPower ? 2.8 : 2;
  const zStep = lowPower ? 3 : 2;

  // Floor and ceiling rails receding into the construct.
  for (let x = -8; x <= 8; x += xStep) {
    addSegment(x, -2.7, 4, x, -2.7, -34, 0.08 + (x + 8) * 0.008);
  }
  for (let z = 4; z >= -34; z -= zStep) {
    addSegment(-8, -2.7, z, 8, -2.7, z, 0.12 + (4 - z) * 0.016);
  }
  for (let z = 4; z >= -34; z -= zStep * 2) {
    addSegment(-8, 3.8, z, 8, 3.8, z, 0.18 + (4 - z) * 0.012);
  }

  // Side ribs and horizontal rails.
  for (let z = 4; z >= -34; z -= zStep) {
    const order = 0.16 + (4 - z) * 0.012;
    addSegment(-8, -2.7, z, -8, 3.8, z, order);
    addSegment(8, -2.7, z, 8, 3.8, z, order);
  }
  for (const y of [-2.7, 0.5, 3.8]) {
    addSegment(-8, y, 4, -8, y, -34, 0.22);
    addSegment(8, y, 4, 8, y, -34, 0.22);
  }

  // Portal frames: the deeper frames resolve last.
  for (const [z, order] of [
    [-11, 0.48],
    [-21, 0.64],
    [-31, 0.8],
  ] as const) {
    addSegment(-4.2, -2.7, z, -4.2, 3.2, z, order);
    addSegment(4.2, -2.7, z, 4.2, 3.2, z, order);
    addSegment(-4.2, 3.2, z, 4.2, 3.2, z, order);
    addSegment(-4.2, -2.7, z, 4.2, -2.7, z, order);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    "aOrder",
    new THREE.BufferAttribute(new Float32Array(orders), 1),
  );
  return geometry;
}

function makeConstructMaterial(
  THREE: typeof ThreeTypes,
  color: number,
  opacity: number,
) {
  return new THREE.ShaderMaterial({
    vertexShader: constructVertexShader,
    fragmentShader: constructFragmentShader,
    uniforms: {
      uBuild: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function makeBulletGeometry(THREE: typeof ThreeTypes) {
  // A jacketed rifle projectile: flat base, boat tail, bearing surface,
  // crimp groove, ogive nose. Points run base -> tip so the lathe normals
  // face outward.
  const profile = [
    [0, -0.47],
    [0.056, -0.47],
    [0.111, -0.2],
    [0.104, -0.175],
    [0.112, -0.15],
    [0.112, -0.06],
    [0.113, 0.06],
    [0.112, 0.2],
    [0.108, 0.24],
    [0.103, 0.29],
    [0.096, 0.34],
    [0.088, 0.39],
    [0.079, 0.44],
    [0.068, 0.48],
    [0.056, 0.52],
    [0.044, 0.555],
    [0.032, 0.585],
    [0.02, 0.61],
    [0.009, 0.625],
    [0, 0.63],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const geometry = new THREE.LatheGeometry(profile, 48);
  geometry.computeVertexNormals();
  geometry.translate(0, -0.079, 0);

  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const brass = new THREE.Color(0xb06a32);
  const copper = new THREE.Color(0xd47d3f);
  const graphite = new THREE.Color(0x241b16);
  const darkBrass = new THREE.Color(0x6e3f1d);
  const color = new THREE.Color();

  for (let index = 0; index < position.count; index += 1) {
    const y = position.getY(index);
    const baseMix = 1 - smoothstep(-0.46, -0.39, y);

    color.copy(brass).lerp(darkBrass, baseMix);
    if (y > 0.23 && y < 0.3) color.copy(copper);
    if (y >= 0.3) color.copy(graphite);
    if (y > -0.19 && y < -0.135) color.multiplyScalar(0.34);
    if (y > 0.6) color.multiplyScalar(0.5);

    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function makeBulletRoughnessTexture(THREE: typeof ThreeTypes) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#a4a4a4";
    context.fillRect(0, 0, size, size);

    // Six shallow rifling marks running the length of the bearing surface.
    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    for (let index = 0; index < 6; index += 1) {
      const x = (index / 6) * size + size / 12;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, size);
      context.stroke();
    }

    context.strokeStyle = "rgba(120,120,120,0.18)";
    context.lineWidth = 1;
    for (let x = 0; x < size; x += 8) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, size);
      context.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  return texture;
}

function makeTracerMaterial(THREE: typeof ThreeTypes, tint: number) {
  return new THREE.ShaderMaterial({
    vertexShader: tracerVertexShader,
    fragmentShader: tracerFragmentShader,
    uniforms: {
      uOpacity: { value: 0 },
      uTint: { value: new THREE.Color(tint) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

function makeRing(THREE: typeof ThreeTypes, radius: number, segments = 128) {
  const points: ThreeTypes.Vector3[] = [];
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ),
    );
  }
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: 0x45ff92,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function makeGlowTexture(THREE: typeof ThreeTypes, warm = false) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    if (warm) {
      gradient.addColorStop(0.12, "rgba(255,235,208,0.96)");
      gradient.addColorStop(0.35, "rgba(255,145,74,0.34)");
      gradient.addColorStop(1, "rgba(255,94,38,0)");
    } else {
      gradient.addColorStop(0.12, "rgba(232,255,239,0.95)");
      gradient.addColorStop(0.35, "rgba(69,255,146,0.32)");
      gradient.addColorStop(1, "rgba(69,255,146,0)");
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function makeShockwaveTexture(THREE: typeof ThreeTypes) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const center = size / 2;
    const gradient = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center,
    );
    gradient.addColorStop(0, "rgba(255,170,110,0)");
    gradient.addColorStop(0.5, "rgba(255,170,110,0)");
    gradient.addColorStop(0.59, "rgba(255,196,146,0.12)");
    gradient.addColorStop(0.64, "rgba(255,178,118,0.66)");
    gradient.addColorStop(0.7, "rgba(255,130,72,0.2)");
    gradient.addColorStop(0.82, "rgba(255,94,42,0.05)");
    gradient.addColorStop(1, "rgba(255,94,42,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function makeCatTexture(THREE: typeof ThreeTypes) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const ink = "rgba(1, 5, 2, 0.98)";
    const rim = "rgba(69, 255, 146, 0.46)";

    context.fillStyle = ink;
    context.strokeStyle = rim;
    context.lineWidth = 2;

    // Body.
    context.beginPath();
    context.ellipse(118, 154, 56, 31, -0.06, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    // Head.
    context.beginPath();
    context.arc(181, 123, 25, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    // Ears.
    for (const [x, y, dx] of [
      [164, 107, -13],
      [190, 106, 12],
    ] as const) {
      context.beginPath();
      context.moveTo(x - 8, y + 11);
      context.lineTo(x + dx, y - 17);
      context.lineTo(x + 10, y + 8);
      context.closePath();
      context.fill();
      context.stroke();
    }

    // Legs.
    for (const x of [84, 106, 128, 148]) {
      context.beginPath();
      context.roundRect(x, 170, 8, 38, 4);
      context.fill();
      context.stroke();
    }

    // Tail: a green keyline under a dark core.
    context.strokeStyle = rim;
    context.lineWidth = 11;
    context.beginPath();
    context.moveTo(69, 148);
    context.bezierCurveTo(31, 137, 25, 96, 53, 74);
    context.stroke();
    context.strokeStyle = ink;
    context.lineWidth = 7;
    context.stroke();

    // Eye glint.
    context.fillStyle = "rgba(69, 255, 146, 0.9)";
    context.beginPath();
    context.arc(190, 117, 2.4, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function ConstructScene() {
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
        const section = canvas.closest<HTMLElement>(".construct");

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !lowPower,
          powerPreference: lowPower ? "low-power" : "high-performance",
          stencil: false,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x031008, 0.034);

        let environmentTexture: ThreeTypes.Texture | null = null;
        try {
          const { RoomEnvironment } = await import(
            "three/addons/environments/RoomEnvironment.js"
          );
          if (cancelled) return;
          const pmrem = new THREE.PMREMGenerator(renderer);
          const environmentScene = new RoomEnvironment();
          environmentTexture = pmrem.fromScene(environmentScene, 0.04).texture;
          scene.environment = environmentTexture;
          scene.environmentIntensity = lowPower ? 0.3 : 0.44;
          environmentScene.dispose();
          pmrem.dispose();
        } catch {
          // The point and directional lights below still carry the scene.
        }

        const keyLight = new THREE.DirectionalLight(0xffd8b2, 3.1);
        keyLight.position.set(5, 7, 3);
        const rimLight = new THREE.DirectionalLight(0x45ff92, 2.2);
        rimLight.position.set(-6, 2.5, -14);
        const skyLight = new THREE.HemisphereLight(0x76ffc2, 0x020604, 0.36);
        scene.add(keyLight, rimLight, skyLight);

        const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 100);
        const lookAt = new THREE.Vector3(0, 0, -10);
        const cameraLight = new THREE.PointLight(0xfff0dc, 7, 15, 2);
        scene.add(cameraLight);

        const constructGeometry = makeConstructGeometry(THREE, lowPower);
        const constructMaterial = makeConstructMaterial(THREE, 0x45ff92, 0.8);
        const construct = new THREE.LineSegments(
          constructGeometry,
          constructMaterial,
        );
        scene.add(construct);

        const ghostMaterial = makeConstructMaterial(THREE, 0xff4e58, 0);
        ghostMaterial.uniforms.uBuild.value = 1;
        const constructGhost = new THREE.LineSegments(
          constructGeometry,
          ghostMaterial,
        );
        constructGhost.position.set(0.22, 0.08, 0.1);
        scene.add(constructGhost);

        const portalGroup = new THREE.Group();
        const portals = [
          { z: -12, radius: 3.6, speed: 0.11 },
          { z: -22, radius: 5.2, speed: -0.07 },
          { z: -32, radius: 6.8, speed: 0.045 },
        ].map((portal) => {
          const ring = makeRing(THREE, portal.radius);
          ring.position.set(0, 0.5, portal.z);
          portalGroup.add(ring);
          return { ring, speed: portal.speed };
        });
        scene.add(portalGroup);

        const random = mulberry32(619);
        const bulletCount = lowPower ? 12 : 20;
        const glowTexture = makeGlowTexture(THREE);
        const warmGlowTexture = makeGlowTexture(THREE, true);
        const heroColor = new THREE.Color(0xff6a3d);
        const warmTracer = new THREE.Color(0xffb066);
        const paleTracer = new THREE.Color(0xffd7a0);
        const green = new THREE.Color(0x45ff92);
        const pale = new THREE.Color(0xbfffd5);

        type BulletState = {
          group: ThreeTypes.Group;
          direction: ThreeTypes.Vector3;
          baseQuaternion: ThreeTypes.Quaternion;
          start: ThreeTypes.Vector3;
          speed: number;
          offset: number;
          trailLength: number;
          trailWidth: number;
          color: ThreeTypes.Color;
          spin: number;
          spinSpeed: number;
          scale: number;
          hero: boolean;
        };

        const bulletGeometry = makeBulletGeometry(THREE);
        const bulletRoughnessTexture = makeBulletRoughnessTexture(THREE);
        const bulletMaterial = new THREE.MeshStandardMaterial({
          vertexColors: true,
          metalness: 1,
          roughness: 0.28,
          roughnessMap: bulletRoughnessTexture,
          metalnessMap: bulletRoughnessTexture,
          envMapIntensity: 1.8,
          emissive: 0x0c0400,
          emissiveIntensity: 0.2,
        });
        const up = new THREE.Vector3(0, 1, 0);
        const bulletHalfLength = 0.55;
        const bullets: BulletState[] = [];

        for (let index = 0; index < bulletCount; index += 1) {
          const hero = index === 0;
          const heroDirection = new THREE.Vector3(1, 0.015, 0.04).normalize();
          // One coherent volley: every round travels with the hero, with
          // only small dispersion in height and depth.
          const volleyDirection = new THREE.Vector3(
            1,
            (random() * 2 - 1) * 0.05,
            (random() * 2 - 1) * 0.12,
          ).normalize();
          const direction = hero ? heroDirection : volleyDirection;
          const scale = hero ? 1.15 : 0.7 + random() * 0.28;
          const start = hero
            ? new THREE.Vector3(-2.4, 0.25, -8.2)
            : new THREE.Vector3(
                -11.5,
                -1.6 + random() * 4.2,
                -2.6 - random() * 17.4,
              );

          const group = new THREE.Group();
          const mesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
          mesh.scale.setScalar(scale);
          group.add(mesh);
          group.position.copy(start);

          const baseQuaternion = new THREE.Quaternion().setFromUnitVectors(
            up,
            direction,
          );
          group.quaternion.copy(baseQuaternion);
          scene.add(group);

          const color = hero
            ? heroColor.clone()
            : random() > 0.78
              ? paleTracer.clone()
              : warmTracer.clone();

          bullets.push({
            group,
            direction,
            baseQuaternion,
            start,
            speed: 4.2 + random() * 7.5,
            offset: random() * 26,
            trailLength: hero ? 5.2 : 2.2 + random() * 3.4,
            trailWidth: hero ? 0.23 : 0.08 + random() * 0.07,
            color,
            spin: random() * Math.PI * 2,
            spinSpeed: 8 + random() * 10,
            scale,
            hero,
          });
        }

        const trailVertexCount = bulletCount * 4;
        const trailPositionArray = new Float32Array(trailVertexCount * 3);
        const trailColorArray = new Float32Array(trailVertexCount * 3);
        const trailCoordArray = new Float32Array(trailVertexCount * 2);
        const trailIndexArray: number[] = [];

        for (let index = 0; index < bulletCount; index += 1) {
          const vertex = index * 4;
          const color = bullets[index].color;
          for (let corner = 0; corner < 4; corner += 1) {
            const offset = (vertex + corner) * 3;
            const coord = (vertex + corner) * 2;
            trailColorArray[offset] = color.r;
            trailColorArray[offset + 1] = color.g;
            trailColorArray[offset + 2] = color.b;
            trailCoordArray[coord] = corner % 2;
            trailCoordArray[coord + 1] = corner < 2 ? 0 : 1;
          }
          trailIndexArray.push(
            vertex,
            vertex + 1,
            vertex + 2,
            vertex + 2,
            vertex + 1,
            vertex + 3,
          );
        }

        const trailGeometry = new THREE.BufferGeometry();
        const trailPositionAttribute = new THREE.BufferAttribute(
          trailPositionArray,
          3,
        );
        trailPositionAttribute.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.setAttribute("position", trailPositionAttribute);
        trailGeometry.setAttribute(
          "aTrailColor",
          new THREE.BufferAttribute(trailColorArray, 3),
        );
        trailGeometry.setAttribute(
          "aTrail",
          new THREE.BufferAttribute(trailCoordArray, 2),
        );
        trailGeometry.setIndex(trailIndexArray);

        const trailMaterial = makeTracerMaterial(THREE, 0xffffff);
        trailMaterial.uniforms.uOpacity.value = 0.72;
        const trails = new THREE.Mesh(trailGeometry, trailMaterial);
        trails.frustumCulled = false;
        trails.renderOrder = 4;
        scene.add(trails);

        const tracerLinePositions = new Float32Array(bulletCount * 6);
        const tracerLineColors = new Float32Array(bulletCount * 6);
        bullets.forEach((bullet, index) => {
          const offset = index * 6;
          const headColor =
            index === 0
              ? new THREE.Color(0xfff1d8)
              : new THREE.Color(0xffd19a);
          const tailColor = bullet.color.clone().multiplyScalar(0.55);
          tracerLineColors[offset] = headColor.r;
          tracerLineColors[offset + 1] = headColor.g;
          tracerLineColors[offset + 2] = headColor.b;
          tracerLineColors[offset + 3] = tailColor.r;
          tracerLineColors[offset + 4] = tailColor.g;
          tracerLineColors[offset + 5] = tailColor.b;
        });
        const tracerLineGeometry = new THREE.BufferGeometry();
        const tracerLinePositionAttribute = new THREE.BufferAttribute(
          tracerLinePositions,
          3,
        );
        tracerLinePositionAttribute.setUsage(THREE.DynamicDrawUsage);
        tracerLineGeometry.setAttribute(
          "position",
          tracerLinePositionAttribute,
        );
        tracerLineGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(tracerLineColors, 3),
        );
        const tracerLineMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.82,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const tracerLines = new THREE.LineSegments(
          tracerLineGeometry,
          tracerLineMaterial,
        );
        tracerLines.frustumCulled = false;
        tracerLines.renderOrder = 5;
        scene.add(tracerLines);

        const tracerGlowPositions = new Float32Array(bulletCount * 3);
        const tracerGlowColors = new Float32Array(bulletCount * 3);

        bullets.forEach((bullet, index) => {
          const offset = index * 3;
          const base = bullet.group.position
            .clone()
            .addScaledVector(
              bullet.direction,
              -bulletHalfLength * bullet.scale,
            );
          tracerGlowPositions[offset] = base.x;
          tracerGlowPositions[offset + 1] = base.y;
          tracerGlowPositions[offset + 2] = base.z;
          tracerGlowColors[offset] = bullet.color.r;
          tracerGlowColors[offset + 1] = bullet.color.g;
          tracerGlowColors[offset + 2] = bullet.color.b;
        });

        const tracerGlowGeometry = new THREE.BufferGeometry();
        tracerGlowGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(tracerGlowPositions, 3),
        );
        tracerGlowGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(tracerGlowColors, 3),
        );
        const tracerGlowMaterial = new THREE.PointsMaterial({
          map: warmGlowTexture,
          size: lowPower ? 0.58 : 0.46,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.9,
          vertexColors: true,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });
        const tracerGlow = new THREE.Points(
          tracerGlowGeometry,
          tracerGlowMaterial,
        );
        tracerGlow.frustumCulled = false;
        tracerGlow.renderOrder = 5;
        scene.add(tracerGlow);

        const heroTracerMaterial = new THREE.SpriteMaterial({
          map: warmGlowTexture,
          color: 0xffb077,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        const heroTracer = new THREE.Sprite(heroTracerMaterial);
        heroTracer.scale.set(0.95, 0.95, 1);
        heroTracer.position.copy(bullets[0].group.position);
        heroTracer.renderOrder = 6;
        scene.add(heroTracer);

        const bulletLight = new THREE.PointLight(0xff6a3d, 16, 6, 2);
        bulletLight.position.copy(bullets[0].group.position);
        scene.add(bulletLight);

        const ringNormal = new THREE.Vector3(0, 0, 1);
        const shockwave = makeRing(THREE, 0.58, 96);
        shockwave.quaternion.setFromUnitVectors(
          ringNormal,
          bullets[0].direction,
        );
        shockwave.position.copy(bullets[0].group.position);
        const shockwaveMaterial =
          shockwave.material as ThreeTypes.LineBasicMaterial;
        shockwaveMaterial.color.setHex(0xffa25e);
        shockwaveMaterial.opacity = 0.26;
        scene.add(shockwave);

        const shockwaveOuter = makeRing(THREE, 1.05, 96);
        shockwaveOuter.quaternion.setFromUnitVectors(
          ringNormal,
          bullets[0].direction,
        );
        shockwaveOuter.position.copy(bullets[0].group.position);
        const shockwaveOuterMaterial =
          shockwaveOuter.material as ThreeTypes.LineBasicMaterial;
        shockwaveOuterMaterial.color.setHex(0xff5a3c);
        shockwaveOuterMaterial.opacity = 0.08;
        scene.add(shockwaveOuter);

        const shockwaveTexture = makeShockwaveTexture(THREE);
        const shockwaveRingGeometry = new THREE.PlaneGeometry(2, 2);
        const shockwaveRingMaterial = new THREE.MeshBasicMaterial({
          map: shockwaveTexture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        const shockwaveRing = new THREE.Mesh(
          shockwaveRingGeometry,
          shockwaveRingMaterial,
        );
        shockwaveRing.quaternion.setFromUnitVectors(
          ringNormal,
          bullets[0].direction,
        );
        shockwaveRing.position.copy(bullets[0].group.position);
        shockwaveRing.renderOrder = 4;
        scene.add(shockwaveRing);

        const shockwaveRingOuterMaterial = new THREE.MeshBasicMaterial({
          map: shockwaveTexture,
          color: 0xffc09a,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        const shockwaveRingOuter = new THREE.Mesh(
          shockwaveRingGeometry,
          shockwaveRingOuterMaterial,
        );
        shockwaveRingOuter.quaternion.copy(shockwaveRing.quaternion);
        shockwaveRingOuter.position.copy(bullets[0].group.position);
        shockwaveRingOuter.scale.setScalar(1.32);
        shockwaveRingOuter.renderOrder = 3;
        scene.add(shockwaveRingOuter);

        const shockwaveHaloMaterial = new THREE.SpriteMaterial({
          map: warmGlowTexture,
          color: 0xffd0b0,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        const shockwaveHalo = new THREE.Sprite(shockwaveHaloMaterial);
        shockwaveHalo.scale.set(2.2, 2.2, 1);
        shockwaveHalo.position.copy(bullets[0].group.position);
        shockwaveHalo.renderOrder = 6;
        scene.add(shockwaveHalo);

        const ghostTrailMaterial = makeTracerMaterial(THREE, 0xff5a4a);
        ghostTrailMaterial.uniforms.uOpacity.value = 0;
        const ghostTrails = new THREE.Mesh(
          trailGeometry,
          ghostTrailMaterial,
        );
        ghostTrails.position.x = 0.16;
        ghostTrails.frustumCulled = false;
        ghostTrails.renderOrder = 3;
        scene.add(ghostTrails);

        const dustCount = lowPower ? 140 : 320;
        const dustPositions = new Float32Array(dustCount * 3);
        const dustColors = new Float32Array(dustCount * 3);
        for (let index = 0; index < dustCount; index += 1) {
          const offset = index * 3;
          dustPositions[offset] = (random() * 2 - 1) * 13;
          dustPositions[offset + 1] = (random() * 2 - 1) * 7;
          dustPositions[offset + 2] = 4 - random() * 40;
          const color = random() > 0.88 ? pale : green;
          const intensity = 0.16 + random() * 0.38;
          dustColors[offset] = color.r * intensity;
          dustColors[offset + 1] = color.g * intensity;
          dustColors[offset + 2] = color.b * intensity;
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(dustPositions, 3),
        );
        dustGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(dustColors, 3),
        );
        const dustMaterial = new THREE.PointsMaterial({
          map: glowTexture,
          size: 0.065,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.5,
          vertexColors: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const dust = new THREE.Points(dustGeometry, dustMaterial);
        dust.frustumCulled = false;
        scene.add(dust);

        const freezeMoteCount = lowPower ? 38 : 76;
        const freezePositions = new Float32Array(freezeMoteCount * 3);
        const freezeColors = new Float32Array(freezeMoteCount * 3);
        for (let index = 0; index < freezeMoteCount; index += 1) {
          const offset = index * 3;
          const angle = random() * Math.PI * 2;
          const radius = 0.8 + random() * 3.1;
          freezePositions[offset] = Math.cos(angle) * radius;
          freezePositions[offset + 1] = (random() * 2 - 1) * 1.7;
          freezePositions[offset + 2] = Math.sin(angle) * radius * 0.72;
          const color = random() > 0.74 ? warmTracer : pale;
          const intensity = 0.2 + random() * 0.4;
          freezeColors[offset] = color.r * intensity;
          freezeColors[offset + 1] = color.g * intensity;
          freezeColors[offset + 2] = color.b * intensity;
        }
        const freezeGeometry = new THREE.BufferGeometry();
        freezeGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(freezePositions, 3),
        );
        freezeGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(freezeColors, 3),
        );
        const freezeMaterial = new THREE.PointsMaterial({
          map: warmGlowTexture,
          size: lowPower ? 0.075 : 0.055,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0,
          vertexColors: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const freezeMotes = new THREE.Points(freezeGeometry, freezeMaterial);
        freezeMotes.position.set(0, 0.25, -8.2);
        freezeMotes.frustumCulled = false;
        freezeMotes.renderOrder = 4;
        scene.add(freezeMotes);

        const catTexture = makeCatTexture(THREE);
        const catMaterial = new THREE.SpriteMaterial({
          map: catTexture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: false,
          toneMapped: false,
        });
        const cat = new THREE.Sprite(catMaterial);
        cat.scale.set(1.35, 1.35, 1);
        cat.position.set(-5.2, -2.2, -7.8);
        cat.visible = false;
        cat.renderOrder = 10;
        scene.add(cat);

        let smoothProgress = reduceMotion ? 0.54 : 0;
        let time = 0;
        let lastFrame = performance.now();
        let animationFrame = 0;
        let running = false;
        let inView = !section;
        let pageVisible = !document.hidden;

        const updateSize = () => {
          const rect = canvas.getBoundingClientRect();
          const width = Math.max(1, Math.round(rect.width));
          const height = Math.max(1, Math.round(rect.height));
          const dpr = Math.min(
            window.devicePixelRatio || 1,
            lowPower ? 1.15 : 1.6,
          );
          renderer.setPixelRatio(dpr);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          if (reduceMotion) {
            applyScene(0.54, 0, 0);
            renderer.render(scene, camera);
          }
        };

        const cameraPath = new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(0, 0.72, 11.2),
            new THREE.Vector3(-0.25, 0.6, 3),
            new THREE.Vector3(-1.95, 0.45, -5),
            new THREE.Vector3(0.15, 0.55, -4.7),
            new THREE.Vector3(3, 0.7, -6),
            new THREE.Vector3(2.7, 0.55, -10.6),
            new THREE.Vector3(3.35, 1.1, -1.5),
            new THREE.Vector3(3, 1.12, 4.2),
          ],
          false,
          "centripetal",
        );
        cameraPath.arcLengthDivisions = 600;
        cameraPath.updateArcLengths();

        const targetPath = new THREE.CatmullRomCurve3(
          [
            new THREE.Vector3(0, 0.18, -13),
            new THREE.Vector3(0, 0.2, -10.8),
            new THREE.Vector3(0, 0.24, -8.2),
            new THREE.Vector3(0, 0.24, -8.2),
            new THREE.Vector3(0, 0.24, -8.2),
            new THREE.Vector3(0, 0.2, -8.3),
            new THREE.Vector3(0, 0.12, -10.5),
            new THREE.Vector3(0, 0.08, -12),
          ],
          false,
          "centripetal",
        );
        targetPath.arcLengthDivisions = 600;
        targetPath.updateArcLengths();

        const cameraPoint = new THREE.Vector3();
        const targetPoint = new THREE.Vector3();
        const tempView = new THREE.Vector3();
        const tempSide = new THREE.Vector3();
        const tempHead = new THREE.Vector3();
        const tempTail = new THREE.Vector3();
        const tempBase = new THREE.Vector3();
        const tempSpin = new THREE.Quaternion();
        const tracerGlowPositionAttribute =
          tracerGlowGeometry.getAttribute("position") as ThreeTypes.BufferAttribute;

        const updateCamera = (
          progress: number,
          elapsed: number,
          freeze: number,
          glitch: number,
        ) => {
          const p = Math.min(1, Math.max(0, progress));
          cameraPath.getPointAt(p, cameraPoint);
          targetPath.getPointAt(p, targetPoint);

          const focus =
            smoothstep(0.22, 0.34, p) *
            (1 - smoothstep(0.68, 0.8, p));
          const pointerScale = lerp(0.42, 0.17, focus);
          const aspectFrame =
            camera.aspect < 0.86
              ? Math.min(1.7, 0.8 / camera.aspect)
              : 1;

          camera.position
            .copy(cameraPoint)
            .sub(targetPoint)
            .multiplyScalar(aspectFrame)
            .add(targetPoint);
          camera.position.x += simulationState.pointerX * pointerScale;
          camera.position.y +=
            simulationState.pointerY * pointerScale * 0.7;

          lookAt.copy(targetPoint);
          camera.lookAt(lookAt);
          cameraLight.position.copy(camera.position);

          const nextFov = 54 - freeze * 4.2;
          if (Math.abs(camera.fov - nextFov) > 0.01) {
            camera.fov = nextFov;
            camera.updateProjectionMatrix();
          }

          const roll = Math.sin(elapsed * 1.35) * 0.004 * glitch;
          if (Math.abs(roll) > 0.00002) camera.rotateZ(roll);
        };

        const updateBullets = (
          progress: number,
          elapsed: number,
          delta: number,
          freeze: number,
        ) => {
          const hero = bullets[0];
          const heroApproach = smoothstep(0.12, 0.34, progress);
          const heroLeave = smoothstep(0.68, 0.82, progress);
          hero.group.position.set(
            lerp(-2.4, 0, heroApproach) + heroLeave * 10,
            0.25,
            -8.2,
          );

          bullets.forEach((bullet, index) => {
            if (!bullet.hero) {
              const travel =
                (((time * bullet.speed + bullet.offset) % 26) + 26) % 26;
              bullet.group.position
                .copy(bullet.start)
                .addScaledVector(bullet.direction, travel);
            }

            bullet.spin +=
              delta * bullet.spinSpeed * (0.16 + (1 - freeze) * 0.84);
            tempSpin.setFromAxisAngle(up, bullet.spin);
            bullet.group.quaternion
              .copy(bullet.baseQuaternion)
              .multiply(tempSpin);

            tempHead
              .copy(bullet.group.position)
              .addScaledVector(
                bullet.direction,
                -bulletHalfLength * bullet.scale,
              );
            tempTail
              .copy(bullet.group.position)
              .addScaledVector(bullet.direction, -bullet.trailLength);
            tempView.copy(camera.position).sub(tempHead);
            tempSide.crossVectors(bullet.direction, tempView);
            if (tempSide.lengthSq() < 0.00001) {
              tempSide.crossVectors(bullet.direction, camera.up);
            }
            tempSide.normalize();

            const headHalf = 0.018 * bullet.scale;
            const tailHalf = bullet.trailWidth;
            const vertex = index * 12;

            trailPositionArray[vertex] =
              tempHead.x - tempSide.x * headHalf;
            trailPositionArray[vertex + 1] =
              tempHead.y - tempSide.y * headHalf;
            trailPositionArray[vertex + 2] =
              tempHead.z - tempSide.z * headHalf;
            trailPositionArray[vertex + 3] =
              tempHead.x + tempSide.x * headHalf;
            trailPositionArray[vertex + 4] =
              tempHead.y + tempSide.y * headHalf;
            trailPositionArray[vertex + 5] =
              tempHead.z + tempSide.z * headHalf;
            trailPositionArray[vertex + 6] =
              tempTail.x - tempSide.x * tailHalf;
            trailPositionArray[vertex + 7] =
              tempTail.y - tempSide.y * tailHalf;
            trailPositionArray[vertex + 8] =
              tempTail.z - tempSide.z * tailHalf;
            trailPositionArray[vertex + 9] =
              tempTail.x + tempSide.x * tailHalf;
            trailPositionArray[vertex + 10] =
              tempTail.y + tempSide.y * tailHalf;
            trailPositionArray[vertex + 11] =
              tempTail.z + tempSide.z * tailHalf;

            tempBase
              .copy(bullet.group.position)
              .addScaledVector(
                bullet.direction,
                -(bulletHalfLength + 0.09) * bullet.scale,
              );
            const glowOffset = index * 3;
            tracerGlowPositions[glowOffset] = tempBase.x;
            tracerGlowPositions[glowOffset + 1] = tempBase.y;
            tracerGlowPositions[glowOffset + 2] = tempBase.z;

            const lineOffset = index * 6;
            tracerLinePositions[lineOffset] = tempBase.x;
            tracerLinePositions[lineOffset + 1] = tempBase.y;
            tracerLinePositions[lineOffset + 2] = tempBase.z;
            tracerLinePositions[lineOffset + 3] = tempTail.x;
            tracerLinePositions[lineOffset + 4] = tempTail.y;
            tracerLinePositions[lineOffset + 5] = tempTail.z;
          });

          trailPositionAttribute.needsUpdate = true;
          tracerGlowPositionAttribute.needsUpdate = true;
          tracerLinePositionAttribute.needsUpdate = true;

          shockwave.position.copy(hero.group.position);
          shockwaveOuter.position.copy(hero.group.position);
          shockwaveRing.position.copy(hero.group.position);
          shockwaveRingOuter.position.copy(hero.group.position);
          shockwaveHalo.position.copy(hero.group.position);
          heroTracer.position
            .copy(hero.group.position)
            .addScaledVector(
              hero.direction,
              -(bulletHalfLength + 0.2) * hero.scale,
            );
          bulletLight.position.copy(hero.group.position);
        };

        const applyScene = (progress: number, elapsed: number, delta: number) => {
          const build = smoothstep(0.015, 0.31, progress);
          const freeze =
            smoothstep(0.35, 0.43, progress) *
            (1 - smoothstep(0.67, 0.75, progress));
          const glitch =
            smoothstep(0.68, 0.76, progress) *
            (1 - smoothstep(0.9, 0.98, progress));
          const timeScale = 1 - freeze * 0.985;
          const wake =
            smoothstep(0.06, 0.2, progress) *
            (1 - smoothstep(0.68, 0.74, progress));

          time += delta * timeScale;
          constructMaterial.uniforms.uBuild.value = build;
          constructMaterial.uniforms.uTime.value = time;
          constructMaterial.uniforms.uOpacity.value = 0.68 + build * 0.14;
          ghostMaterial.uniforms.uTime.value = time;
          ghostMaterial.uniforms.uOpacity.value = glitch * 0.22;

          updateCamera(progress, elapsed, freeze, glitch);
          updateBullets(progress, elapsed, delta, freeze);

          trailMaterial.uniforms.uOpacity.value =
            (0.58 + build * 0.12 + freeze * 0.06) * wake;
          ghostTrailMaterial.uniforms.uOpacity.value = glitch * 0.34;
          ghostTrails.position.x = 0.12 + glitch * 0.08;
          tracerLineMaterial.opacity =
            (0.58 + build * 0.14 + freeze * 0.14) * wake;
          tracerGlowMaterial.opacity =
            (0.66 + build * 0.1 + freeze * 0.18) * wake;
          heroTracerMaterial.opacity =
            (0.08 + build * 0.08 + freeze * 0.42) * wake;
          bulletLight.intensity = (6 + build * 8 + freeze * 22) * wake;

          portalGroup.rotation.z = time * 0.025;
          portalGroup.children.forEach((portal, index) => {
            portal.rotation.z += delta * portals[index].speed * timeScale;
            const material = (portal as ThreeTypes.LineLoop).material as
              | ThreeTypes.LineBasicMaterial
              | undefined;
            if (material) {
              material.opacity =
                0.04 + build * 0.12 + freeze * 0.1 + glitch * 0.06;
            }
          });

          const pulse = 1 + Math.sin(time * 2.1) * 0.035 + freeze * 0.08;
          shockwave.scale.setScalar(pulse);
          shockwaveOuter.scale.setScalar(1 + Math.sin(time * 1.4) * 0.05);
          shockwaveMaterial.opacity = (0.04 + freeze * 0.12) * wake;
          shockwaveOuterMaterial.opacity =
            (0.01 + freeze * 0.04) * wake;
          shockwaveRing.scale.setScalar(
            1 + Math.sin(time * 1.1) * 0.05 + freeze * 0.08,
          );
          shockwaveRingOuter.scale.setScalar(
            1.32 * (1 + Math.sin(time * 0.8) * 0.05),
          );
          shockwaveRingMaterial.opacity = freeze * 0.3 * wake;
          shockwaveRingOuterMaterial.opacity = freeze * 0.1 * wake;
          shockwaveHaloMaterial.opacity = freeze * 0.28 * wake;

          dust.rotation.y = time * 0.008;
          dustMaterial.opacity = 0.32 + build * 0.16;
          freezeMotes.rotation.z = elapsed * 0.018;
          freezeMotes.rotation.y = elapsed * 0.009;
          freezeMaterial.opacity = freeze * 0.4;

          const catOpacity =
            smoothstep(0.66, 0.74, progress) *
            (1 - smoothstep(0.93, 1, progress));
          cat.visible = catOpacity > 0.001;
          catMaterial.opacity = catOpacity * 0.92;
          const catScale = camera.aspect < 0.8 ? 1.9 : 1.35;
          const catSpan = camera.aspect < 0.8 ? 0.8 : 5.2;
          cat.scale.set(catScale, catScale, 1);
          cat.position.x = lerp(
            -catSpan,
            catSpan,
            smoothstep(0.66, 0.94, progress),
          );
          cat.position.y = -2.2 + Math.sin(time * 2.2) * 0.015;
        };

        const render = (now: number) => {
          if (!running) return;
          const delta = Math.min((now - lastFrame) / 1000, 0.034);
          lastFrame = now;
          smoothProgress = damp(
            smoothProgress,
            simulationState.construct,
            11,
            delta,
          );
          applyScene(smoothProgress, now / 1000, delta);
          renderer.render(scene, camera);
          animationFrame = requestAnimationFrame(render);
        };

        const syncRunning = () => {
          if (reduceMotion) return;
          const next = inView && pageVisible;
          if (next && !running) {
            running = true;
            lastFrame = performance.now();
            animationFrame = requestAnimationFrame(render);
          } else if (!next && running) {
            running = false;
            cancelAnimationFrame(animationFrame);
          }
        };

        const onVisibility = () => {
          pageVisible = !document.hidden;
          syncRunning();
        };

        const onContextLost = (event: Event) => {
          event.preventDefault();
        };

        let observer: IntersectionObserver | null = null;
        if (section && "IntersectionObserver" in window) {
          observer = new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              syncRunning();
            },
            { rootMargin: "20% 0px" },
          );
          observer.observe(section);
        }

        updateSize();
        smoothProgress = reduceMotion ? 0.54 : 0;
        applyScene(smoothProgress, 0, 0);
        renderer.render(scene, camera);
        section?.classList.add("has-webgl");

        window.addEventListener("resize", updateSize);
        document.addEventListener("visibilitychange", onVisibility);
        canvas.addEventListener("webglcontextlost", onContextLost);

        if (!reduceMotion) {
          inView = true;
          syncRunning();
        }

        cleanup = () => {
          running = false;
          cancelAnimationFrame(animationFrame);
          observer?.disconnect();
          window.removeEventListener("resize", updateSize);
          document.removeEventListener("visibilitychange", onVisibility);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          constructGeometry.dispose();
          constructMaterial.dispose();
          ghostMaterial.dispose();
          bulletGeometry.dispose();
          bulletMaterial.dispose();
          bulletRoughnessTexture.dispose();
          trailGeometry.dispose();
          trailMaterial.dispose();
          ghostTrailMaterial.dispose();
          tracerLineGeometry.dispose();
          tracerLineMaterial.dispose();
          tracerGlowGeometry.dispose();
          tracerGlowMaterial.dispose();
          heroTracerMaterial.dispose();
          glowTexture.dispose();
          warmGlowTexture.dispose();
          dustGeometry.dispose();
          dustMaterial.dispose();
          freezeGeometry.dispose();
          freezeMaterial.dispose();
          catTexture.dispose();
          catMaterial.dispose();
          portals.forEach(({ ring }) => {
            ring.geometry.dispose();
            (ring.material as ThreeTypes.Material).dispose();
          });
          shockwave.geometry.dispose();
          (shockwave.material as ThreeTypes.Material).dispose();
          shockwaveOuter.geometry.dispose();
          (shockwaveOuter.material as ThreeTypes.Material).dispose();
          shockwaveRingGeometry.dispose();
          shockwaveRingMaterial.dispose();
          shockwaveRingOuterMaterial.dispose();
          shockwaveTexture.dispose();
          shockwaveHaloMaterial.dispose();
          environmentTexture?.dispose();
          renderer.dispose();
          section?.classList.remove("has-webgl");
        };
      } catch (error) {
        console.warn("Construct scene unavailable; using CSS fallback.", error);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className="construct-canvas" aria-hidden="true" />;
}
