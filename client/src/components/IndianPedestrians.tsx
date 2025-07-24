import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTukTukGame } from "../lib/stores/useTukTukGame";

interface Pedestrian {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  modelType: 'turban' | 'sari' | 'dhoti' | 'elder' | 'businessman';
  walkDirection: THREE.Vector3;
  isWalking: boolean;
  isDead: boolean;
  ragdollActive: boolean;
  ragdollVelocity: THREE.Vector3;
  ragdollRotation: THREE.Vector3;
  lastWalkChange: number;
  walkCycle: number;
  spawnBuilding: number;
  hasScreamed: boolean;
}

interface PedestriansProps {
  onScoreUpdate: (score: number) => void;
  gameState: 'loading' | 'menu' | 'playing' | 'settings' | 'paused';
}

export default function IndianPedestrians({ onScoreUpdate, gameState }: PedestriansProps) {
  const { tukTukPosition } = useTukTukGame();
  const groupRef = useRef<THREE.Group>(null);
  
  // Load 3D models with full bodies and fallbacks
  let turbanModel, sariModel, dhotiModel, elderModel, businessModel;
  
  try {
    ({ scene: turbanModel } = useGLTF("/models/indian_man_turban.glb"));
  } catch (error) {
    turbanModel = null;
  }
  
  try {
    ({ scene: sariModel } = useGLTF("/models/indian_woman_full.glb"));
  } catch (error) {
    sariModel = null;
  }
  
  try {
    ({ scene: dhotiModel } = useGLTF("/models/indian_man_dhoti.glb"));
  } catch (error) {
    dhotiModel = null;
  }
  
  try {
    ({ scene: elderModel } = useGLTF("/models/indian_elder.glb"));
  } catch (error) {
    elderModel = null;
  }
  
  try {
    ({ scene: businessModel } = useGLTF("/models/indian_businessman.glb"));
  } catch (error) {
    businessModel = null;
  }

  // Fixed building positions for spawning
  const buildingPositions = useMemo(() => [
    { x: -30, z: -40 }, { x: 40, z: -30 }, { x: -50, z: 20 }, { x: 30, z: 40 },
    { x: -20, z: 60 }, { x: 60, z: -10 }, { x: -70, z: -20 }, { x: 10, z: 70 },
    { x: 80, z: 15 }, { x: -40, z: -70 }, { x: -80, z: 50 }, { x: 70, z: -50 },
    { x: -60, z: -60 }, { x: 90, z: 80 }, { x: -90, z: -80 }, { x: 120, z: 30 },
    { x: -120, z: -30 }, { x: 50, z: 120 }, { x: -50, z: -120 }, { x: 150, z: -150 }
  ], []);

  // Initialize pedestrians with fixed positions near buildings - no random movement on spawn
  const [pedestrians, setPedestrians] = useState<Pedestrian[]>(() => {
    const initialPedestrians: Pedestrian[] = [];
    const modelTypes: ('turban' | 'sari' | 'dhoti' | 'elder' | 'businessman')[] = 
      ['turban', 'sari', 'dhoti', 'elder', 'businessman'];
    
    // Fixed spawn positions to prevent random teleportation
    const fixedSpawnPositions = [
      { x: -25, z: -35 }, { x: 35, z: -25 }, { x: -45, z: 25 }, { x: 25, z: 35 },
      { x: -15, z: 55 }, { x: 55, z: -5 }, { x: -65, z: -15 }, { x: 5, z: 65 },
      { x: 75, z: 10 }, { x: -35, z: -65 }, { x: -75, z: 45 }, { x: 65, z: -45 },
      { x: -55, z: -55 }, { x: 85, z: 75 }, { x: -85, z: -75 }
    ];
    
    for (let i = 0; i < 15; i++) {
      const spawnPos = fixedSpawnPositions[i];
      
      initialPedestrians.push({
        id: i,
        position: new THREE.Vector3(spawnPos.x, 1, spawnPos.z),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: Math.random() * Math.PI * 2,
        modelType: modelTypes[i % modelTypes.length],
        walkDirection: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          0,
          (Math.random() - 0.5) * 2
        ).normalize(),
        isWalking: Math.random() > 0.3,
        isDead: false,
        ragdollActive: false,
        ragdollVelocity: new THREE.Vector3(0, 0, 0),
        ragdollRotation: new THREE.Vector3(0, 0, 0),
        lastWalkChange: Date.now(),
        walkCycle: Math.random() * Math.PI * 2,
        spawnBuilding: i % buildingPositions.length,
        hasScreamed: false
      });
    }

    return initialPedestrians;
  });

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const screamSounds = useRef<HTMLAudioElement[]>([]);

  // Initialize scream sound effects using existing sounds
  useEffect(() => {
    const sounds = [
      new Audio('/sounds/hit.mp3'),
      new Audio('/sounds/success.mp3')
    ];
    
    sounds.forEach(sound => {
      sound.volume = 0.8;
      sound.playbackRate = 0.7; // Lower pitch for scream effect
      sound.preload = 'auto';
    });
    
    screamSounds.current = sounds;
  }, []);

  const playScreamSound = () => {
    const randomScream = screamSounds.current[Math.floor(Math.random() * screamSounds.current.length)];
    if (randomScream) {
      randomScream.currentTime = 0;
      randomScream.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Spawn new pedestrians from fixed positions - no random placement
  const spawnNewPedestrian = (deadPedestrianId: number) => {
    setTimeout(() => {
      setPedestrians(prev => {
        const deadPedestrian = prev.find(p => p.id === deadPedestrianId);
        if (!deadPedestrian) return prev;
        
        const modelTypes: ('turban' | 'sari' | 'dhoti' | 'elder' | 'businessman')[] = 
          ['turban', 'sari', 'dhoti', 'elder', 'businessman'];
        
        // Fixed respawn positions - same as initial spawn
        const fixedSpawnPositions = [
          { x: -25, z: -35 }, { x: 35, z: -25 }, { x: -45, z: 25 }, { x: 25, z: 35 },
          { x: -15, z: 55 }, { x: 55, z: -5 }, { x: -65, z: -15 }, { x: 5, z: 65 },
          { x: 75, z: 10 }, { x: -35, z: -65 }, { x: -75, z: 45 }, { x: 65, z: -45 },
          { x: -55, z: -55 }, { x: 85, z: 75 }, { x: -85, z: -75 }
        ];
        
        const respawnPos = fixedSpawnPositions[deadPedestrianId % fixedSpawnPositions.length];
        
        return prev.map(p => 
          p.id === deadPedestrianId ? {
            ...p,
            position: new THREE.Vector3(respawnPos.x, 1, respawnPos.z),
            isDead: false,
            ragdollActive: false,
            ragdollVelocity: new THREE.Vector3(0, 0, 0),
            ragdollRotation: new THREE.Vector3(0, 0, 0),
            isWalking: true,
            hasScreamed: false,
            walkDirection: new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              0,
              (Math.random() - 0.5) * 2
            ).normalize(),
            modelType: modelTypes[Math.floor(Math.random() * modelTypes.length)]
          } : p
        );
      });
    }, 5000); // Respawn after 5 seconds
  };

  useFrame((state, delta) => {
    // Don't update pedestrians when game is paused
    if (gameState !== 'playing') return;
    
    setPedestrians(prevPedestrians => {
      return prevPedestrians.map(pedestrian => {
        if (pedestrian.isDead) return pedestrian;
        
        const updatedPedestrian = { ...pedestrian };
        const currentTime = Date.now();

        // Check collision with tuk tuk for death - increased detection range
        const distanceToTukTuk = pedestrian.position.distanceTo(tukTukPosition);
        console.log(`Pedestrian ${pedestrian.id} distance to tuk tuk: ${distanceToTukTuk.toFixed(2)}`);
        if (distanceToTukTuk < 5 && !pedestrian.ragdollActive && !pedestrian.isDead) {
          console.log(`HIT DETECTED! Pedestrian ${pedestrian.id} killed!`);
          // Kill pedestrian and update score with combo system
          updatedPedestrian.isDead = true;
          updatedPedestrian.ragdollActive = true;
          updatedPedestrian.hasScreamed = true;
          
          // Play scream sound
          playScreamSound();
          
          // Fast ragdoll activation
          const hitDirection = pedestrian.position.clone().sub(tukTukPosition).normalize();
          updatedPedestrian.ragdollVelocity = hitDirection.multiplyScalar(25); // Increased from 15
          updatedPedestrian.ragdollVelocity.y = 12; // Increased from 8
          updatedPedestrian.ragdollRotation = new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          );
          
          // Combo system
          const timeSinceLastHit = currentTime - lastHitTime;
          let comboMultiplier = 1;
          
          if (timeSinceLastHit < 2000) { // 2 seconds for combo
            setCombo(prev => prev + 1);
            comboMultiplier = 1 + (combo * 0.5); // +50% per combo
          } else {
            setCombo(1);
          }
          
          const basePoints = 10;
          const pointsEarned = Math.round(basePoints * comboMultiplier);
          const newScore = score + pointsEarned;
          
          setLastHitTime(currentTime);
          setScore(newScore);
          onScoreUpdate(newScore);
          
          // Dispatch combo event for UI
          window.dispatchEvent(new CustomEvent('comboUpdate', {
            detail: { combo: combo + 1, points: pointsEarned }
          }));
          
          // Log combo info
          if (combo > 1) {
            console.log(`COMBO x${combo}! +${pointsEarned} points!`);
          }
          
          spawnNewPedestrian(pedestrian.id);
        }

        if (updatedPedestrian.ragdollActive) {
          // Apply ragdoll physics
          updatedPedestrian.position.add(updatedPedestrian.ragdollVelocity.clone().multiplyScalar(delta));
          updatedPedestrian.ragdollVelocity.y -= 20 * delta; // Gravity
          updatedPedestrian.ragdollVelocity.multiplyScalar(0.95); // Air resistance

          // Ground collision
          if (updatedPedestrian.position.y <= 1) {
            updatedPedestrian.position.y = 1;
            updatedPedestrian.ragdollVelocity.y = Math.abs(updatedPedestrian.ragdollVelocity.y) * 0.3;
            updatedPedestrian.ragdollVelocity.x *= 0.8;
            updatedPedestrian.ragdollVelocity.z *= 0.8;
          }

          // Stop ragdoll after a while
          if (updatedPedestrian.ragdollVelocity.length() < 1) {
            updatedPedestrian.ragdollActive = false;
            updatedPedestrian.ragdollVelocity.set(0, 0, 0);
          }
        } else if (!updatedPedestrian.isDead) {
          // Normal walking behavior with animation
          updatedPedestrian.walkCycle += delta * 4;
          
          if (currentTime - updatedPedestrian.lastWalkChange > 3000) {
            updatedPedestrian.isWalking = Math.random() > 0.2;
            if (updatedPedestrian.isWalking) {
              updatedPedestrian.walkDirection = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
              ).normalize();
              updatedPedestrian.rotation = Math.atan2(updatedPedestrian.walkDirection.x, updatedPedestrian.walkDirection.z);
            }
            updatedPedestrian.lastWalkChange = currentTime;
          }

          if (updatedPedestrian.isWalking) {
            const walkSpeed = 1.5;
            const movement = updatedPedestrian.walkDirection.clone().multiplyScalar(walkSpeed * delta);
            updatedPedestrian.position.add(movement);

            // Keep within bounds and away from roads
            updatedPedestrian.position.x = Math.max(-200, Math.min(200, updatedPedestrian.position.x));
            updatedPedestrian.position.z = Math.max(-200, Math.min(200, updatedPedestrian.position.z));
            
            // Avoid main roads
            if (Math.abs(updatedPedestrian.position.x) < 20 && Math.abs(updatedPedestrian.position.z) < 20) {
              if (Math.abs(updatedPedestrian.position.x) < Math.abs(updatedPedestrian.position.z)) {
                updatedPedestrian.position.x += updatedPedestrian.position.x > 0 ? 25 : -25;
              } else {
                updatedPedestrian.position.z += updatedPedestrian.position.z > 0 ? 25 : -25;
              }
            }
          }
        }

        return updatedPedestrian;
      });
    });
  });

  const getModel = (type: 'turban' | 'sari' | 'dhoti' | 'elder' | 'businessman') => {
    const models = {
      turban: turbanModel,
      sari: sariModel,
      dhoti: dhotiModel,
      elder: elderModel,
      businessman: businessModel
    };
    
    return models[type];
  };

  const renderPedestrian = (type: 'turban' | 'sari' | 'dhoti' | 'elder' | 'businessman') => {
    const model = getModel(type);
    
    if (model) {
      return (
        <primitive 
          object={model.clone()} 
          scale={[2.5, 2.5, 2.5]}
          castShadow
          receiveShadow
        />
      );
    }
    
    // Fallback to simple geometry
    const colors = {
      turban: '#FF6600',
      sari: '#FF1493', 
      dhoti: '#8B4513',
      elder: '#696969',
      businessman: '#000080'
    };
    
    return (
      <group>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.5, 0.4]} />
          <meshLambertMaterial color={colors[type]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshLambertMaterial color="#FFDBAC" />
        </mesh>
        <mesh position={[-0.6, 1.8, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={colors[type]} />
        </mesh>
        <mesh position={[0.6, 1.8, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={colors[type]} />
        </mesh>
        <mesh position={[-0.2, 0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        <mesh position={[0.2, 0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {pedestrians.map((pedestrian) => {
        const walkBob = pedestrian.isWalking && !pedestrian.ragdollActive ? 
          Math.sin(pedestrian.walkCycle) * 0.1 : 0;
        
        return (
          <group 
            key={pedestrian.id}
            position={[
              pedestrian.position.x,
              pedestrian.position.y + walkBob,
              pedestrian.position.z
            ]}
            rotation={pedestrian.ragdollActive ? 
              [pedestrian.ragdollRotation.x, pedestrian.rotation + pedestrian.ragdollRotation.y, pedestrian.ragdollRotation.z] :
              [0, pedestrian.rotation, 0]
            }
            userData={{ pedestrian: true, noCollision: true }}
          >
            {renderPedestrian(pedestrian.modelType)}
          </group>
        );
      })}
    </group>
  );
}