import React from 'react';
import './Button.css';

interface ButtonProps {
  /**
   * Legt fest, ob dies die primäre AUI-Aktion auf der Seite ist.
   */
  primary?: boolean;
  /**
   * Der Text, der im Button angezeigt wird.
   */
  label: string;
  /**
   * Optionale Klick-Funktion.
   */
  onClick?: () => void;
}

/**
 * Die primäre UI-Komponente zur Benutzerinteraktion.
 */
export const Button = ({
  primary = false,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'button--primary' : 'button--secondary';
  return (
    <button
      type="button"
      className={['button', mode].join(' ')}
      {...props}
    >
      {label}
    </button>
  );
};