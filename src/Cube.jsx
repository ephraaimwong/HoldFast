import React, { useRef, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
// import { Sphere, OrbitControls } from '@react-three/drei';
// import gsap from 'gsap';

const Cube = ({onCubeClick}) => {
    const cubeRef = useRef();
    const [hovered, setHovered] = useState(false);

    useEffect(()=> {
        if(hovered){
            const interval = setInterval(() => {
                if(cubeRef.current){
                    cubeRef.current.rotation.x += 0.05;
                    cubeRef.current.rotation.y += 0.05;
                }
            },16); //update at 60 fps
            return () => clearInterval(interval);
        }
    }, [hovered]);


  return (
    //mesh for 3d objects
    <mesh
      ref={cubeRef}
      position={[0,0,0]} //center cube in canvas
      onPointerOver={() => setHovered(true)} //when mouse hovers over cube
      onPointerOut={() => setHovered(false)} //when mouse leaves cube
      onClick={onCubeClick} //trigger effect when cube is clicked
    >
    
    <boxGeometry args={[1,1,1]}/>
    <meshStandardMaterial color={hovered ? 'hotpink' : 'green'}/>
    </mesh>
  )
}

    const Scene = () => {
        const handleCubeClick = () => {
            console.log('Cube clicked!');
            //apply animation
        };
        return (
            <Canvas style={{height: '70vh', width: '100%', display:'block'}} camera={{position: [0,0,5]}}>
                <ambientLight intensity={.5}/>
                <directionalLight position={[10,15,5]} intensity={5}/>{/*position[x,y,z] */}
                <Cube onCubeClick={handleCubeClick}/>


            </Canvas>
        );
    };
    

export default Scene;
