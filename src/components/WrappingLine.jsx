import React, { useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const WrappingLine = forwardRef(({ onPointsGenerated, seed = Math.random() }, ref) => {
    const lineRef = useRef();
    const [points, setPoints] = useState([]);
    const cubeSize = 2.5;
    const halfSize = cubeSize / 2;

    // Create a seeded random number generator
    const seededRandom = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const generatePointOnFace = (face) => {
        // Use seeded random instead of MathUtils.randFloatSpread
        const random = () => (seededRandom() * 2 - 1) * halfSize;

        switch (face) {
            case 'Front':
                return new THREE.Vector3(random(), random(), halfSize);
            case 'Back':
                return new THREE.Vector3(random(), random(), -halfSize);
            case 'Right':
                return new THREE.Vector3(halfSize, random(), random());
            case 'Left':
                return new THREE.Vector3(-halfSize, random(), random());
            case 'Top':
                return new THREE.Vector3(random(), halfSize, random());
            case 'Bottom':
                return new THREE.Vector3(random(), -halfSize, random());
            default:
                return new THREE.Vector3(0, 0, 0);
        }
    };

    const generateRandomPoints = () => {
        const N = 12; // Total number of points
        const faces = ['Front', 'Right', 'Back', 'Left', 'Top', 'Bottom'];
        const pointsPerFace = Math.floor(N / 6);
        let extraPoints = N % 6;

        const allPoints = [];

        faces.forEach(face => {
            let numPoints = pointsPerFace;
            if (extraPoints > 0) {
                numPoints += 1;
                extraPoints -= 1;
            }

            for (let i = 0; i < numPoints; i++) {
                const point = generatePointOnFace(face);
                allPoints.push(point);
            }
        });

        setPoints(allPoints);

        // Notify parent component about the new points
        if (onPointsGenerated && allPoints.length > 0) {
            onPointsGenerated(allPoints);
        }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        generateRandomPoints,
        getPoints: () => points,
        getLastPoint: () => points.length > 0 ? points[points.length - 1] : null
    }));

    useMemo(() => {
        generateRandomPoints();
    }, []);

    // Update the line geometry every frame
    useFrame(() => {
        if (lineRef.current && points.length > 0) {
            const positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
            lineRef.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
            lineRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="white" />
        </line>
    );
});

export default WrappingLine; 