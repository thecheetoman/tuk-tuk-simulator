

interface PauseMenuProps {
  isVisible: boolean;
  onResume: () => void;
  onMainMenu: () => void;
  onSettings: () => void;
}

export default function PauseMenu({ isVisible, onResume, onMainMenu, onSettings }: PauseMenuProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50000,
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)'
      }}
    >
      {/* Pause menu - centered directly */}
      <div style={{
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        padding: '40px',
        borderRadius: '15px',
        border: '3px solid #ff6600',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        minWidth: '300px',
        maxWidth: '400px'
      }}>
        <h1 style={{
          color: '#ff6600',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 0 30px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          GAME PAUSED
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button
            onClick={onResume}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#ff6600',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#ff8833'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#ff6600'}
          >
            Resume Game (P)
          </button>
          
          <button
            onClick={onSettings}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid #666',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              (e.target as HTMLButtonElement).style.borderColor = '#999';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              (e.target as HTMLButtonElement).style.borderColor = '#666';
            }}
          >
            Settings
          </button>
          
          <button
            onClick={onMainMenu}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid #666',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              (e.target as HTMLButtonElement).style.borderColor = '#999';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              (e.target as HTMLButtonElement).style.borderColor = '#666';
            }}
          >
            Main Menu
          </button>
        </div>
        
        <p style={{
          color: '#ccc',
          fontSize: '14px',
          margin: '20px 0 0 0',
          fontStyle: 'italic'
        }}>
          Press P to resume
        </p>
      </div>
    </div>
  );
}