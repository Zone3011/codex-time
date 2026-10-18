"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
export type ParticleInput = { progress: number; x: number; y: number };
const deformation = `
 vec3 deform(vec3 p,float amount){
  vec3 spread=normalize(p+vec3(.01))*3.6;
  spread.z+=sin(p.y*3.4+p.x*2.)*.8;
  return mix(p,spread,amount);
 }
`;
function createMonogram() {
  const positions: number[] = [];
  const lines: number[] = [];
  const colors: number[] = [];
  const ribs = 38,
    sides = 10;
  for (let bar = 0; bar < 3; bar++) {
    const start =
      bar === 0
        ? new THREE.Vector3(-1.3, -1.4, 0)
        : bar === 1
          ? new THREE.Vector3(-1.3, 1.4, 0)
          : new THREE.Vector3(1.3, -1.4, 0);
    const end =
      bar === 0
        ? new THREE.Vector3(-1.3, 1.4, 0)
        : bar === 1
          ? new THREE.Vector3(1.3, -1.4, 0)
          : new THREE.Vector3(1.3, 1.4, 0);
    const direction = end.clone().sub(start).normalize();
    const side = new THREE.Vector3(-direction.y, direction.x, 0);
    const points: THREE.Vector3[] = [];
    for (let row = 0; row < ribs; row++) {
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2 + row * 0.045;
        const t = row / (ribs - 1);
        const radius = 0.26 + 0.025 * Math.sin(t * Math.PI * 3);
        const p = start
          .clone()
          .lerp(end, t)
          .addScaledVector(side, Math.cos(angle) * radius);
        p.z = Math.sin(angle) * radius;
        points.push(p);
        positions.push(p.x, p.y, p.z);
        const color = new THREE.Color().setHSL(
          0.57 + t * 0.12,
          0.35,
          0.18 + Math.sin(angle) * 0.06,
        );
        colors.push(color.r, color.g, color.b);
      }
    }
    const connect = (a: number, b: number) => {
      lines.push(...points[a].toArray(), ...points[b].toArray());
    };
    for (let row = 0; row < ribs; row++)
      for (let j = 0; j < sides; j++) {
        const index = row * sides + j;
        connect(index, row * sides + ((j + 1) % sides));
        if (row < ribs - 1) {
          connect(index, index + sides);
          if ((row + j) % 3 === 0)
            connect(index, (row + 1) * sides + ((j + 1) % sides));
        }
      }
  }
  return {
    positions: new Float32Array(positions),
    lines: new Float32Array(lines),
    colors: new Float32Array(colors),
  };
}
function Network({
  input,
  enabled,
}: {
  input: RefObject<ParticleInput>;
  enabled: boolean;
}) {
  const data = useMemo(() => createMonogram(), []);
  const group = useRef<THREE.Group>(null);
  const pointsMaterial = useRef<THREE.ShaderMaterial>(null);
  const lineMaterial = useRef<THREE.ShaderMaterial>(null);
  const smoothed = useRef({ progress: 0, x: 0, y: 0 });
  const uniforms = useMemo(() => ({ uProgress: { value: 0 } }), []);
  const lineUniforms = useMemo(() => ({ uProgress: { value: 0 } }), []);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [enabled, invalidate]);
  useFrame((state, delta) => {
    const target = enabled ? input.current : { progress: 0, x: 0, y: 0 };
    const amount = 1 - Math.exp(-Math.min(delta, 0.05) * 4.5);
    smoothed.current.progress = THREE.MathUtils.lerp(
      smoothed.current.progress,
      target.progress,
      amount,
    );
    smoothed.current.x = THREE.MathUtils.lerp(
      smoothed.current.x,
      target.x,
      amount,
    );
    smoothed.current.y = THREE.MathUtils.lerp(
      smoothed.current.y,
      target.y,
      amount,
    );
    const { progress, x, y } = smoothed.current;
    if (pointsMaterial.current)
      pointsMaterial.current.uniforms.uProgress.value = progress * 0.72;
    if (lineMaterial.current)
      lineMaterial.current.uniforms.uProgress.value = progress * 0.72;
    state.camera.position.set(
      progress * 2 + x * 0.4,
      0.25 + progress * 0.8 - y * 0.25,
      7.3 - progress * 1.4,
    );
    state.camera.lookAt(0, 0, 0);
    if (group.current) {
      group.current.rotation.y = -0.2 + progress * 0.55;
      group.current.rotation.z = -0.08;
    }
  });
  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.lines, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMaterial}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          vertexShader={`uniform float uProgress;${deformation} void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(deform(position,uProgress),1.);}`}
          fragmentShader="void main(){gl_FragColor=vec4(.18,.24,.34,.18);}"
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMaterial}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          vertexColors
          vertexShader={`uniform float uProgress;varying vec3 vColor;${deformation}void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(deform(position,uProgress),1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(24./-mv.z,2.,5.);}`}
          fragmentShader="varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vColor,smoothstep(.5,.25,d));}"
        />
      </points>
    </group>
  );
}
export default function ParticleScene({
  input,
  enabled,
}: {
  input: RefObject<ParticleInput>;
  enabled: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.25, 7.3], fov: 40 }}
      frameloop={enabled ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<div className="particle-fallback">N</div>}
    >
      <Network input={input} enabled={enabled} />
    </Canvas>
  );
}
