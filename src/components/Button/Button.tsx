import React from 'react'
import './Button.css'

interface ButtonProps {
  primary?: boolean
  label: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /**
   * NEU: Lässt den Button die volle Breite einnehmen.
   */
  fullWidth?: boolean
}

export const Button = ({
  primary = false,
  label,
  type = 'button',
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'button--primary' : 'button--secondary'
  const fullWidthClass = fullWidth ? 'button--full-width' : ''

  return (
    <button
      type={type}
      className={['button', mode, fullWidthClass].filter(Boolean).join(' ')}
      {...props}
    >
      {label}
    </button>
  )
}
