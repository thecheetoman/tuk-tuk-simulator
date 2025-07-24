import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTukTukGame } from "../lib/stores/useTukTukGame";
import { useFuelSystem } from "../lib/stores/useFuelSystem";
import { Controls } from "../App";
import ExhaustSmoke from "./ExhaustSmoke";

interface TukTukProps {
  gameState: 'loading' | 'menu' | 'playing' | 'settings' | 'paused';
}

export default function TukTuk({ gameState }: TukTukProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { tukTukPosition, setTukTukPosition } = useTukTukGame();
  const { fuel, consumeFuel, canBoost } = useFuelSystem();
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(0);
  const isAccelerating = useRef(false);
  const isBoosting = useRef(false);

  // Load the 3D Indian auto rickshaw model with fallback
  let scene;
  try {
    ({ scene } = useGLTF("/models/indian_auto.glb"));
  } catch (error) {
    console.log("GLB model not found, using fallback");
    scene = null;
  }

  // Comprehensive collision detection with all objects
  const checkCollision = useMemo(() => {
    return (position: THREE.Vector3) => {
      // Complete buildings collision bounds - all buildings from SlumBuildings and IndianBuildings
      const buildings = [
        // Indian Buildings
        { x: -30, z: -40, width: 12, depth: 15 },
        { x: 40, z: -30, width: 8, depth: 10 },
        { x: -50, z: 20, width: 12, depth: 15 },
        { x: 30, z: 40, width: 8, depth: 10 },
        { x: -20, z: 60, width: 12, depth: 15 },
        { x: 60, z: -10, width: 8, depth: 10 },
        { x: -70, z: -20, width: 12, depth: 15 },
        { x: 10, z: 70, width: 8, depth: 10 },
        { x: 80, z: 15, width: 12, depth: 15 },
        { x: -40, z: -70, width: 8, depth: 10 },
        
        // Slum Buildings - adding all missing ones
        { x: -80, z: 50, width: 10, depth: 12 },
        { x: 70, z: -50, width: 9, depth: 11 },
        { x: -60, z: -60, width: 11, depth: 13 },
        { x: 90, z: 80, width: 8, depth: 9 },
        { x: -90, z: -80, width: 12, depth: 14 },
        { x: 120, z: 30, width: 7, depth: 8 },
        { x: -120, z: -30, width: 9, depth: 10 },
        { x: 50, z: 120, width: 10, depth: 11 },
        { x: -50, z: -120, width: 8, depth: 9 },
        { x: 150, z: -150, width: 6, depth: 7 },
        { x: -150, z: 150, width: 7, depth: 8 },
        { x: 200, z: 200, width: 5, depth: 6 },
        { x: -200, z: -200, width: 6, depth: 7 }
      ];

      for (const building of buildings) {
        // Smaller collision boxes - 80% of building size
        const collisionWidth = building.width * 0.8;
        const collisionDepth = building.depth * 0.8;
        if (position.x > building.x - collisionWidth/2 - 1.5 && 
            position.x < building.x + collisionWidth/2 + 1.5 &&
            position.z > building.z - collisionDepth/2 - 1.5 && 
            position.z < building.z + collisionDepth/2 + 1.5) {
          return true;
        }
      }

      // Ruins collision bounds
      const ruinPositions = [
        { x: -15, z: -15, size: 6 },
        { x: 25, z: 25, size: 5 },
        { x: -35, z: 35, size: 6 },
        { x: 45, z: -45, size: 5 }
      ];

      for (const ruin of ruinPositions) {
        const distance = Math.sqrt(
          Math.pow(position.x - ruin.x, 2) + 
          Math.pow(position.z - ruin.z, 2)
        );
        if (distance < ruin.size) {
          return true;
        }
      }

      // Tree collision bounds - fixed positions from Terrain.tsx
      const trees = [
        [-100, -200], [120, -180], [-80, 160], [90, 140], [-110, 120],
        [130, -160], [-90, -140], [110, 180], [-130, -120], [80, -190],
        [140, 170], [-140, -170], [170, 140], [-170, -140], [190, -80],
        [-190, 80], [80, 190], [-80, -190], [200, 100], [-200, -100],
        [100, 200], [-100, -200], [250, -50], [-250, 50], [50, 250],
        [-50, -250], [300, 0], [-300, 0], [0, 300], [0, -300],
        [220, 160], [-220, -160], [160, 220], [-160, -220], [260, -120],
        [-260, 120], [120, 260], [-120, -260], [180, -240], [-180, 240],
        [240, 180], [-240, -180], [270, -80], [-270, 80], [80, 270],
        [-80, -270], [150, -280], [-150, 280], [280, 150], [-280, -150]
      ];

      for (const [x, z] of trees) {
        if (Math.abs(x) > 30 || Math.abs(z) > 30) { // Only trees not in road areas
          const distance = Math.sqrt(
            Math.pow(position.x - x, 2) + 
            Math.pow(position.z - z, 2)
          );
          if (distance < 2) { // Reduced tree collision radius to trunk only
            return true;
          }
        }
      }

      // Telephone pole collision
      const poles = [
        { x: -180, z: -120 }, { x: -90, z: -120 }, { x: 0, z: -120 }, 
        { x: 90, z: -120 }, { x: 180, z: -120 }
      ];

      for (const pole of poles) {
        const distance = Math.sqrt(
          Math.pow(position.x - pole.x, 2) + 
          Math.pow(position.z - pole.z, 2)
        );
        if (distance < 2) { // Pole collision radius
          return true;
        }
      }

      // Large rock collision bounds - from Terrain.tsx
      const rocks = [
        { x: -120, z: -200, radius: 10 },
        { x: 350, z: 150, radius: 12 },
        { x: -300, z: 250, radius: 14 },
        { x: 280, z: -280, radius: 11 }
      ];

      for (const rock of rocks) {
        const distance = Math.sqrt(
          Math.pow(position.x - rock.x, 2) + 
          Math.pow(position.z - rock.z, 2)
        );
        if (distance < rock.radius) {
          return true;
        }
      }

      return false;
    };
  }, []);

  // Hill ramp collision and height adjustment - updated positions and improved traversal
  const getHeightAtPosition = useMemo(() => {
    return (position: THREE.Vector3) => {
      const hills = [
        { position: [-250, 8, -250], radius: 20, height: 16 },
        { position: [280, 12, -280], radius: 25, height: 24 },
        { position: [-300, 10, 280], radius: 22.5, height: 20 },
        { position: [220, 15, 220], radius: 27.5, height: 30 },
        { position: [-350, 6, -180], radius: 17.5, height: 12 },
        { position: [160, 11, 300], radius: 24, height: 22 },
        { position: [-280, 9, -350], radius: 21, height: 18 },
        { position: [280, 13, -220], radius: 26, height: 26 }
      ];

      for (const hill of hills) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(position.x - hill.position[0], 2) + 
          Math.pow(position.z - hill.position[2], 2)
        );
        
        if (distanceFromCenter < hill.radius) {
          // Smooth ramp with higher bounce - allows driving over hills
          const normalizedDistance = distanceFromCenter / hill.radius;
          const rampHeight = (1 - normalizedDistance) * (hill.height / 1.5); // Increased from /2 to /1.5
          return 2 + rampHeight;
        }
      }
      return 2; // Default ground height
    };
  }, []);

  // Check if position is in toxic river
  const checkRiverCollision = useMemo(() => {
    return (position: THREE.Vector3) => {
      // River at x = 400 and x = -400, width 80
      return (Math.abs(position.x - 400) < 40) || (Math.abs(position.x + 400) < 40);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Don't process movement when game is paused
    if (gameState !== 'playing') return;

    const keys = getKeys();
    
    // Check boost availability and update boost state
    const canUseBoost = canBoost() && keys.boost && fuel > 0;
    isBoosting.current = canUseBoost;
    
    const baseMaxSpeed = 50;
    const boostMultiplier = 5; // 250% speed increase when boosting
    const maxSpeed = canUseBoost ? baseMaxSpeed * boostMultiplier : baseMaxSpeed;
    const acceleration = canUseBoost ? 38 : 5; // Even faster acceleration when boosting
    const turnSpeed = 8;
    const friction = 0.9;
    const brakeForce = 0.7;

    // Log controls for debugging
    if (keys.forward || keys.backward || keys.left || keys.right || keys.brake || keys.boost) {
      console.log('Tuk Tuk controls:', { 
        forward: keys.forward, 
        backward: keys.backward, 
        left: keys.left, 
        right: keys.right,
        brake: keys.brake,
        boost: keys.boost,
        boosting: isBoosting.current,
        fuel: fuel.toFixed(1)
      });
    }

    // Calculate current speed for turning adjustment
    const currentSpeed = velocity.current.length();
    const speedFactor = Math.min(currentSpeed / 8, 1);

    // Handle turning - can turn even when stationary (like real tuk tuk)
    if (keys.left) rotation.current += turnSpeed * delta * (currentSpeed > 0.5 ? speedFactor : 0.3);
    if (keys.right) rotation.current -= turnSpeed * delta * (currentSpeed > 0.5 ? speedFactor : 0.3);

    // Handle forward/backward movement
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);

    // Track acceleration for exhaust smoke
    isAccelerating.current = keys.forward || keys.backward;

    // Fuel consumption logic
    const isMoving = keys.forward || keys.backward;
    if (isMoving && fuel > 0) {
      const baseFuelConsumption = 0.8 * delta; // Base fuel consumption per second
      const boostFuelConsumption = canUseBoost ? 4.0 * delta : 0; // Much higher extra fuel when boosting
      consumeFuel(baseFuelConsumption + boostFuelConsumption);
    }

    // Only allow movement if there's fuel
    if (fuel > 0) {
      if (keys.forward) {
        const accelerationForce = direction.clone().multiplyScalar(acceleration * delta);
        velocity.current.add(accelerationForce);

        // Limit max speed
        if (velocity.current.length() > maxSpeed) {
          velocity.current.normalize().multiplyScalar(maxSpeed);
        }
      }

      if (keys.backward) {
        const reverseForce = direction.clone().multiplyScalar(-acceleration * 0.5 * delta);
        velocity.current.add(reverseForce);

        // Limit reverse speed
        if (velocity.current.length() > maxSpeed * 0.4) {
          velocity.current.normalize().multiplyScalar(maxSpeed * 0.4);
        }
      }
    }

    // Apply handbrake
    if (keys.brake) {
      velocity.current.multiplyScalar(brakeForce);
    }

    // Apply friction
    velocity.current.multiplyScalar(friction);

    // Stop if moving very slowly
    if (velocity.current.length() < 0.08) {
      velocity.current.set(0, 0, 0);
    }

    // Update position with collision detection
    const newPosition = tukTukPosition.clone().add(velocity.current);

    // Check for building collision
    if (checkCollision(newPosition)) {
      // Stop and bounce back slightly
      velocity.current.multiplyScalar(-0.3);
      newPosition.copy(tukTukPosition);
    }

    // Check for river collision - respawn at center
    if (checkRiverCollision(newPosition)) {
      newPosition.set(0, 2, 0); // Respawn at town center
      velocity.current.set(0, 0, 0); // Stop all movement
      rotation.current = 0; // Reset rotation
    }

    // Keep auto rickshaw on ground/hills and within much larger bounds
    newPosition.y = getHeightAtPosition(newPosition);
    newPosition.x = Math.max(-2500, Math.min(2500, newPosition.x));
    newPosition.z = Math.max(-2500, Math.min(2500, newPosition.z));

    setTukTukPosition(newPosition);

    // Update mesh transform
    meshRef.current.position.copy(newPosition);
    meshRef.current.rotation.y = rotation.current;
  });

  // Calculate exhaust position relative to tuk tuk - recalculate each frame
  const exhaustPosition = tukTukPosition.clone();
  const exhaustOffset = new THREE.Vector3(0, 0.8, 2.5); // Behind and slightly up from tuk tuk
  exhaustOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
  exhaustPosition.add(exhaustOffset);

  return (
    <group ref={meshRef} position={tukTukPosition.toArray()} rotation={[0, rotation.current, 0]} name="tukTukGroup">
      {scene ? (
        /* High-quality Indian auto rickshaw model - bigger and properly positioned */
        <primitive 
          object={(() => {
            const clonedScene = scene.clone();
            // Recursively enable shadows for all meshes
            clonedScene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            return clonedScene;
          })()} 
          scale={[6, 6, 6]} 
          position={[0, 0, 0]}
        />
      ) : (
        /* Fallback simple auto rickshaw built with basic geometries */
        <>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 2.5, 4]} />
            <meshLambertMaterial color="#FFD700" />
          </mesh>
          <mesh position={[0, 2.2, 1.8]} castShadow>
            <boxGeometry args={[2.8, 1.5, 0.1]} />
            <meshLambertMaterial color="#87CEEB" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 1.2, -2.5]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.5, 1.5]} />
            <meshLambertMaterial color="#FF6600" />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <boxGeometry args={[3.2, 0.2, 4.2]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
          <mesh position={[0, 0.6, 1.8]} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 8]} />
            <meshLambertMaterial color="#2F2F2F" />
          </mesh>
          <mesh position={[-1.2, 0.6, -1.5]} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 8]} />
            <meshLambertMaterial color="#2F2F2F" />
          </mesh>
          <mesh position={[1.2, 0.6, -1.5]} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 8]} />
            <meshLambertMaterial color="#2F2F2F" />
          </mesh>
        </>
      )}
      
      {/* Add exhaust smoke when accelerating - more intense when boosting */}
      <group position={exhaustPosition.toArray()}>
        <ExhaustSmoke 
          position={new THREE.Vector3(0, 0, 0)} 
          isAccelerating={isAccelerating.current || isBoosting.current}
          isBoosting={isBoosting.current}
        />
      </group>
    </group>
  );
}