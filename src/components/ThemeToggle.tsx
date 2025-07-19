import { useTheme } from '../context/ThemeContext';

// KORREKTER PFAD: Nur ein "../" um von 'components' nach 'src' zu gelangen.
import sunIconUrl from '../assets/sun.svg';
import moonIconUrl from '../assets/moon.svg';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle} aria-label="Theme umschalten">
      <img
        src={theme === 'light' ? moonIconUrl : sunIconUrl}
        alt="Theme-Icon"
        style={iconStyle}
      />
    </button>
  );
}