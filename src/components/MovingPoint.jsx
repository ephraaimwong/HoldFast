import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingPoint = ({ fuseActive, points }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0);
    const [currentPoints, setCurrentPoints] = useState([]);
    const [movementTime, setMovementTime] = useState(0);

    // Generate a random movement time between 5 and 9 seconds
    useEffect(() => {
        const randomTime = 5 + Math.random() * 4; // Random time between 5 and 9 seconds
        setMovementTime(randomTime);
    }, []);

    // Update current points when points prop changes
    useEffect(() => {
        if (points && points.length > 0) {
            setCurrentPoints(points);
        }
    }, [points]);

    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive && currentPoints.length > 1) {
            // Use the random movement time to control the speed
            const speed = 1 / movementTime;
            setT((prev) => (prev + speed * 0.016) % 1); // 0.016 is approximately 1/60 for 60fps

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