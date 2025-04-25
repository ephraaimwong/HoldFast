import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingPoint = ({ fuseActive }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0);
    const trail = useRef([]);

    const points = [
        new THREE.Vector3(-1.25, -1.25, 1.25),  // Front bottom left
        new THREE.Vector3(1.25, 1.25, 1.25),    // Front top right
        new THREE.Vector3(1.25, 1.25, -1.25),   // Back top right
        new THREE.Vector3(0, 0, -1.25)          // Back center
    ];

    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive) {
            const time = clock.getElapsedTime();
            setT((prev) => (prev + 0.005) % 1);
            const segmentCount = points.length - 1;
            const segmentIndex = Math.floor(t * segmentCount);
            const segmentT = (t * segmentCount) % 1;

            const startPoint = points[segmentIndex];
            const endPoint = points[Math.min(segmentIndex + 1, points.length - 1)];
            const position = new THREE.Vector3()
                .copy(startPoint)
                .lerp(endPoint, segmentT);

            pointRef.current.position.copy(position);
        }
    });

    return (
        <mesh ref={pointRef}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshBasicMaterial color="yellow" />
        </mesh>
    );
};

export default MovingPoint; 