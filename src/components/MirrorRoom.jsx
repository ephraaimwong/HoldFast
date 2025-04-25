import { useRef, useMemo, useEffect } from 'react';
import { MeshReflectorMaterial, OrbitControls, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function MirrorRoom({ setControlsRef }) {
    const leftWallRef = useRef();
    const rightWallRef = useRef();
    const ceilingDiscRef = useRef();

    const controlsRef = useRef();
    useEffect(() => {
        if (setControlsRef && controlsRef.current) {
            setControlsRef(controlsRef.current);
        }
    }, [setControlsRef]);

    const roomSize = 80;
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
            <color attach="background" args={['#000']} />
            <fog attach="fog" args={['#111111', 50, 400]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[0, 40, 0]} intensity={2} color="#ff66ff" />
            <pointLight position={[80, 0, 80]} intensity={1} color="#66ffff" />
            <pointLight position={[-80, 0, -80]} intensity={1} color="#ffcc66" />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -halfRoom / 2, 0]} receiveShadow castShadow>
                <planeGeometry args={[roomSize, roomSize]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={1.5}
                    roughness={0.2}
                    depthScale={1}
                    minDepthThreshold={0.3}
                    maxDepthThreshold={1.5}
                    color="#111"
                    metalness={1}
                />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 0, -halfRoom]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={2}
                    roughness={0.4}
                    depthScale={1}
                    color="#888"
                    metalness={0.9}
                />
            </mesh>

            {/* Left Wall */}
            <mesh ref={leftWallRef} position={[-halfRoom, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color="#ff66ff" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Right Wall */}
            <mesh ref={rightWallRef} position={[halfRoom, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color="#66ffff" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, halfRoom / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Ceiling Light */}
            <mesh ref={ceilingDiscRef} position={[0, halfRoom / 2 - 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[roomSize / 8, 32]} />
                <meshStandardMaterial
                    color="white"
                    emissive="#ff00ff"
                    emissiveIntensity={1.5}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>

            {/* Front Wall (semi-transparent) */}
            <mesh position={[0, 0, halfRoom]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial
                    color="#666"
                    transparent
                    opacity={0.2}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            {/* Particles */}
            {particles.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial
                        emissive="#ffffff"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.5}
                        metalness={0.5}
                        roughness={0.2}
                    />
                </mesh>
            ))}

            <Stars radius={200} depth={60} count={1000} factor={7} saturation={0} fade />
        </>
    );
} 