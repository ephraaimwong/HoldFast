

import { useRef, useMemo } from 'react';
import { MeshReflectorMaterial, OrbitControls, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function MirrorRoom() {
  const leftWallRef = useRef();
  const rightWallRef = useRef();
  const ceilingDiscRef = useRef();


  const roomSize = 200;
  const halfRoom = roomSize / 2;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 150; i++) {
      const x = THREE.MathUtils.randFloatSpread(roomSize);
      const y = THREE.MathUtils.randFloatSpread(halfRoom);
      const z = THREE.MathUtils.randFloatSpread(roomSize);
      temp.push([x, y, z]);
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const leftColor = `hsl(${(t * 40) % 360}, 100%, 60%)`;
    const rightColor = `hsl(${(t * 40 + 180) % 360}, 100%, 60%)`;

    if (leftWallRef.current) leftWallRef.current.material.color.setStyle(leftColor);
    if (rightWallRef.current) rightWallRef.current.material.color.setStyle(rightColor);
    if (ceilingDiscRef.current) ceilingDiscRef.current.rotation.y = t * 0.5;

  });

  return (
    <>
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.2} />
      </EffectComposer>

      <OrbitControls
        target={[0, 0, 0]}
        minDistance={2}
        maxDistance={300}
        enableRotate
        enablePan
      />

      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#111111', 50, 400]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 40, 0]} intensity={3} color="#ff66ff" />
      <pointLight position={[80, 0, 80]} intensity={1.5} color="#66ffff" />
      <pointLight position={[-80, 0, -80]} intensity={1.5} color="#ffcc66" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -halfRoom / 2, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <MeshReflectorMaterial blur={[600, 200]} resolution={2048} mixBlur={1} mixStrength={1.5}
          roughness={0.2} depthScale={2} minDepthThreshold={0.3} maxDepthThreshold={1.5} color="#111" metalness={1} />
      </mesh>

      <mesh position={[0, 0, -halfRoom]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={2}
          roughness={0.4} depthScale={1} color="#888" metalness={0.9} />
      </mesh>

      <mesh ref={leftWallRef} position={[-halfRoom, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial />
      </mesh>

      <mesh ref={rightWallRef} position={[halfRoom, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial />
      </mesh>

      <mesh position={[0, halfRoom / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh ref={ceilingDiscRef} position={[0, halfRoom / 2 - 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="white" emissive="#ff00ff" emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[0, 0, halfRoom]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color="#666" transparent opacity={0.2} />
      </mesh>


      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>
      ))}

      <Stars radius={200} depth={60} count={5000} factor={7} saturation={0} fade />
    </>
  );
}
