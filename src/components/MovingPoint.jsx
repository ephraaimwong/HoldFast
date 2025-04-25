import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingPoint = ({ fuseActive, points }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0);
    const [currentPoints, setCurrentPoints] = useState([]);

    // Update current points when points prop changes
    useEffect(() => {
        if (points && points.length > 0) {
            setCurrentPoints(points);
        }
    }, [points]);

    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive && currentPoints.length > 1) {
            const time = clock.getElapsedTime();
            setT((prev) => (prev + 0.005) % 1);
            const segmentCount = currentPoints.length - 1;
            const segmentIndex = Math.floor(t * segmentCount);
            const segmentT = (t * segmentCount) % 1;

            const startPoint = currentPoints[segmentIndex];
            const endPoint = currentPoints[Math.min(segmentIndex + 1, currentPoints.length - 1)];
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