import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useAudio } from "../lib/stores/useAudio";
import { useTukTukGame } from "../lib/stores/useTukTukGame";
import { Controls } from "../App";

export default function SoundManager() {
  const { setBackgroundMusic, toggleMute, isMuted } = useAudio();
  const { tukTukPosition } = useTukTukGame();
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const lastPositionRef = useRef(tukTukPosition.clone());
  const currentSpeedRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineNodesRef = useRef<any>(null);

  useEffect(() => {
    // Load and setup background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    setBackgroundMusic(bgMusic);

    // Create audio context for engine sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    
    // Create engine sound effect programmatically
    const createEngineSound = () => {
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator1.frequency.value = 80;
      oscillator2.frequency.value = 160;
      oscillator1.type = 'sawtooth';
      oscillator2.type = 'square';
      
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 400;
      filterNode.Q.value = 1;
      
      oscillator1.connect(filterNode);
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0.6;
      
      return { oscillator1, oscillator2, gainNode, filterNode };
    };

    const handleFirstInteraction = () => {
      if (isMuted) {
        toggleMute();
      }
      bgMusic.play().catch(console.log);
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      engineNodesRef.current = createEngineSound();
      engineNodesRef.current.oscillator1.start();
      engineNodesRef.current.oscillator2.start();
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      bgMusic.pause();
      if (engineNodesRef.current) {
        try {
          engineNodesRef.current.oscillator1.stop();
          engineNodesRef.current.oscillator2.stop();
        } catch (e) {
          // Oscillators already stopped
        }
      }
    };
  }, [setBackgroundMusic, toggleMute, isMuted]);

  // Update engine sound based on speed and acceleration
  useFrame((state, delta) => {
    const distance = tukTukPosition.distanceTo(lastPositionRef.current);
    currentSpeedRef.current = distance / delta;
    lastPositionRef.current.copy(tukTukPosition);
    
    const keys = getKeys();
    const isAccelerating = keys.forward || keys.backward;
    
    // Update engine sound frequency based on speed
    if (engineNodesRef.current && audioContextRef.current) {
      const speedFactor = Math.min(currentSpeedRef.current / 20, 2);
      const baseFreq1 = 80 + (speedFactor * 40);
      const baseFreq2 = 160 + (speedFactor * 80);
      
      engineNodesRef.current.oscillator1.frequency.setValueAtTime(
        baseFreq1, 
        audioContextRef.current.currentTime
      );
      engineNodesRef.current.oscillator2.frequency.setValueAtTime(
        baseFreq2, 
        audioContextRef.current.currentTime
      );
      
      if (isAccelerating) {
        engineNodesRef.current.gainNode.gain.setValueAtTime(
          0.8, 
          audioContextRef.current.currentTime
        );
      } else {
        engineNodesRef.current.gainNode.gain.setValueAtTime(
          0.4, 
          audioContextRef.current.currentTime
        );
      }
    }
  });

  useEffect(() => {
    console.log('Tuk tuk engine running');
  }, []);

  return null;
}