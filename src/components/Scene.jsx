import React, { useRef, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Cube from './Cube';

const Scene = ({ controlsRef, showGridHelper, showAxesHelper, onCubeClick, onFuseComplete, isGameRunning, autoRotateCamera }) => {
    const rotationSpeed = 0.01;

    // Use randomized positions for the cubes while ensuring no overlap
    const cubePositions = useMemo(() => {
        const roomSize = 80;
        const halfRoom = roomSize / 2;
        const minSpacing = 20; // Minimum spacing between cubes
        const maxSpacing = 35; // Maximum spacing between cubes

        // Helper function to get random value within range
        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        // Generate random positions while keeping cubes on different axes
        return [
            // Left cube - random X position, fixed Y and Z
            new THREE.Vector3(
                -halfRoom + randomInRange(minSpacing, maxSpacing),
                randomInRange(-10, 10),
                randomInRange(-10, 10)
            ),

            // Right cube - random X position, fixed Y and Z
            new THREE.Vector3(
                halfRoom - randomInRange(minSpacing, maxSpacing),
                randomInRange(-10, 10),
                randomInRange(-10, 10)
            ),

            // Center cube - random Y position, fixed X and Z
            new THREE.Vector3(
                randomInRange(-10, 10),
                randomInRange(10, 20),
                randomInRange(-10, 10)
            ),

            // Back cube - random Z position, fixed X and Y
            new THREE.Vector3(
                randomInRange(-10, 10),
                randomInRange(5, 15),
                -halfRoom + randomInRange(minSpacing, maxSpacing)
            ),

            // Front cube - random Z position, fixed X and Y
            new THREE.Vector3(
                randomInRange(-10, 10),
                randomInRange(5, 15),
                halfRoom - randomInRange(minSpacing, maxSpacing)
            ),

            // Top cube - random Y position, fixed X and Z
            new THREE.Vector3(
                randomInRange(-10, 10),
                halfRoom - randomInRange(minSpacing, maxSpacing),
                randomInRange(-10, 10)
            )
        ];
    }, []); // Empty dependency array means this only runs once on mount

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                autoRotate={autoRotateCamera && !isGameRunning}
                autoRotateSpeed={1.0}
                enableDamping={true}
                dampingFactor={0.05}
            />
            {showGridHelper && <gridHelper args={[20, 20]} />}
            {showAxesHelper && <axesHelper args={[5]} />}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            {cubePositions.map((position, index) => (
                <Cube
                    key={index}
                    position={position}
                    rotationSpeed={rotationSpeed}
                    controlsRef={controlsRef}
                    cubeIndex={index}
                    onCubeClick={() => onCubeClick(index)}
                    onFuseComplete={onFuseComplete}
                    isGameRunning={isGameRunning}
                />
            ))}
        </>
    );
};

export default Scene; 