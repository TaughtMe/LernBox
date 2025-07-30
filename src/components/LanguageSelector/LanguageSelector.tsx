// src/components/LanguageSelector/LanguageSelector.tsx

import React, { useState, useRef, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import './LanguageSelector.css';

type Option = {
  code: string;
  name: string;
};

type LanguageSelectorProps = {
  label: string;
  options: Option[];
  selectedOptionCode: string;
  onSelect: (code: string) => void;
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  label,
  options,
  selectedOptionCode,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.code === selectedOptionCode) || options[0];

  // Schließt das Dropdown, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (option: Option) => {
    onSelect(option.code);
    setIsOpen(false);
  };

  return (
    <div className="lang-selector-wrapper" ref={wrapperRef}>
      <label className="control-group-label">{label}</label>
      <button className="lang-selector-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption.name}</span>
        <MdArrowDropDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="lang-selector-dropdown">
          {options.map((option) => (
            <li
              key={option.code}
              className={`dropdown-item ${option.code === selectedOptionCode ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};