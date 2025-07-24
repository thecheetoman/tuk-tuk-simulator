import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useVehicleGame } from "../lib/stores/useVehicleGame";
import { Controls } from "../App";

export default function Car() {
  const meshRef = useRef<THREE.Group>(null);
  const { currentVehicle, carPosition, setCarPosition } = useVehicleGame();
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  
  // Load texture for the car
  const asphaltTexture = useTexture("/textures/asphalt.png");

  useFrame((state, delta) => {
    if (!meshRef.current || currentVehicle !== 'car') return;
    
    const keys = getKeys();
    const maxSpeed = 20;
    const acceleration = 1.1;
    const turnSpeed = 5;
    const friction = 2;
    const brakeForce = 2;
    
    // Log controls for debugging
    if (keys.forward || keys.backward || keys.left || keys.right || keys.brake) {
      console.log('Car controls:', { 
        forward: keys.forward, 
        backward: keys.backward, 
        left: keys.left, 
        right: keys.right,
        brake: keys.brake 
      });
    }
    
    // Calculate current speed for turning adjustment
    const currentSpeed = velocity.current.length();
    const speedFactor = Math.min(currentSpeed / 10, 1);
    
    // Handle turning - only turn when moving
    if (currentSpeed > 0.5) {
      if (keys.left) rotation.current += turnSpeed * delta * speedFactor;
      if (keys.right) rotation.current -= turnSpeed * delta * speedFactor;
    }
    
    // Handle forward/backward movement
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
    
    if (keys.forward) {
      const accelerationForce = direction.clone().multiplyScalar(acceleration * delta);
      velocity.current.add(accelerationForce);
      
      // Limit max speed
      if (velocity.current.length() > maxSpeed) {
        velocity.current.normalize().multiplyScalar(maxSpeed);
      }
    }
    
    if (keys.backward) {
      const reverseForce = direction.clone().multiplyScalar(-acceleration * 0.6 * delta);
      velocity.current.add(reverseForce);
      
      // Limit reverse speed
      if (velocity.current.length() > maxSpeed * 0.5) {
        velocity.current.normalize().multiplyScalar(maxSpeed * 0.5);
      }
    }
    
    // Apply handbrake
    if (keys.brake) {
      velocity.current.multiplyScalar(brakeForce);
    }
    
    // Apply friction
    velocity.current.multiplyScalar(friction);
    
    // Stop if moving very slowly
    if (velocity.current.length() < 0.1) {
      velocity.current.set(0, 0, 0);
    }
    
    // Update position
    const newPosition = carPosition.clone().add(velocity.current);
    
    // Keep car on ground and within bounds
    newPosition.y = 1; // Car height above ground
    newPosition.x = Math.max(-100, Math.min(100, newPosition.x));
    newPosition.z = Math.max(-100, Math.min(100, newPosition.z));
    
    setCarPosition(newPosition);
    
    // Update mesh transform
    meshRef.current.position.copy(newPosition);
    meshRef.current.rotation.y = rotation.current;
  });

  return (
    <group ref={meshRef} position={carPosition.toArray()} visible={currentVehicle === 'car'}>
      {/* Car body */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 6]} />
        <meshLambertMaterial color="#ff4444" />
      </mesh>
      
      {/* Car roof */}
      <mesh castShadow position={[0, 1.5, -0.5]}>
        <boxGeometry args={[2.5, 1, 3]} />
        <meshLambertMaterial color="#cc3333" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-1.2, 0, 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, 0, 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
      <mesh position={[-1.2, 0, -2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, 0, -2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-0.8, 0.5, 3.1]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshLambertMaterial color="#ffffaa" />
      </mesh>
      <mesh position={[0.8, 0.5, 3.1]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshLambertMaterial color="#ffffaa" />
      </mesh>
    </group>
  );
}
