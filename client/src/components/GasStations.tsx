import { useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFuelSystem } from "../lib/stores/useFuelSystem";
import { useTukTukGame } from "../lib/stores/useTukTukGame";

interface GasStation {
  id: number;
  position: THREE.Vector3;
  rotation: number;
  scale: number[];
}

interface GasStationsProps {
  gameState: 'loading' | 'menu' | 'playing' | 'settings' | 'paused';
}

export default function GasStations({ gameState }: GasStationsProps) {
  // Load the gas station models
  const { scene: gasStationScene } = useGLTF("/models/gas_station.glb");
  const { scene: gasStationSignScene } = useGLTF("/models/gas_station_sign.glb");
  
  const { refillFuel } = useFuelSystem();
  const { tukTukPosition } = useTukTukGame();
  
  // Create gas stations at strategic locations across the map
  const gasStations = useMemo<GasStation[]>(() => {
    return [
      // Main gas stations spread across the large map
      { id: 0, position: new THREE.Vector3(100, 0, 100), rotation: 0, scale: [3, 3, 3] },
      { id: 1, position: new THREE.Vector3(-150, 0, 200), rotation: Math.PI / 2, scale: [2.5, 2.5, 2.5] },
      { id: 2, position: new THREE.Vector3(300, 0, -100), rotation: Math.PI, scale: [3.2, 3.2, 3.2] },
      { id: 3, position: new THREE.Vector3(-200, 0, -250), rotation: -Math.PI / 2, scale: [2.8, 2.8, 2.8] },
      { id: 4, position: new THREE.Vector3(500, 0, 400), rotation: Math.PI / 4, scale: [3.5, 3.5, 3.5] },
      { id: 5, position: new THREE.Vector3(-400, 0, 350), rotation: -Math.PI / 4, scale: [2.7, 2.7, 2.7] },
      { id: 6, position: new THREE.Vector3(800, 0, -300), rotation: 3 * Math.PI / 4, scale: [3.1, 3.1, 3.1] },
      { id: 7, position: new THREE.Vector3(-600, 0, -500), rotation: -3 * Math.PI / 4, scale: [2.9, 2.9, 2.9] },
      // Additional stations for the expanded map
      { id: 8, position: new THREE.Vector3(1200, 0, 800), rotation: Math.PI / 6, scale: [3.3, 3.3, 3.3] },
      { id: 9, position: new THREE.Vector3(-1000, 0, 600), rotation: -Math.PI / 6, scale: [2.6, 2.6, 2.6] },
      { id: 10, position: new THREE.Vector3(1500, 0, -800), rotation: 5 * Math.PI / 6, scale: [3.4, 3.4, 3.4] },
      { id: 11, position: new THREE.Vector3(-1200, 0, -1000), rotation: -5 * Math.PI / 6, scale: [2.4, 2.4, 2.4] }
    ];
  }, []);

  const gasStationRefs = useRef<(THREE.Group | null)[]>([]);

  // Check for fuel refill proximity
  useFrame(() => {
    if (gameState !== 'playing') return;
    
    gasStations.forEach((station, index) => {
      const distance = tukTukPosition.distanceTo(station.position);
      const refillRange = 25; // Increased range for easier access
      
      if (distance < refillRange) {
        // Auto-refill fuel when near gas station
        refillFuel(2); // Refill 2 units per frame when close
        console.log(`Refueling at gas station ${station.id}, distance: ${distance.toFixed(2)}`);
      }
    });
  });

  return (
    <group name="gasStations">
      {gasStations.map((station, index) => (
        <group key={station.id} position={station.position.toArray()}>
          {/* Main gas station building */}
          <primitive 
            ref={(el: THREE.Group) => (gasStationRefs.current[index] = el)}
            object={gasStationScene.clone()} 
            scale={station.scale}
            rotation={[0, station.rotation, 0]}
            castShadow 
            receiveShadow
          />
          
          {/* Gas station sign positioned in front */}
          <primitive 
            object={gasStationSignScene.clone()} 
            position={[
              Math.cos(station.rotation) * 15, // Position sign in front based on rotation
              0,
              Math.sin(station.rotation) * 15
            ]}
            scale={[2, 2, 2]}
            rotation={[0, station.rotation, 0]}
            castShadow 
            receiveShadow
          />
          
          {/* Fuel indicator light - green when player is nearby */}
          <mesh 
            position={[0, 8, 0]}
            castShadow={false}
          >
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial 
              color={tukTukPosition.distanceTo(station.position) < 25 ? "#00FF00" : "#FF0000"}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Fuel pump station markers */}
          <group position={[5, 0, 5]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
              <meshLambertMaterial color="#FF6600" />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow>
              <boxGeometry args={[1, 1, 0.5]} />
              <meshLambertMaterial color="#000000" />
            </mesh>
          </group>
          
          <group position={[-5, 0, 5]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
              <meshLambertMaterial color="#FF6600" />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow>
              <boxGeometry args={[1, 1, 0.5]} />
              <meshLambertMaterial color="#000000" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

// Preload models
useGLTF.preload("/models/gas_station.glb");
useGLTF.preload("/models/gas_station_sign.glb");