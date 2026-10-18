"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
export type WorldInput = { progress: number; x: number; y: number };
const vertexDeform = `
 uniform float uMorph; uniform float uScatter; uniform float uTime;
 attribute vec3 aSphere;attribute vec3 aOrbit;
 vec3 form(){
  vec3 p=mix(position,aSphere,clamp(uMorph,0.,1.));
  p=mix(p,aOrbit,clamp(uMorph-1.,0.,1.));
  vec3 direction=normalize(p+vec3(.01));
  p+=direction*uScatter*(.9+sin(position.y*3.+position.x)*.25);
  p.z+=sin(p.x*2.+uTime*.25)*.018*clamp(uMorph,0.,1.);
  return p;
 }`;
function makeGeometry() {
  const p: number[] = [],
    sphere: number[] = [],
    orbit: number[] = [],
    indices: number[] = [];
  const rows = 38,
    sides = 10;
  for (let bar = 0; bar < 3; bar++) {
    const a =
      bar === 0
        ? new THREE.Vector3(-1.25, -1.4, 0)
        : bar === 1
          ? new THREE.Vector3(-1.25, 1.4, 0)
          : new THREE.Vector3(1.25, -1.4, 0);
    const b =
      bar === 0
        ? new THREE.Vector3(-1.25, 1.4, 0)
        : bar === 1
          ? new THREE.Vector3(1.25, -1.4, 0)
          : new THREE.Vector3(1.25, 1.4, 0);
    const d = b.clone().sub(a).normalize(),
      side = new THREE.Vector3(-d.y, d.x, 0);
    for (let row = 0; row < rows; row++)
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2 + row * 0.025;
        const point = a
          .clone()
          .lerp(b, row / (rows - 1))
          .addScaledVector(side, Math.cos(angle) * 0.29);
        point.z = Math.sin(angle) * 0.29;
        p.push(point.x, point.y, point.z);
        const i = bar * rows * sides + row * sides + j;
        const latitude = (row / (rows - 1)) * Math.PI;
        const longitude =
          (j / sides) * Math.PI * 2 + (bar * Math.PI * 2) / (sides * 3);
        sphere.push(
          Math.cos(longitude) * Math.sin(latitude) * 1.8,
          Math.cos(latitude) * 1.8,
          Math.sin(longitude) * Math.sin(latitude) * 1.8,
        );
        const u = (row / (rows - 1) + bar / 3) * Math.PI * 2,
          v = (j / sides) * Math.PI * 2;
        const radius = 1.8 + 0.28 * Math.cos(v);
        orbit.push(
          Math.cos(u) * radius,
          Math.sin(u) * radius,
          Math.sin(v) * 0.28,
        );
        if (row < rows - 1) indices.push(i, i + sides);
        indices.push(i, bar * rows * sides + row * sides + ((j + 1) % sides));
      }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  geometry.setAttribute("aSphere", new THREE.Float32BufferAttribute(sphere, 3));
  geometry.setAttribute("aOrbit", new THREE.Float32BufferAttribute(orbit, 3));
  const line = geometry.clone();
  line.setIndex(indices);
  const shape = new THREE.Shape();
  shape.moveTo(-1.5, -1.55);
  shape.lineTo(-0.89, -1.55);
  shape.lineTo(-0.89, 0.45);
  shape.lineTo(0.89, -1.55);
  shape.lineTo(1.5, -1.55);
  shape.lineTo(1.5, 1.55);
  shape.lineTo(0.89, 1.55);
  shape.lineTo(0.89, -0.45);
  shape.lineTo(-0.89, 1.55);
  shape.lineTo(-1.5, 1.55);
  shape.closePath();
  const crystal = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.085,
    bevelThickness: 0.09,
  });
  crystal.translate(0, 0, -0.16);
  const dust = new Float32Array(260 * 3);
  for (let i = 0; i < 260; i++) {
    const seed = Math.sin(i * 127.1 + 3) * 43758.5453;
    const f = seed - Math.floor(seed);
    const s = Math.sin(i * 311.7 + 9) * 23421.631;
    const g = s - Math.floor(s);
    dust[i * 3] = (f - 0.5) * 19;
    dust[i * 3 + 1] = (g - 0.5) * 12;
    dust[i * 3 + 2] = -2 - (i % 11) * 0.4;
  }
  return { geometry, line, crystal, dust };
}
const keyframes = [
  { x: 1.7, y: 0, z: 8.7, morph: 0, tone: 0, angle: -0.28, scale: 1 },
  { x: -1.8, y: 0.1, z: 8.6, morph: 1, tone: 0, angle: 0.25, scale: 0.92 },
  { x: 2, y: 0.2, z: 8.5, morph: 1, tone: 1, angle: 0.65, scale: 0.95 },
  { x: 0, y: -1.05, z: 8, morph: 2, tone: 1, angle: -0.25, scale: 1.02 },
  { x: 1.9, y: 0.1, z: 9.4, morph: 0, tone: 0, angle: -0.3, scale: 0.93 },
];
function StudioEnvironment() {
  const { gl } = useThree();
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let disposed = false;
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.04);
    queueMicrotask(() => {
      if (!disposed) setMap(target.texture);
    });
    return () => {
      disposed = true;
      target.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl]);
  return map ? <primitive attach="environment" object={map} /> : null;
}
function ConnectedSculpture({
  input,
  enabled,
  mode,
  rotation,
  chapter,
}: {
  input: RefObject<WorldInput>;
  enabled: boolean;
  mode: number;
  rotation: number;
  chapter: string;
}) {
  const group = useRef<THREE.Group>(null),
    nMesh = useRef<THREE.Mesh>(null),
    core = useRef<THREE.Mesh>(null);
  const nMaterial = useRef<THREE.MeshPhysicalMaterial>(null),
    coreMaterial = useRef<THREE.MeshPhysicalMaterial>(null),
    points = useRef<THREE.ShaderMaterial>(null),
    lines = useRef<THREE.ShaderMaterial>(null),
    dust = useRef<THREE.PointsMaterial>(null);
  const smooth = useRef({
    p: 0,
    x: 0,
    y: 0,
    angle: 0,
    time: 0,
    tone: 0,
    morph: 0,
    scatter: 0,
  });
  const background = useRef<THREE.Color>(null);
  const backgroundColors = useMemo(
    () => [new THREE.Color("#f3f6f8"), new THREE.Color("#0d1a29")],
    [],
  );
  const data = useMemo(() => makeGeometry(), []);
  const pointUniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uScatter: { value: 0 },
      uTime: { value: 0 },
      uTone: { value: 0 },
    }),
    [],
  );
  const lineUniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uScatter: { value: 0 },
      uTime: { value: 0 },
      uTone: { value: 0 },
    }),
    [],
  );
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [enabled, mode, rotation, chapter, invalidate]);
  useEffect(
    () => () => {
      data.geometry.dispose();
      data.line.dispose();
      data.crystal.dispose();
    },
    [data],
  );
  useFrame((state, delta) => {
    if (!state.gl.domElement.dataset.rendered)
      state.gl.domElement.dataset.rendered = "true";
    const dt = Math.min(delta, 0.05),
      damp = enabled ? 1 - Math.exp(-dt * 4.2) : 1;
    smooth.current.p = THREE.MathUtils.lerp(
      smooth.current.p,
      input.current.progress,
      damp,
    );
    smooth.current.x = THREE.MathUtils.lerp(
      smooth.current.x,
      enabled ? input.current.x : 0,
      damp,
    );
    smooth.current.y = THREE.MathUtils.lerp(
      smooth.current.y,
      enabled ? input.current.y : 0,
      damp,
    );
    smooth.current.angle = THREE.MathUtils.lerp(
      smooth.current.angle,
      (rotation / 180) * Math.PI,
      damp,
    );
    if (enabled) smooth.current.time += dt;
    const p = Math.max(0, Math.min(4, smooth.current.p)),
      index = Math.min(3, Math.floor(p)),
      fraction = p - index,
      t = fraction * fraction * (3 - 2 * fraction);
    const a = keyframes[index],
      b = keyframes[index + 1];
    const blend = (key: keyof typeof a) =>
      THREE.MathUtils.lerp(a[key], b[key], t);
    const labWeight = Math.max(0, 1 - Math.abs(p - 3));
    const modeMorph = mode === 0 ? 0 : 2;
    const targetMorph = THREE.MathUtils.lerp(
      blend("morph"),
      modeMorph,
      labWeight,
    );
    smooth.current.morph = THREE.MathUtils.lerp(
      smooth.current.morph,
      targetMorph,
      damp,
    );
    smooth.current.scatter = THREE.MathUtils.lerp(
      smooth.current.scatter,
      mode === 2 ? labWeight * 1.6 : 0,
      damp,
    );
    const morph = smooth.current.morph;
    smooth.current.tone = THREE.MathUtils.lerp(
      smooth.current.tone,
      chapter === "skills" || chapter === "world" ? 1 : 0,
      damp,
    );
    if (background.current)
      background.current.lerp(
        backgroundColors[chapter === "skills" || chapter === "world" ? 1 : 0],
        damp,
      );
    const tone = smooth.current.tone,
      mobile = state.size.width < 760;
    const x = mobile ? 0 : blend("x");
    const y = mobile
      ? p < 0.8
        ? -1.3
        : p < 2.7
          ? -1.45
          : p < 3.7
            ? -0.55
            : -1.3
      : blend("y");
    if (group.current) {
      group.current.position.set(x, y, 0);
      group.current.scale.setScalar(blend("scale") * (mobile ? 0.82 : 1));
      group.current.rotation.set(
        morph * 0.17,
        blend("angle") +
          smooth.current.x * 0.12 +
          labWeight * smooth.current.angle,
        -0.05,
      );
    }
    state.camera.position.set(
      smooth.current.x * 0.3,
      0.22 - smooth.current.y * 0.2,
      blend("z"),
    );
    state.camera.lookAt(0, 0, 0);
    for (const ref of [points, lines])
      if (ref.current) {
        ref.current.uniforms.uMorph.value = morph;
        ref.current.uniforms.uScatter.value = smooth.current.scatter;
        ref.current.uniforms.uTime.value = smooth.current.time;
        ref.current.uniforms.uTone.value = tone;
      }
    const opacity = Math.max(0, 1 - morph * 1.4);
    if (nMesh.current) nMesh.current.visible = opacity > 0.01;
    if (nMaterial.current) nMaterial.current.opacity = opacity;
    if (core.current) {
      core.current.visible = morph > 0.35;
      core.current.rotation.y = smooth.current.time * 0.08;
      core.current.rotation.z = 0.3;
    }
    if (coreMaterial.current)
      coreMaterial.current.opacity = Math.min(1, morph) * 0.9;
    if (dust.current) {
      dust.current.opacity = 0.08 + tone * 0.3;
      dust.current.color.setRGB(
        0.35 + tone * 0.45,
        0.46 + tone * 0.4,
        0.58 + tone * 0.35,
      );
    }
  });
  return (
    <>
      <color ref={background} attach="background" args={["#f3f6f8"]} />
      <StudioEnvironment />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={3.5} color="#e7f5ff" />
      <directionalLight position={[-4, 2, -2]} intensity={2} color="#e5c7ad" />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={dust}
          size={0.018}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </points>
      <group ref={group}>
        <mesh ref={nMesh} geometry={data.crystal}>
          <meshPhysicalMaterial
            ref={nMaterial}
            color="#e2eef5"
            metalness={0.08}
            roughness={0.055}
            transmission={0.93}
            thickness={0.8}
            ior={1.48}
            clearcoat={1}
            envMapIntensity={1.3}
            transparent
            opacity={0.88}
          />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshPhysicalMaterial
            ref={coreMaterial}
            color="#bed6e8"
            metalness={0.15}
            roughness={0.07}
            transmission={0.88}
            thickness={1.4}
            ior={1.5}
            clearcoat={1}
            envMapIntensity={1.5}
            transparent
          />
        </mesh>
        <lineSegments geometry={data.line}>
          <shaderMaterial
            ref={lines}
            depthTest={false}
            uniforms={lineUniforms}
            transparent
            depthWrite={false}
            vertexShader={`${vertexDeform}void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(form(),1.);}`}
            fragmentShader="uniform float uTone;void main(){gl_FragColor=vec4(mix(vec3(.2,.3,.4),vec3(.57,.76,.93),uTone),mix(.11,.2,uTone));}"
          />
        </lineSegments>
        <points geometry={data.geometry}>
          <shaderMaterial
            ref={points}
            depthTest={false}
            uniforms={pointUniforms}
            transparent
            depthWrite={false}
            vertexShader={`${vertexDeform}void main(){vec4 mv=modelViewMatrix*vec4(form(),1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(19./-mv.z,1.8,4.);}`}
            fragmentShader="uniform float uTone;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(mix(vec3(.13,.24,.34),vec3(.72,.86,1.),uTone),smoothstep(.5,.22,d));}"
          />
        </points>
      </group>
    </>
  );
}
export default function JourneyScene(props: {
  input: RefObject<WorldInput>;
  enabled: boolean;
  mode: number;
  rotation: number;
  chapter: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0.22, 8.7], fov: 40 }}
      frameloop={props.enabled ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={
        <div className="scene-fallback">
          <span>N</span>
        </div>
      }
    >
      <ConnectedSculpture {...props} />
    </Canvas>
  );
}
