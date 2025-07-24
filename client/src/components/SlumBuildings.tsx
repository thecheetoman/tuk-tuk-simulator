import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function SlumBuildings() {
  // Create dirty slum shacks with fixed positions - no teleporting
  const buildings = useMemo(() => {
    const buildingArray: any[] = [];
    
    // Fixed building positions spread across the map
    const buildingData = [
      // Original buildings
      { x: -30, z: -40, type: 'shack', height: 8, width: 6, depth: 8 },
      { x: 40, z: -30, type: 'shed', height: 6, width: 5, depth: 6 },
      { x: -50, z: 20, type: 'shack', height: 10, width: 7, depth: 9 },
      { x: 30, z: 40, type: 'shed', height: 7, width: 6, depth: 7 },
      { x: -20, z: 60, type: 'shack', height: 9, width: 8, depth: 10 },
      { x: 60, z: -10, type: 'shed', height: 5, width: 4, depth: 5 },
      { x: -70, z: -20, type: 'shack', height: 11, width: 9, depth: 11 },
      { x: 10, z: 70, type: 'shed', height: 8, width: 6, depth: 8 },
      { x: 80, z: 15, type: 'shack', height: 12, width: 10, depth: 12 },
      { x: -40, z: -70, type: 'shed', height: 6, width: 5, depth: 6 },
      // Additional 20 buildings spread out
      { x: -80, z: 50, type: 'shack', height: 9, width: 7, depth: 8 },
      { x: 70, z: -50, type: 'shed', height: 7, width: 5, depth: 6 },
      { x: -60, z: -60, type: 'shack', height: 8, width: 6, depth: 7 },
      { x: 90, z: 80, type: 'shed', height: 6, width: 4, depth: 5 },
      { x: -90, z: -80, type: 'shack', height: 10, width: 8, depth: 9 },
      { x: 120, z: 30, type: 'shed', height: 7, width: 6, depth: 7 },
      { x: -120, z: -30, type: 'shack', height: 11, width: 9, depth: 10 },
      { x: 50, z: 120, type: 'shed', height: 5, width: 4, depth: 5 },
      { x: -50, z: -120, type: 'shack', height: 9, width: 7, depth: 8 },
      { x: 150, z: -150, type: 'shed', height: 8, width: 6, depth: 7 },
      { x: -150, z: 150, type: 'shack', height: 7, width: 5, depth: 6 },
      { x: 100, z: -100, type: 'shed', height: 6, width: 4, depth: 5 },
      { x: -100, z: 100, type: 'shack', height: 10, width: 8, depth: 9 },
      { x: 200, z: 50, type: 'shed', height: 9, width: 7, depth: 8 },
      { x: -200, z: -50, type: 'shack', height: 8, width: 6, depth: 7 },
      { x: 75, z: 200, type: 'shed', height: 7, width: 5, depth: 6 },
      { x: -75, z: -200, type: 'shack', height: 11, width: 9, depth: 10 },
      { x: 250, z: -25, type: 'shed', height: 6, width: 4, depth: 5 },
      { x: -250, z: 25, type: 'shack', height: 9, width: 7, depth: 8 },
      { x: 25, z: 250, type: 'shed', height: 8, width: 6, depth: 7 }
    ];
    
    buildingData.forEach((building, i) => {
      buildingArray.push({
        id: i,
        position: [building.x, building.height / 2, building.z],
        width: building.width,
        height: building.height,
        depth: building.depth,
        type: building.type,
        rustColor: `#${Math.floor(Math.random() * 3) === 0 ? '8B4513' : Math.floor(Math.random() * 3) === 1 ? '654321' : '4A4A4A'}`
      });
    });
    
    return buildingArray;
  }, []);

  return (
    <group>
      {buildings.map((building) => (
        <group key={building.id}>
          {/* Main rusted sheet metal structure with collision */}
          <mesh 
            position={building.position as [number, number, number]} 
            castShadow 
            receiveShadow
            userData={{ collision: true }}
          >
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshLambertMaterial color={building.rustColor} />
          </mesh>
          
          {/* Corrugated metal roof */}
          <mesh 
            position={[
              building.position[0],
              building.position[1] + building.height/2 + 0.2,
              building.position[2]
            ]}
            castShadow
          >
            <boxGeometry args={[building.width + 1, 0.3, building.depth + 1]} />
            <meshLambertMaterial color="#696969" />
          </mesh>
          
          {/* Rusty door */}
          <mesh 
            position={[
              building.position[0],
              building.position[1] - building.height/2 + 2,
              building.position[2] + building.depth/2 + 0.1
            ]}
            castShadow
          >
            <boxGeometry args={[1.5, 4, 0.2]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
          
          {/* Dirty windows with broken glass effect */}
          {building.type === 'shack' && Array.from({ length: 2 }, (_, window) => (
            <mesh 
              key={`window-${building.id}-${window}`}
              position={[
                building.position[0] + (window === 0 ? -building.width/3 : building.width/3),
                building.position[1],
                building.position[2] + building.depth/2 + 0.1
              ]}
              castShadow
            >
              <boxGeometry args={[1, 1.5, 0.1]} />
              <meshLambertMaterial 
                color="#2F4F4F"
                transparent 
                opacity={0.6}
              />
            </mesh>
          ))}
          
          {/* Fixed trash and debris around buildings */}
          <mesh 
            position={[building.position[0] - 2, 0.2, building.position[2] + 3]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.4, 0.3]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          
          <mesh 
            position={[building.position[0] + 3, 0.2, building.position[2] - 2]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.4, 0.3]} />
            <meshLambertMaterial color="#2F4F4F" />
          </mesh>
          
          <mesh 
            position={[building.position[0] - 1, 0.2, building.position[2] - 3]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.4, 0.3]} />
            <meshLambertMaterial color="#654321" />
          </mesh>
          
          {/* Fixed makeshift antenna or pipe */}
          <mesh 
            position={[
              building.position[0] + (building.id % 3 === 0 ? -1 : building.id % 3 === 1 ? 0 : 1),
              building.position[1] + building.height/2 + 2,
              building.position[2] + (building.id % 2 === 0 ? -1 : 1)
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 4, 6]} />
            <meshLambertMaterial color="#444444" />
          </mesh>
        </group>
      ))}
    </group>
  );
}