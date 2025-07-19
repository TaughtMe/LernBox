import React from 'react';
import './Card.css';

// Die Props werden flexibler: title/description sind optional, children sind auch erlaubt.
export interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="card">
      {/* Titel und Beschreibung nur rendern, wenn sie übergeben wurden */}
      {title && <h3 className="card-title">{title}</h3>}
      {description && <p className="card-description">{description}</p>}
      
      {/* Children wie gewohnt rendern */}
      {children}
    </div>
  );
};