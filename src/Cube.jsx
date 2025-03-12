import React, { useRef, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
// import { Sphere, OrbitControls } from '@react-three/drei';
// import gsap from 'gsap';

const Cube = ({ spinToggle, setSpinToggle, rotationSpeed }) => {
    const cubeRef = useRef();
    const[isDragged, setIsDragged] = useState(false); 
    const[lastMousePos, setLastMousePos] = useState(null); 
    const keyRotationSpeed = 2; //speed of rotation when using keys


    //key-based rotation logic
    useEffect(() => {
        const activeKeys = new Set();

        const handleKeyDown = (event) => {
            // Prevent scrolling page on arrow keys
            if(["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())){
                event.preventDefault();
            }
            activeKeys.add(event.key.toLowerCase());

            //stop auto rotation when key-based movement is triggered
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
                setSpinToggle(false); 
            }
        };

        const handleKeyUp = (event) => {
            activeKeys.delete(event.key.toLowerCase());
        };

        const updateRotation = () => {
            if (!cubeRef.current) return;
            let deltaX = 0, deltaY = 0; // Store movement changes

            // Correct Directions for Right-Handed Coordinate System
            if (activeKeys.has('w')||activeKeys.has('arrowup')) deltaX -= keyRotationSpeed; // Tilt UP (Negative X)
            if (activeKeys.has('s')||activeKeys.has('arrowdown')) deltaX += keyRotationSpeed; // Tilt DOWN (Positive X)
            if (activeKeys.has('a')||activeKeys.has('arrowleft')) deltaY -= keyRotationSpeed; // Rotate LEFT (Negative Y)
            if (activeKeys.has('d')||activeKeys.has('arrowright')) deltaY += keyRotationSpeed; // Rotate RIGHT (Positive Y)

            // Allow multiple rotations at once (mutliple keys pressed or keys plus mouse)
            if (deltaX !== 0 || deltaY !== 0) {
                const eulerRotation = new THREE.Euler(
                    THREE.MathUtils.degToRad(deltaX),
                    THREE.MathUtils.degToRad(deltaY),
                    0,
                    'XYZ'
                );
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation);
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            }

            requestAnimationFrame(updateRotation); // Keep updating
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        requestAnimationFrame(updateRotation); // Keep updating

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Auto Rotation Function
    useEffect(()=> { 
        if(spinToggle && !isDragged){ 
            const interval = setInterval(() => { 
                if(cubeRef.current){ 
                    cubeRef.current.rotation.x += rotationSpeed; 
                    cubeRef.current.rotation.y += rotationSpeed; 
                } 
            },16); //update at every 16ms ~ 60 fps 
            return () => clearInterval(interval); 
        } 
    }, [spinToggle, isDragged, rotationSpeed]); 

    // Mouse Drag Logic
    useEffect(() => {
        if (isDragged) { //adding global event listeners so that mouse can continue rotating after leaving mesh
            window.addEventListener('mousemove', handlePointerMove);
            window.addEventListener('mouseup', handlePointerUp);
        } else {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        };
    }, [isDragged]);

    const handlePointerDown = (event) => { 
        setIsDragged(true); 
        setLastMousePos({x:event.clientX, y:event.clientY}); 
        setSpinToggle(false); //stop spinning when cube is dragged 

        //add global event listeners
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
    }; 

    const handlePointerMove = (event) => {  
        if (isDragged && lastMousePos) { 
            //viewport dimensions to normalize rotation speed
            const{innerWidth, innerHeight} = window;

            //event.movement(X/Y) gives continuous update of mouse position on every frame
            const deltaX = event.movementX*1.5 / innerWidth; 
            const deltaY = event.movementY*1.5 / innerHeight;
    
            if (cubeRef.current) { 
                // Create Euler rotation based on mouse movement
                const eulerRotation = new THREE.Euler(
                    deltaY * Math.PI,  // Invert Y-axis for natural movement
                    deltaX * Math.PI,  // Left/right movement
                    0,
                    'XYZ'
                );
    
                // Apply rotation as a quaternion
                const quaternion = new THREE.Quaternion();
                quaternion.setFromEuler(eulerRotation);
    
                // Apply the quaternion rotation to the cube
                cubeRef.current.quaternion.multiplyQuaternions(quaternion, cubeRef.current.quaternion);
            } 
            setLastMousePos({ x: event.clientX, y: event.clientY }); 
        } 
    };

    const handlePointerUp = () => { 
        setIsDragged(false); //release mouse drag logic 
        //remove global event listeners
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
    }; 

  return (
    //mesh for 3d objects
    <mesh
      ref={cubeRef}
      position={[0,0,0]} //center cube in canvas
      onPointerDown= {handlePointerDown} 
    >
    
    <boxGeometry args={[2.5,2.5,2.5]}/> {/* x,y,z dimension of cube*/}
    <meshStandardMaterial color={spinToggle ? 'hotpink' : 'green'}/>
    </mesh>
  )
}

    const Scene = () => {
        const defaultRotationSpeed = 0.05;
        const[spinToggle, setSpinToggle]=useState(false);
        const[rotationSpeed, setRotationSpeed]=useState(defaultRotationSpeed);
        
        // rotationSpeed = defaultRotationSpeed

        useEffect(()=> {
            const handleKeyPress = (event) => {
                if(event.key.toLowerCase() === 'r'){
                    setSpinToggle((prev) => !prev);
                } else if(event.key === '1'){
                    setRotationSpeed((prev)=>prev + 0.02); //speed up
                }else if(event.key === '2'){
                    setRotationSpeed((prev)=>prev - 0.02); //slow down
                } 
            };
            window.addEventListener('keydown', handleKeyPress);
            return () => window.removeEventListener('keydown', handleKeyPress);
        },[]);

        return (
            <Canvas style={{height: '70vh', width: '100%', display:'block'}} camera={{position: [0,0,5]}}>
                <ambientLight intensity={.5}/>
                <directionalLight position={[10,15,5]} intensity={5}/>{/*position[x,y,z] */}
                <Cube spinToggle={spinToggle} rotationSpeed={rotationSpeed} setSpinToggle={setSpinToggle}/>


            </Canvas>
        );
    };
    

export default Scene;
