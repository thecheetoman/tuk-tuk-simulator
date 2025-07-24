import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useVehicleGame } from "../lib/stores/useVehicleGame";
import { Controls } from "../App";

export default function Plane() {
  const meshRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);
  const { currentVehicle, planePosition, setPlanePosition } = useVehicleGame();
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef({ x: 0, y: 0, z: 0 });
  const altitude = useRef(20);

  useFrame((state, delta) => {
    if (!meshRef.current || currentVehicle !== 'plane') return;
    
    const keys = getKeys();
    const maxSpeed = 30;
    const acceleration = 40;
    const turnSpeed = 2;
    const climbRate = 15;
    const drag = 0.98;
    
    // Log controls for debugging
    if (keys.thrust || keys.forward || keys.backward || keys.left || keys.right) {
      console.log('Plane controls:', { 
        thrust: keys.thrust,
        forward: keys.forward, 
        backward: keys.backward, 
        left: keys.left, 
        right: keys.right 
      });
    }
    
    // Handle yaw (turning left/right)
    if (keys.left) rotation.current.y += turnSpeed * delta;
    if (keys.right) rotation.current.y -= turnSpeed * delta;
    
    // Handle pitch and altitude
    if (keys.forward) {
      altitude.current += climbRate * delta;
      rotation.current.x = Math.max(-0.4, rotation.current.x - 1.0 * delta);
    }
    if (keys.backward) {
      altitude.current -= climbRate * delta;
      rotation.current.x = Math.min(0.4, rotation.current.x + 1.0 * delta);
    }
    
    // Limit altitude
    altitude.current = Math.max(3, Math.min(120, altitude.current));
    
    // Auto-level the plane gradually
    rotation.current.x *= 0.96;
    rotation.current.z *= 0.96;
    
    // Forward thrust with space key
    if (keys.thrust) {
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.y);
      
      const thrustForce = direction.clone().multiplyScalar(acceleration * delta);
      velocity.current.add(thrustForce);
      
      // Limit max speed
      if (velocity.current.length() > maxSpeed) {
        velocity.current.normalize().multiplyScalar(maxSpeed);
      }
    }
    
    // Apply drag
    velocity.current.multiplyScalar(drag);
    
    // Minimum forward speed to stay airborne
    const minSpeed = 8;
    if (velocity.current.length() < minSpeed && altitude.current > 5) {
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.y);
      velocity.current = direction.multiplyScalar(minSpeed);
    }
    
    // Update position
    const newPosition = planePosition.clone().add(velocity.current);
    newPosition.y = altitude.current;
    
    // Keep plane within bounds (larger area for flight)
    newPosition.x = Math.max(-300, Math.min(300, newPosition.x));
    newPosition.z = Math.max(-300, Math.min(300, newPosition.z));
    
    setPlanePosition(newPosition);
    
    // Update mesh transform with banking
    const bankAngle = (keys.left ? 0.3 : 0) + (keys.right ? -0.3 : 0);
    rotation.current.z = THREE.MathUtils.lerp(rotation.current.z, bankAngle, 0.1);
    
    meshRef.current.position.copy(newPosition);
    meshRef.current.rotation.set(rotation.current.x, rotation.current.y, rotation.current.z);
    
    // Animate propeller based on thrust
    if (propellerRef.current) {
      const propellerSpeed = keys.thrust ? 25 : 15;
      propellerRef.current.rotation.z = state.clock.elapsedTime * propellerSpeed;
    }
  });

  return (
    <group ref={meshRef} position={planePosition.toArray()} visible={currentVehicle === 'plane'}>
      {/* Fuselage - sleeker design */}
      <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 1.0, 8, 12]} />
        <meshLambertMaterial color="#2c5aa0" />
      </mesh>
      
      {/* Nose cone */}
      <mesh castShadow position={[0, 0, -4.5]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      
      {/* Main wings - improved shape */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[14, 0.4, 2.5]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      
      {/* Wing tips */}
      <mesh position={[-7, -0.1, 0]} castShadow rotation={[0, 0, 0.2]}>
        <boxGeometry args={[1, 0.3, 0.8]} />
        <meshLambertMaterial color="#ffdd44" />
      </mesh>
      <mesh position={[7, -0.1, 0]} castShadow rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1, 0.3, 0.8]} />
        <meshLambertMaterial color="#ffdd44" />
      </mesh>
      
      {/* Horizontal stabilizer */}
      <mesh position={[0, -0.2, 3.8]} castShadow>
        <boxGeometry args={[5, 0.3, 1.2]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      
      {/* Vertical stabilizer - taller */}
      <mesh position={[0, 1.8, 3.8]} castShadow>
        <boxGeometry args={[0.3, 3.5, 1.5]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>
      
      {/* Cockpit canopy */}
      <mesh position={[0, 0.8, -1]} castShadow>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      
      {/* Engine cowling */}
      <mesh position={[0, 0, -3.5]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 12]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      
      {/* Propeller hub */}
      <mesh position={[0, 0, -4.7]} castShadow>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      {/* Propeller blades - 3 blades */}
      <group ref={propellerRef} position={[0, 0, -4.8]}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 4, 0.15]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 2 / 3]}>
          <boxGeometry args={[0.08, 4, 0.15]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 4 / 3]}>
          <boxGeometry args={[0.08, 4, 0.15]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
      </group>
      
      {/* Navigation lights */}
      <mesh position={[-7, -0.1, 0]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshLambertMaterial color="#ff0000" />
      </mesh>
      <mesh position={[7, -0.1, 0]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshLambertMaterial color="#00ff00" />
      </mesh>
      
      {/* Landing gear (when low altitude) */}
      {planePosition.y < 15 && (
        <>
          {/* Main gear */}
          <mesh position={[0, -1.3, -0.5]}>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
          <mesh position={[0, -2.2, -0.5]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
          
          {/* Wing gear */}
          <mesh position={[-2, -1.5, 1]}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
          <mesh position={[-2, -2.2, 1]}>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 8]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
          
          <mesh position={[2, -1.5, 1]}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
          <mesh position={[2, -2.2, 1]}>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 8]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
        </>
      )}
    </group>
  );
}
