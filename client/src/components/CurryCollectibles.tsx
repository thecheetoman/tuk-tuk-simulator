import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTukTukGame } from "../lib/stores/useTukTukGame";
import { useFuelSystem } from "../lib/stores/useFuelSystem";

interface CurryCollectible {
  id: number;
  position: THREE.Vector3;
  collected: boolean;
  rotation: number;
  bobOffset: number;
}

interface CurryCollectiblesProps {
  gameState: 'loading' | 'menu' | 'playing' | 'settings' | 'paused';
}

export default function CurryCollectibles({ gameState }: CurryCollectiblesProps) {
  const { tukTukPosition } = useTukTukGame();
  const { refillFuel } = useFuelSystem();
  
  // Fixed curry positions across the map
  const [collectibles, setCollectibles] = useState<CurryCollectible[]>(() => {
    const positions = [
      { x: -60, z: -80 },
      { x: 85, z: -45 },
      { x: -25, z: 95 },
      { x: 110, z: 60 },
      { x: -95, z: -25 },
      { x: 45, z: -110 },
      { x: -130, z: 75 },
      { x: 75, z: 130 },
      { x: -75, z: -130 },
      { x: 160, z: -85 },
      { x: -160, z: 40 },
      { x: 40, z: 160 },
      { x: -40, z: -160 },
      { x: 200, z: 25 },
      { x: -200, z: -55 }
    ];
    
    return positions.map((pos, i) => ({
      id: i,
      position: new THREE.Vector3(pos.x, 3, pos.z),
      collected: false,
      rotation: Math.random() * Math.PI * 2,
      bobOffset: Math.random() * Math.PI * 2
    }));
  });

  useFrame((state, delta) => {
    if (gameState !== 'playing') return;

    const time = state.clock.elapsedTime;
    
    // Update collectibles rotation and bobbing
    setCollectibles(prev => prev.map(collectible => {
      if (collectible.collected) return collectible;
      
      // Check collision with tuk tuk - improved detection
      const distance = collectible.position.distanceTo(tukTukPosition);
      if (distance < 5) {
        // Collect the curry
        refillFuel(35); // Refill 35% fuel
        console.log(`Curry collected! Fuel refilled +35%. Distance: ${distance.toFixed(2)}`);
        return { ...collectible, collected: true };
      }
      
      return {
        ...collectible,
        rotation: collectible.rotation + delta * 2,
        bobOffset: collectible.bobOffset + delta * 3
      };
    }));
  });

  const activeCurries = useMemo(() => 
    collectibles.filter(c => !c.collected), 
    [collectibles]
  );

  return (
    <group>
      {activeCurries.map((curry) => (
        <group key={curry.id} position={[
          curry.position.x, 
          curry.position.y + Math.sin(curry.bobOffset) * 0.5, 
          curry.position.z
        ]}>
          {/* Curry bowl */}
          <mesh rotation={[0, curry.rotation, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 0.8, 0.6, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          
          {/* Curry inside */}
          <mesh 
            position={[0, 0.2, 0]} 
            rotation={[0, curry.rotation, 0]}
            castShadow
          >
            <cylinderGeometry args={[1.0, 0.9, 0.3, 8]} />
            <meshLambertMaterial color="#FF6B35" />
          </mesh>
          
          {/* Floating sparkles around curry */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2 + curry.rotation;
            const radius = 2 + Math.sin(curry.bobOffset + i) * 0.5;
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  1 + Math.sin(curry.bobOffset + i * 0.5) * 0.3,
                  Math.sin(angle) * radius
                ]}
                castShadow
              >
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshLambertMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
              </mesh>
            );
          })}
          
          {/* Glow effect */}
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3, 3]} />
            <meshLambertMaterial 
              color="#FF6B35" 
              transparent 
              opacity={0.3}
              emissive="#FF6B35"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}