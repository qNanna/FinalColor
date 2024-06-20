import './dropdown.css';
import React, { useState } from 'react';
import { Dropdown } from 'rsuite';

export type ConvertType = '0-255' | '0-1' | 'HEX' | 'HEXA';

interface DropDownProps {
  onConvertType: (color: ConvertType) => void;
}

export const DropdownComponent: React.FC<DropDownProps> = ({ onConvertType }) => {
  const [type, setType] = useState('HEX');

  const handleSelect = (type: ConvertType) => {
    setType(type);
    onConvertType(type);
  };

  return (
    <Dropdown className='dropdown' title={type} onSelect={handleSelect}>
      <Dropdown.Item className='dropdown-item' eventKey="0-255">0-255</Dropdown.Item>
      <Dropdown.Item className='dropdown-item' eventKey="0-1">0-1</Dropdown.Item>
      <Dropdown.Item className='dropdown-item' eventKey="HEX">HEX</Dropdown.Item>
      <Dropdown.Item className='dropdown-item' eventKey="HEXA">HEX +α%</Dropdown.Item>
    </Dropdown>
  );
};
