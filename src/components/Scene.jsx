import React, { useRef, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Cube from './Cube';

const Scene = ({ controlsRef, showGridHelper, showAxesHelper }) => {
    const rotationSpeed = 0.01;

    // Use fixed positions for the cubes to ensure they don't overlap
    const cubePositions = useMemo(() => {
        const roomSize = 80;
        const halfRoom = roomSize / 2;
        const spacing = 25; // Increased spacing between cubes

        // Define fixed positions for each cube with more separation
        return [
            // Left cube - positioned further left
            new THREE.Vector3(-halfRoom + spacing, 0, -spacing),

            // Right cube - positioned further right
            new THREE.Vector3(halfRoom - spacing, 0, spacing),

            // Center cube - positioned in the center, higher up
            new THREE.Vector3(0, 15, 0)
        ];
    }, []);

    return (
        <>
            <OrbitControls ref={controlsRef} />
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
                />
            ))}
        </>
    );
};

export default Scene; 