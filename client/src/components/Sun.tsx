import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current && glowRef.current) {
      // Subtle rotation animation
      sunRef.current.rotation.z += 0.001;
      glowRef.current.rotation.z -= 0.0005;
    }
  });

  return (
    <>
      {/* Bright sky environment */}
      <color attach="background" args={["#87CEEB"]} />
      <fog attach="fog" args={["#87CEEB", 800, 2000]} />
      
      <group position={[800, 800, 800]}>
        {/* Main sun body - much larger and brighter */}
        <mesh ref={sunRef} castShadow={false}>
          <sphereGeometry args={[80, 32, 32]} />
          <meshBasicMaterial 
            color="#FFFF00"
          />
        </mesh>
        
        {/* Sun glow effect */}
        <mesh ref={glowRef} castShadow={false}>
          <sphereGeometry args={[120, 16, 16]} />
          <meshBasicMaterial 
            color="#FFA500"
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </>
  );
}