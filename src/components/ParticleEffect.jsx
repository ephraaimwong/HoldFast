import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const ParticleEffect = ({ position, color = '#ffff00', duration = 1000 }) => {
    const pointsRef = useRef();
    const [isActive, setIsActive] = useState(true);
    const startTime = useRef(Date.now());
    const particleCount = 50;
    const velocities = useRef([]);
    const initialPositions = useRef([]);
    const baseSize = 0.15; // Increased from 0.08

    useEffect(() => {
        if (pointsRef.current) {
            // Create particles in a sphere
            const positions = new Float32Array(particleCount * 3); // 3 dimensions for x, y, z
            velocities.current = new Array(particleCount);
            initialPositions.current = new Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                // Random sphere position using spherical coordinates
                // Finally using something that I learned in calculus 3...
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = 0.1; // Initial radius

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                // Store the position where the first cordinate is x, second is y, third is 
                // This array is used to store the positions of the particles for animation later
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                // Store initial position
                initialPositions.current[i] = new THREE.Vector3(x, y, z);

                // Random velocity
                velocities.current[i] = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                );
            }

            pointsRef.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
        }
    }, []);

    useFrame(({ clock }) => {
        if (!isActive || !pointsRef.current) return;

        const elapsed = Date.now() - startTime.current;
        if (elapsed > duration) {
            setIsActive(false);
            return;
        }

        const positions = pointsRef.current.geometry.attributes.position.array;
        const progress = elapsed / duration;
        const time = clock.getElapsedTime();

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const velocity = velocities.current[i];
            const initialPos = initialPositions.current[i];

            // Update position based on velocity and initial position
            positions[i3] = initialPos.x + velocity.x * elapsed;
            positions[i3 + 1] = initialPos.y + velocity.y * elapsed;
            positions[i3 + 2] = initialPos.z + velocity.z * elapsed;

            // Fade out
            pointsRef.current.material.opacity = 1 - progress;

            // Pulse size
            const pulse = Math.sin(time * 10 + i) * 0.2 + 0.8;
            pointsRef.current.material.size = baseSize * pulse;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    if (!isActive) return null;

    return (
        <points ref={pointsRef} position={position}>
            <bufferGeometry />
            <pointsMaterial
                size={baseSize}
                color={color}
                transparent
                opacity={1}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default ParticleEffect; 