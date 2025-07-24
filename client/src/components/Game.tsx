import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import TukTuk from "./TukTuk";
import Terrain from "./Terrain";
import GameUI from "./GameUI";
import RuinsEnvironment from "./RuinsEnvironment";
import SlumBuildings from "./SlumBuildings";
import IndianPedestrians from "./IndianPedestrians";
import TelephonePoles from "./TelephonePoles";
import PauseMenu from "./PauseMenu";
import Sun from "./Sun";
import GasStations from "./GasStations";

import { useTukTukGame } from "../lib/stores/useTukTukGame";
import { useGameState } from "../lib/stores/useGameState";
import { Controls } from "../App";

interface GameProps {
  gameState: 'loading' | 'menu' | 'playing' | 'settings' | 'paused';
  onPause: () => void;
  onResume: () => void;
  onMainMenu: () => void;
  onSettings: () => void;
}

export default function Game({ gameState, onPause, onResume, onMainMenu, onSettings }: GameProps) {
  const { tukTukPosition } = useTukTukGame();
  const { setScore } = useGameState();
  const [cameraMode, setCameraMode] = useState<'third' | 'first'>('third');
  const [, getKeys] = useKeyboardControls<Controls>();
  const lastCameraSwitchRef = useRef(0);
  const lastPauseRef = useRef(0);

  useFrame((state, delta) => {
    const keys = getKeys();
    
    // Handle pause with P key in any game state
    if (gameState === 'playing' && keys.pause && Date.now() - lastPauseRef.current > 300) {
      onPause();
      lastPauseRef.current = Date.now();
      return; // Stop processing when pausing
    }
    
    // Resume with P key when paused
    if (gameState === 'paused' && keys.pause && Date.now() - lastPauseRef.current > 300) {
      onResume();
      lastPauseRef.current = Date.now();
      return;
    }

    if (gameState === 'playing') {
      // Handle camera switching with C key
      if (keys.cameraSwitch && Date.now() - lastCameraSwitchRef.current > 300) {
        setCameraMode(prev => prev === 'third' ? 'first' : 'third');
        lastCameraSwitchRef.current = Date.now();
      }

      // Camera follows the auto rickshaw
      const tukTukMesh = state.scene.getObjectByName('tukTukGroup');
      const tukTukRotation = tukTukMesh ? tukTukMesh.rotation.y : 0;

      if (cameraMode === 'third') {
        // Third person camera - behind the tuk tuk
        const cameraOffset = new THREE.Vector3(0, 6, 15);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), tukTukRotation);
        const targetPosition = new THREE.Vector3().copy(tukTukPosition).add(cameraOffset);
        
        state.camera.position.copy(targetPosition);
        state.camera.lookAt(tukTukPosition.x, tukTukPosition.y + 1, tukTukPosition.z);
      } else {
        // First person camera - inside the tuk tuk
        const cameraOffset = new THREE.Vector3(0, 3, 1);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), tukTukRotation);
        const targetPosition = new THREE.Vector3().copy(tukTukPosition).add(cameraOffset);
        
        state.camera.position.copy(targetPosition);
        
        // Look forward in the direction of travel
        const lookDirection = new THREE.Vector3(0, 0, -10);
        lookDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), tukTukRotation);
        const lookTarget = tukTukPosition.clone().add(lookDirection);
        state.camera.lookAt(lookTarget.x, lookTarget.y + 1, lookTarget.z);
      }
    }
  });

  // Set game state in scene for components to access
  useFrame((state) => {
    state.scene.userData = { gameState };
  });

  return (
    <>
      <Sun />
      <Terrain />
      <SlumBuildings />
      <RuinsEnvironment />
      <TelephonePoles />
      <GasStations gameState={gameState} />
      <IndianPedestrians onScoreUpdate={(score) => setScore(score)} gameState={gameState} />
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <TukTuk gameState={gameState} />
          <GameUI />
        </>
      )}
      <PauseMenu 
        isVisible={gameState === 'paused'}
        onResume={onResume}
        onMainMenu={onMainMenu}
        onSettings={onSettings}
      />
    </>
  );
}