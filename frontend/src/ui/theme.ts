export const THEME = {
  base: '#FCFCFF',
  secondary: '#202931',
  accent: '#14D64D',
  line: 'rgba(32,41,49,0.10)',
  lineSoft: 'rgba(32,41,49,0.06)',
};

export const alpha = (hex: string, a = 0.12) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
