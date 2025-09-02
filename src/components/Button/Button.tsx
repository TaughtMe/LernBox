import React from 'react'
import './Button.css'

// HIER DAS WORT "export" HINZUFÜGEN
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'text'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  isIconOnly?: boolean
  'aria-label': string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  type = 'button',
  fullWidth = false,
  isIconOnly = false,
  ...props
}) => {
  const modeClass = `button--${variant}`
  const fullWidthClass = fullWidth ? 'button--full-width' : ''
  const iconOnlyClass = isIconOnly ? 'button--icon-only' : ''

  return (
    <button
      type={type}
      className={['button', modeClass, fullWidthClass, iconOnlyClass]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
