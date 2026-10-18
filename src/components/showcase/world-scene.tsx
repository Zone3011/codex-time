"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
const vertexShader = `
   uniform float uTime; varying vec3 vNormal; varying vec3 vPosition;
   void main(){
    vNormal=normalize(normalMatrix*normal);
    float wave=sin(position.x*2.7+uTime*.55)*cos(position.y*2.8-uTime*.35)*sin(position.z*2.5+uTime*.3);
    vec3 p=position+normal*(wave*.3);
    vPosition=(modelViewMatrix*vec4(p,1.)).xyz;
    gl_Position=projectionMatrix*vec4(vPosition,1.);
   }`;
const fragmentShader = `
   uniform float uTime; uniform float uFinish; varying vec3 vNormal; varying vec3 vPosition;
   void main(){
    vec3 n=normalize(vNormal);
    vec3 view=normalize(-vPosition);
    float rim=pow(1.-abs(dot(n,view)),2.);
    float light=dot(n,normalize(vec3(-.8,1.,1.)))*.5+.5;
    vec3 a=uFinish<.5?vec3(.32,.22,.72):vec3(.06,.38,.35);
    vec3 b=uFinish<.5?vec3(.97,.64,.53):vec3(.74,.94,.72);
    vec3 c=mix(a,b,smoothstep(.1,.95,light));
    c=mix(c,vec3(.73,.82,1.),rim*.85);
    c+=pow(max(dot(reflect(-normalize(vec3(-1.,2.,3.)),n),view),0.),40.)*.7;
    gl_FragColor=vec4(c,1.);
   }`;
function Sculpture({
  enabled,
  rotation,
  finish,
}: {
  enabled: boolean;
  rotation: number;
  finish: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFinish: { value: 0 } }),
    [],
  );
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [rotation, finish, enabled, invalidate]);
  useFrame((_, delta) => {
    if (material.current) {
      if (enabled)
        material.current.uniforms.uTime.value += Math.min(delta, 0.05);
      material.current.uniforms.uFinish.value = finish;
    }
    if (mesh.current) {
      mesh.current.rotation.y = (rotation * Math.PI) / 180;
      mesh.current.rotation.z = 0.25;
    }
  });
  return (
    <mesh ref={mesh} rotation={[0, (rotation * Math.PI) / 180, 0.25]}>
      <torusKnotGeometry args={[1.28, 0.48, 180, 32, 2, 3]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
export default function WorldScene({
  enabled,
  rotation,
  finish,
}: {
  enabled: boolean;
  rotation: number;
  finish: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      frameloop={enabled ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={
        <div className="world-fallback">
          <div className="fallback-orb" />
          <p>3D isn’t available here. Keep exploring.</p>
        </div>
      }
    >
      <Sculpture enabled={enabled} rotation={rotation} finish={finish} />
    </Canvas>
  );
}
