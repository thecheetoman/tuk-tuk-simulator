import { useMemo } from "react";
import * as THREE from "three";

export default function CityBuildings() {
  // Procedurally generate buildings in a grid pattern
  const buildings = useMemo(() => {
    const buildingArray = [];
    const gridSpacing = 25;
    const buildingVariations = [
      { width: 12, height: 20, depth: 12, color: "#8B8B8B" },
      { width: 15, height: 35, depth: 10, color: "#A0A0A0" },
      { width: 10, height: 25, depth: 15, color: "#707070" },
      { width: 18, height: 30, depth: 18, color: "#909090" },
      { width: 8, height: 15, depth: 8, color: "#6B6B6B" }
    ];
    
    for (let x = -125; x <= 125; x += gridSpacing) {
      for (let z = -125; z <= 125; z += gridSpacing) {
        // Create road grid - skip buildings on major roads
        if ((x % 50 === 0) || (z % 50 === 0)) continue;
        
        // Add some randomness to building placement
        if (Math.random() < 0.85) {
          const variation = buildingVariations[Math.floor(Math.random() * buildingVariations.length)];
          const building = {
            position: [
              x + (Math.random() - 0.5) * 8, 
              variation.height / 2, 
              z + (Math.random() - 0.5) * 8
            ],
            width: variation.width + Math.random() * 4,
            height: variation.height + Math.random() * 15,
            depth: variation.depth + Math.random() * 4,
            color: variation.color,
            id: `${x}-${z}`
          };
          buildingArray.push(building);
        }
      }
    }
    
    return buildingArray;
  }, []);

  return (
    <group>
      {buildings.map((building) => (
        <group key={building.id}>
          {/* Main building */}
          <mesh 
            position={building.position as [number, number, number]} 
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshLambertMaterial color={building.color} />
          </mesh>
          
          {/* Windows */}
          {Array.from({ length: Math.floor(building.height / 4) }, (_, floor) => 
            Array.from({ length: 4 }, (_, side) => {
              const angle = (side * Math.PI) / 2;
              const radius = Math.max(building.width, building.depth) / 2 + 0.1;
              const windowX = building.position[0] + Math.cos(angle) * radius;
              const windowZ = building.position[2] + Math.sin(angle) * radius;
              const windowY = building.position[1] - building.height/2 + 2 + floor * 4;
              
              return (
                <mesh 
                  key={`${building.id}-window-${floor}-${side}`}
                  position={[windowX, windowY, windowZ]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[0.1, 1.5, 6]} />
                  <meshLambertMaterial 
                    color={Math.random() > 0.7 ? "#FFFF88" : "#87CEEB"} 
                    transparent 
                    opacity={0.8} 
                  />
                </mesh>
              );
            })
          )}
          
          {/* Rooftop details */}
          <mesh 
            position={[building.position[0], building.position[1] + building.height/2 + 0.5, building.position[2]]}
            castShadow
          >
            <boxGeometry args={[building.width * 0.8, 1, building.depth * 0.8]} />
            <meshLambertMaterial color="#444444" />
          </mesh>
        </group>
      ))}
      
      {/* Fixed street lights - no teleporting */}
      {[
        [-100, 0], [100, 0], [0, -100], [0, 100], [-50, 50], [50, -50],
        [-75, 0], [75, 0], [0, -75], [0, 75], [-25, 25], [25, -25],
        [-150, 0], [150, 0], [0, -150], [0, 150], [-125, 25], [125, -25],
        [-50, 100], [50, -100], [-100, 50], [100, -50], [0, 0], [-25, 0],
        [25, 0], [0, -25], [0, 25], [-75, 75], [75, -75], [-50, -50],
        [50, 50], [-125, 0], [125, 0], [0, -125], [0, 125], [-100, 100],
        [100, -100], [-75, -25], [75, 25], [-25, 75]
      ].map(([x, z], i) => (
        <group key={`streetlight-${i}`}>
          {/* Pole with collision */}
          <mesh position={[x, 4, z]} castShadow userData={{ collision: true }}>
            <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
          
          {/* Light */}
          <mesh position={[x, 8.5, z]}>
            <sphereGeometry args={[0.5, 8, 6]} />
            <meshLambertMaterial color="#FFFFAA" />
          </mesh>
          
          {/* Light glow */}
          <pointLight 
            position={[x, 8.5, z]} 
            color="#FFFFAA" 
            intensity={0.5} 
            distance={15} 
          />
        </group>
      ))}
      
      {/* Traffic signs */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        
        return (
          <group key={`sign-${i}`} position={[x, 0, z]}>
            {/* Sign post */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
              <meshLambertMaterial color="#666666" />
            </mesh>
            
            {/* Sign */}
            <mesh position={[0, 3.5, 0]} castShadow>
              <boxGeometry args={[1.5, 1, 0.1]} />
              <meshLambertMaterial color={Math.random() > 0.5 ? "#FF0000" : "#00AA00"} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}