import React from 'react';

interface IconToggleProps {
  onClick: () => void;
  disabled?: boolean;
  isActive: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}

export const IconToggle: React.FC<IconToggleProps> = ({
  onClick,
  disabled = false,
  isActive,
  children,
  ariaLabel,
}) => {
  // Base classes for all buttons
  const baseClasses =
    'w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500';

  // Classes for the active state
  const activeClasses = 'bg-indigo-600 text-white';

  // Classes for the inactive state
  const inactiveClasses =
    'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70';

  // Combine classes based on the active state
  const combinedClasses = `${baseClasses} ${
    isActive ? activeClasses : inactiveClasses
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};