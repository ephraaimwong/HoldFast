import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // Removed useFrame since it's not used

const Cube = ({ spinToggle }) => {
    const cubeRef = useRef();

    // Use useEffect to handle rotation without useFrame
    useEffect(() => {
        if (spinToggle) {
            const interval = setInterval(() => {
                if (cubeRef.current) {
                    cubeRef.current.rotation.x += 0.05;
                    cubeRef.current.rotation.y += 0.05;
                }
            }, 16); // ~60 fps
            return () => clearInterval(interval);
        }
    }, [spinToggle]);

    return (
        <group ref={cubeRef} position={[0, 0, 0]}>
            {/* Cube Mesh */}
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={spinToggle ? 'hotpink' : 'green'} />
            </mesh>

            {/* Vertical line on the front face (z = 0.5) */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array([
                            0, -0.5, 0.5, // Bottom-center of front face
                            0, 0.5, 0.5   // Top-center of front face
                        ])}
                        itemSize={3}
                        count={2}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="black" linewidth={2} />
            </line>

        </group>
    );
};

const Scene = () => {
    const [spinToggle, setSpinToggle] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key.toLowerCase() === 'r') {
                setSpinToggle((prev) => !prev); // Changed to 'prev' for clarity
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <Canvas style={{ height: '70vh', width: '100%', display: 'block' }} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 15, 5]} intensity={5} />
            <Cube spinToggle={spinToggle} />
        </Canvas>
    );
};

export default Scene;