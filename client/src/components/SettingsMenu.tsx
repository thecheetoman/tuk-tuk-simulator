import { useState } from "react";
import { useAudio } from "../lib/stores/useAudio";

interface SettingsMenuProps {
  isVisible: boolean;
  onBack: () => void;
}

export default function SettingsMenu({ isVisible, onBack }: SettingsMenuProps) {
  const { isMuted, toggleMute } = useAudio();
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [graphics, setGraphics] = useState('high');

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        pointerEvents: 'all'
      }}
    >
      <div style={{
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        border: '3px solid #ff6600',
        borderRadius: '15px',
        padding: '40px',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(10px)',
        width: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h1 style={{
          fontSize: '36px',
          margin: '0 0 30px 0',
          color: '#ff6600',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          Settings
        </h1>

        {/* Audio Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#ff6600', marginBottom: '15px' }}>Audio Settings</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Master Volume</label>
            <button
              onClick={toggleMute}
              style={{
                padding: '8px 16px',
                backgroundColor: isMuted ? '#666' : '#ff6600',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isMuted ? 'Unmuted' : 'Muted'}
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Music Volume: {Math.round(musicVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: '#333',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Sound Effects: {Math.round(sfxVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: '#333',
                outline: 'none',
                appearance: 'none'
              }}
            />
          </div>
        </div>

        {/* Graphics Settings */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#ff6600', marginBottom: '15px' }}>Graphics Settings</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Quality</label>
            <select
              value={graphics}
              onChange={(e) => setGraphics(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #666',
                borderRadius: '5px'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
        </div>

        {/* Controls Info */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#ff6600', marginBottom: '15px' }}>Controls</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#ccc' }}>
            <div>W/↑ - Accelerate</div>
            <div>S/↓ - Reverse</div>
            <div>A/← - Turn Left</div>
            <div>D/→ - Turn Right</div>
            <div>SPACE - Handbrake</div>
            <div>C - Switch Camera (First/Third Person)</div>
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            backgroundColor: '#ff6600',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
}