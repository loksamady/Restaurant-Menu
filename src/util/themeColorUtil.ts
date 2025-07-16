export function getLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;

  const [rL, gL, bL] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );

  const luminance = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  return luminance;
}

export function isDarkColor(hex: string): boolean {
  const luminance = getLuminance(hex);
  return luminance < 0.5; // threshold can be adjusted
}

export function getTextColor(bgColor: string) {
  return bgColor && isDarkColor(bgColor) ? "white" : "#1f2937"; // gray-800
}
