import './color-layer.css'
import React, { useState, useRef, useEffect, RefObject } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import { RGBA, rgbaToHexConvert } from '../../shared/color-format';

import checkBoard from  '../../assets/checkboard.png';
import removeIcon from '../../assets/remove-icon.svg';

interface ColorLayerProps {
  key: number;
  layerKey: number;
  onColorPick: (color: number[], layerKey: number) => void;
  onDelete: (layerKey: number) => void;
}

export const ColorLayerComponent: React.FC<ColorLayerProps> = ({ layerKey, onColorPick, onDelete }) => {
  const ref: RefObject<HTMLDivElement> = useRef(null);
  const [popupState, setPopupState] = useState({ open: false });
  const [color, setColor] = useState<RGBA>({ r: 255, g: 255, b: 255, a: 1 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopupState({ open: false });
        onColorPick(Object.values(color), layerKey);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [color, layerKey, onColorPick]);

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
    onColorPick(Object.values(color.rgb), layerKey);
  };

  const handleDelete = () => {
    onDelete(layerKey);
  }

  return (
    <div className='layer-wrapper'>
      <div className='color-layer' onClick={() => setPopupState({ open: !popupState.open })}>
        <div className='color-layer-preview' style={{
          backgroundImage: `linear-gradient(45deg, rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}), rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})), url(${checkBoard})`,
          backgroundPosition: 'left center',
          }}></div>
        <span className='output-text uppercase'>{rgbaToHexConvert(color, false)}</span>
        <div className='layer-remove-button' onClick={handleDelete}>
          <img src={removeIcon} />
        </div>
      </div>
      {popupState.open && (
        <div className='floating-picker' ref={ref}>
          <SketchPicker
            color={ color }
            onChange={ handleChange }
            // onChangeComplete={ handleChange }
          />
        </div>
      )}
    </div>
  )
}
