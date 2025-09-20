export const getRGBA = (value: number) => {
  const R = value > 0 ? 255 : 0;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return `rgba(${R}, ${G}, ${B}, ${Math.abs(value)})`;
};
