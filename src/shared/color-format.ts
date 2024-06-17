export type RGBA = { r: number; g: number; b: number; a?: number };

export const rgbaConvert = (rgba: RGBA, short: boolean) => {
  if (!short) return `rgba(${Object.values(rgba).map(el => el.toFixed(2))})`;

  const shortRGBA = Object.values(rgba).map(el => (el / 255).toFixed(2));

  return `rgba(${shortRGBA})`;
}

export const rgbaToHexConvert = (rgba: RGBA, alpha: boolean) => {
  const { r, g, b, a } = rgba
  
  let alphaHex = Math.round(a! * 255).toString(16);
  if (alphaHex.length === 1) alphaHex = '0' + alphaHex;

  const mathRound = (value: number) => ('0' + Math.round(value).toString(16)).slice(-2)
  const hex = '#' + mathRound(r) + mathRound(g) + mathRound(b);

  return alpha ? hex + ` ${(a! * 100).toFixed(0)}%` : hex + alphaHex;
}