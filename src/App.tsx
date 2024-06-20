import './index.css'
import { ReactElement, useEffect, useState } from 'react';
// import { DragDropContext, Droppable, Draggable  } from 'react-beautiful-dnd';
import { ConvertType, DropdownComponent } from './components/dropdown/dropdown';
import { ColorLayerComponent } from './components/color-layer/color-layer';
import { rgbaConvert, rgbaToHexConvert, RGBA } from './shared/color-format';
import checkboard from './assets/checkboard.png';

function App() {
  const [layerList, setLayerList] = useState<ReactElement[]>([]);
  const [colorsList, setColorsList] = useState<number[][]>([]);

  const [result, setResult] = useState<number[]>([]);
  const [rgbaString, setRGBAString] = useState('');
  const [outputColor, setOutputColor] = useState('None');

  const addLayer = () => {
    setLayerList(layerList.concat(
      <ColorLayerComponent 
        key={layerList.length-1}
        onColorPick={handleValueChange} 
        onDelete={handleOnDeleteLayer} 
      />
    )) 
  }
  
  const handleValueChange = ({ r, g, b, a }: RGBA) => {
    setColorsList(colorsList.concat([[r, g, b, a ?? 1]]))
  }

  const handleOnDeleteLayer = (layerKey: string) => {
    const newLayerList = layerList.filter(el => el.key !== layerKey);
    setLayerList(newLayerList);

    const newColorsList = colorsList.filter((_, index) => index.toString() !== layerKey);
    setColorsList(newColorsList);
  }

  const handleConvertType = (type: ConvertType) => {
    if (!result.length) return setOutputColor('None. Add layers before!');

    let formattedColor = '';
    const [r, g, b, a] = result;
    const rgba = { r, g, b, a };

    if (type === 'HEXA') formattedColor = rgbaToHexConvert(rgba, true)
    if (type === 'HEX') formattedColor = rgbaToHexConvert(rgba, false)
    if (type === '0-255') formattedColor = rgbaConvert(rgba, false)
    if (type === '0-1') formattedColor = rgbaConvert(rgba, true)

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
    if (colorsList.length < 2) return;

    for (let i = 0; i < colorsList.length; i++) {
      if (!colorsList[i+1]) break;

      const [r, g, b, a] = alphaBlend(colorsList[i], colorsList[i+1], colorsList[i][3])

      setResult([r, g, b, a])
      setRGBAString(`rgba(${r}, ${g}, ${b}, ${a})`)
    }
  }, [colorsList])

  return (
    <div className='main-container'>
      <div className='center'>
        <div className='center-box'>
        <div
          className='color-box'
          style={{
            backgroundImage: `linear-gradient(45deg, ${rgbaString}, ${rgbaString}), url(${checkboard})`,
            backgroundPosition: 'left center'
          }}></div>
          <span className='label'>Final color</span>
          <div className='output-box'>
            <div className='copybox'>
              <img src='src/assets/copy-icon.svg' />
            </div>
            <span className='output-text uppercase'>{outputColor}</span>
            <DropdownComponent onConvertType={handleConvertType}/>
          </div>
        </div>
      </div>
      <div className='sidebar'>
        <div className='titlebar'>
          <img src='src/assets/title-image.svg' />
        </div>
        <div className='sidebar-container'>
          <div className='layer-container'>
            {layerList}
          </div>
          <div className='sidebar-add-layer-button' onClick={addLayer}>
            <img src='src/assets/plus-icon.svg' />
            Add color
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
