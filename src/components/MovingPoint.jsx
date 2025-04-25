import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MovingPoint component - Represents the moving point along the fuse line
 * Handles the animation of a point moving along a path of points
 * The point moves at a random speed between min and max time
 */
const MovingPoint = ({ fuseActive, points, onFuseComplete }) => {
    const pointRef = useRef();
    const [t, setT] = useState(0);
    const [currentPoints, setCurrentPoints] = useState([]);
    const [movementTime, setMovementTime] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);
    const tRef = useRef(0); // Use ref for smoother updates
    const lastPointsRef = useRef([]); // Store the last valid points

    // Generate a random movement time between 10 and 15 seconds
    useEffect(() => {
        const randomTime = 10 + Math.random() * 5; // Random time between 10 and 15 seconds
        setMovementTime(randomTime);
    }, []);

    // Reset completion state when fuseActive changes
    useEffect(() => {
        if (fuseActive) {
            setHasCompleted(false);
            setT(0);
            tRef.current = 0;
        }
    }, [fuseActive]);

    // Update current points when points prop changes
    useEffect(() => {
        if (points && points.length > 0) {
            setCurrentPoints(points);
            lastPointsRef.current = [...points]; // Store a copy of the points
        }
    }, [points]);

    useFrame(({ clock }) => {
        if (pointRef.current && fuseActive && currentPoints.length > 1 && !hasCompleted) {
            // Calculate speed based on the random movement time
            // Speed = 1/total_time to ensure the point completes the path in the specified time
            const speed = 1 / movementTime;

            // Update progress (t) based on time elapsed
            // 0.016 is approximately 1/60 for 60fps
            const newT = tRef.current + speed * 0.016;

            // Check if the animation has completed
            if (newT >= 1) {
                setHasCompleted(true);
                if (onFuseComplete) {
                    onFuseComplete();
                }
                return;
            }

            // Update the ref for smoother animation
            tRef.current = newT;
            setT(newT);

            // Use the stored points to ensure consistency
            const pointsToUse = lastPointsRef.current.length > 0 ? lastPointsRef.current : currentPoints;
            const segmentCount = pointsToUse.length - 1;

            // Calculate which segment we're on and how far along that segment
            // totalLength = progress * number_of_segments
            const totalLength = newT * segmentCount;
            // segmentIndex = floor(totalLength) to get the current segment
            const segmentIndex = Math.floor(totalLength);
            // segmentT = fractional part of totalLength (0 to 1)
            const segmentT = totalLength - segmentIndex;

            // Ensure we have valid points
            if (segmentIndex >= 0 && segmentIndex < pointsToUse.length - 1) {
                const startPoint = pointsToUse[segmentIndex];
                const endPoint = pointsToUse[segmentIndex + 1];

                // Interpolate between start and end points based on segmentT
                const position = new THREE.Vector3()
                    .copy(startPoint)
                    .lerp(endPoint, segmentT);

                // Update the point position
                pointRef.current.position.copy(position);
            }
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