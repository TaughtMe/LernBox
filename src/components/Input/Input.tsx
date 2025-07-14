import React from 'react';
import './Input.css';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const combinedClassName = ['input', className].filter(Boolean).join(' ');
  
  return (
    <input className={combinedClassName} {...props} />
  );
};
