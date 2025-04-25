import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CubeLines = () => {
    const linesRef = useRef();

    useEffect(() => {
        if (linesRef.current) {
            const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            const edges = new THREE.EdgesGeometry(geometry);
            linesRef.current.geometry = edges;
        }
    }, []);

    return (
        <lineSegments ref={linesRef}>
            <lineBasicMaterial
                attach="material"
                color="black"
                linewidth={2}
            />
        </lineSegments>
    );
};

export default CubeLines; 