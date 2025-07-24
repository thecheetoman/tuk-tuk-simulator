import { useMemo } from "react";
import * as THREE from "three";

export default function RuinsEnvironment() {
  // Create optimized ruins with fewer polygons
  const ruins = useMemo(() => {
    const ruinArray: any[] = [];
    
    // Pre-defined ruin positions for better performance
    const ruinPositions = [
      { x: -40, z: -30, type: 'broken_wall' },
      { x: 25, z: -45, type: 'collapsed_building' },
      { x: -60, z: 20, type: 'rubble_pile' },
      { x: 35, z: 35, type: 'broken_wall' },
      { x: -20, z: 50, type: 'collapsed_building' },
      { x: 50, z: -20, type: 'rubble_pile' },
      { x: -80, z: -10, type: 'broken_wall' },
      { x: 10, z: 60, type: 'collapsed_building' },
      { x: 70, z: 10, type: 'rubble_pile' },
      { x: -30, z: -60, type: 'broken_wall' }
    ];
    
    ruinPositions.forEach((pos, i) => {
      ruinArray.push({
        id: i,
        position: [pos.x, 0, pos.z],
        type: pos.type,
        rotation: Math.random() * Math.PI * 2
      });
    });
    
    return ruinArray;
  }, []);

  return (
    <group>
      {ruins.map((ruin) => (
        <group key={ruin.id} position={ruin.position as [number, number, number]} rotation={[0, ruin.rotation, 0]}>
          {ruin.type === 'broken_wall' && (
            <>
              {/* Broken wall segments */}
              <mesh position={[0, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[8, 4, 1]} />
                <meshLambertMaterial color="#8B7355" />
              </mesh>
              <mesh position={[3, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 2, 1]} />
                <meshLambertMaterial color="#A0926B" />
              </mesh>
              {/* Debris */}
              <mesh position={[1, 0.3, 2]} castShadow>
                <boxGeometry args={[1, 0.6, 1]} />
                <meshLambertMaterial color="#6B5B47" />
              </mesh>
            </>
          )}
          
          {ruin.type === 'collapsed_building' && (
            <>
              {/* Main collapsed structure */}
              <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.3]} castShadow receiveShadow>
                <boxGeometry args={[6, 3, 4]} />
                <meshLambertMaterial color="#7A6B5D" />
              </mesh>
              {/* Fallen roof */}
              <mesh position={[2, 0.5, 1]} rotation={[0.5, 0, 0]} castShadow>
                <boxGeometry args={[4, 0.3, 3]} />
                <meshLambertMaterial color="#5C4B3A" />
              </mesh>
              {/* Scattered debris */}
              <mesh position={[-1, 0.2, -1]} castShadow>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshLambertMaterial color="#8B7355" />
              </mesh>
            </>
          )}
          
          {ruin.type === 'rubble_pile' && (
            <>
              {/* Multiple rubble pieces */}
              <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                <sphereGeometry args={[1.2, 6, 4]} />
                <meshLambertMaterial color="#6B5B47" />
              </mesh>
              <mesh position={[1, 0.6, 0.5]} castShadow>
                <boxGeometry args={[0.8, 1.2, 0.6]} />
                <meshLambertMaterial color="#8B7355" />
              </mesh>
              <mesh position={[-0.5, 0.3, -0.8]} castShadow>
                <sphereGeometry args={[0.6, 5, 3]} />
                <meshLambertMaterial color="#A0926B" />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* Fixed scattered debris - no more teleporting */}
      {[
        [-75, 65], [23, -88], [67, 34], [-34, -56], [89, 12],
        [-12, 78], [45, -23], [-67, -12], [34, 89], [-89, -34],
        [56, 67], [-23, -45], [78, -67], [-45, 23], [12, -78]
      ].map(([x, z], i) => (
        <mesh key={`debris-${i}`} position={[x, 0.1, z]} castShadow>
          <boxGeometry args={[
            i % 3 === 0 ? 0.7 : i % 3 === 1 ? 0.9 : 0.5, 
            0.2, 
            i % 3 === 0 ? 0.8 : i % 3 === 1 ? 0.6 : 0.7
          ]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      ))}
    </group>
  );
}