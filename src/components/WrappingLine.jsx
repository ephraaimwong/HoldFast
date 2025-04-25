import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WrappingLine = () => {
    const lineRef = useRef();

    useEffect(() => {
        if (lineRef.current) {
            const points = [
                new THREE.Vector3(-1.25, -1.25, 1.25),  // Front bottom left
                new THREE.Vector3(1.25, 1.25, 1.25),    // Front top right
                new THREE.Vector3(1.25, 1.25, -1.25),   // Back top right
                new THREE.Vector3(0, 0, -1.25)          // Back center
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lineRef.current.geometry = geometry;
        }
    }, []);

    return (
        <line ref={lineRef}>
            <lineBasicMaterial
                attach="material"
                color="red"
                linewidth={3}
            />
        </line>
    );
};

export default WrappingLine; 