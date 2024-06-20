import './color-layer.css'
import React, { useState, useRef, useEffect, RefObject } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import { RGBA, rgbaToHexConvert } from '../../shared/color-format';
import checkboard from '../../assets/checkboard.png';

interface ColorLayerProps {
  key: number;
  onColorPick: (color: RGBA) => void;
  onDelete: (layerKey: string) => void;
}

export const ColorLayerComponent: React.FC<ColorLayerProps> = ({ key, onColorPick, onDelete }) => {
  const ref: RefObject<HTMLDivElement> = useRef(null);
  const [popupState, setPopupState] = useState({ open: false });
  const [color, setColor] = useState<RGBA>({ r: 255, g: 255, b: 255, a: 1 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopupState({ open: false });
        onColorPick(color);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onColorPick, color]);

  const handleChangeComplete = (color: ColorResult) => {
    setColor(color.rgb);
  };

  const handleDelete = () => {
    onDelete(String(key));
  }

  return (
    <div className='layer-wrapper'>
      <div className='color-layer' onClick={() => setPopupState({ open: !popupState.open })}>
        <div className='color-layer-preview' style={{
          backgroundImage: `linear-gradient(45deg, rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}), rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})), url(${checkboard})`,
          backgroundPosition: 'left center',
          }}></div>
        <span className='output-text uppercase'>{rgbaToHexConvert(color, false)}</span>
        <div className='layer-remove-button' onClick={() => handleDelete()}>
          <img src='src/assets/remove-icon.svg' />
        </div>
      </div>
      {popupState.open && (
        <div className='floating-picker' ref={ref}>
          <SketchPicker
            color={ color }
            onChange={ handleChangeComplete }
            onChangeComplete={ handleChangeComplete }
          />
        </div>
      )}
    </div>
  )
}
