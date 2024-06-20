import './index.css'
import { ReactElement, useEffect, useState } from 'react';

import { ConvertType, DropdownComponent } from './components/dropdown/dropdown';
import { ColorLayerComponent } from './components/color-layer/color-layer';
import { rgbaConvert, rgbaToHexConvert } from './shared/color-format';

import checkBoard from './assets/checkboard.png';
import titleImage from './assets/title-image.svg';
import plusIcon from './assets/plus-icon.svg';
import copyIcon from './assets/copy-icon.svg';

function App() {
  const [layerList, setLayerList] = useState<{ element: ReactElement, layerKey: number, color: number[] }[]>([]);

  const [colorType, setColorType] = useState<ConvertType>('HEX');
  const [rgbaString, setRGBAString] = useState('');
  const [outputColor, setOutputColor] = useState('None');

  const addLayer = () => {
    const layerKey = Date.now();
    setLayerList(prevLayerList => [
      ...prevLayerList,
      {
        element: (
          <ColorLayerComponent 
            key={layerKey}
            layerKey={layerKey}
            onColorPick={handleValueChange} 
            onDelete={handleOnDeleteLayer} 
          />
        ),
        color: [255, 255, 255, 1],
        layerKey: layerKey
      }
    ]);
  }
  
  const handleValueChange = (rgba: number[], key: number) => {
    setLayerList(prevLayerList =>
      prevLayerList.map(layer => 
        layer.layerKey === key ? { ...layer, color: rgba } : layer
      )
    );
  }

  const handleOnDeleteLayer = (layerKey: number) => {
    setLayerList(prevLayerList => prevLayerList.filter(el => el.layerKey !== layerKey));
  }

  const handleConvertType = (type: ConvertType) => {
    setColorType(type);
  }

  const formatColor = (type: ConvertType, result: number[]) => {
    if (!result.length) return setOutputColor('None');

    let formattedColor = '';
    const [r, g, b, a] = result;
    const rgba = { r, g, b, a };

    if (type === 'HEXA') formattedColor = rgbaToHexConvert(rgba, true);
    if (type === 'HEX') formattedColor = rgbaToHexConvert(rgba, false);
    if (type === '0-255') formattedColor = rgbaConvert(rgba, false);
    if (type === '0-1') formattedColor = rgbaConvert(rgba, true);

    setOutputColor(formattedColor);
  }

  const alphaBlend = (srcColor: number[], dstColor: number[], alpha: number) => {
    const outColor = [];

    for (let i = 0; i < 3; i++) {
      outColor[i] = alpha * srcColor[i] + (1 - alpha) * dstColor[i];
    }

    outColor[3] = alpha + dstColor[3] * (1 - alpha);

    return outColor;
  }

  useEffect(() => { 
    if (layerList.length < 2) return;

    let output: number[] = [];

    for (let i = 0; i < layerList.length; i++) {
      if (!layerList[i+1]) break;

      output = alphaBlend(layerList[i+1].color, layerList[i].color, layerList[i+1].color[3])
    }

    const [r, g, b, a] = output;

    setRGBAString(`rgba(${r}, ${g}, ${b}, ${a})`)
    formatColor(colorType, output);
  }, [colorType, layerList]);

  return (
    <div className='main-container'>
      <div className='center'>
        <div className='center-box'>
        <div
          className='color-box'
          style={{
            backgroundImage: `linear-gradient(45deg, ${rgbaString}, ${rgbaString}), url(${checkBoard})`,
            backgroundPosition: 'left center'
          }}></div>
          <span className='label'>Final color</span>
          <div className='output-box'>
            <div className='copybox'>
              <img src={copyIcon} />
            </div>
            <span className='output-text uppercase'>{outputColor}</span>
            <DropdownComponent onConvertType={handleConvertType}/>
          </div>
        </div>
      </div>
      <div className='sidebar'>
        <div className='titlebar'>
          <img src={titleImage} />
        </div>
        <div className='sidebar-container'>
          <div className='layer-container'>
            {layerList.map(el => el.element)}
          </div>
          <div className='sidebar-add-layer-button' onClick={addLayer}>
            <img src={plusIcon} />
            Add color
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
