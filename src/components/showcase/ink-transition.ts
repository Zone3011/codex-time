// Smooth, matching SVG paths let the browser interpolate an organic ink front.
export function inkFrames(
  x: number,
  y: number,
  width: number,
  height: number,
): Keyframe[] {
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  const number = (value: number) => value.toFixed(2);
  const contour = (points: number[][]) => {
    let path = `M${points[0].map(number).join(" ")}`;
    for (let i = 0; i < points.length; i++) {
      const a = points[(i - 1 + points.length) % points.length];
      const b = points[i];
      const c = points[(i + 1) % points.length];
      const d = points[(i + 2) % points.length];
      path += `C${[b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6, c[0], c[1]].map(number).join(" ")}`;
    }
    return path + "Z";
  };
  return Array.from({ length: 17 }, (_, frame) => {
    const progress = frame / 16;
    const spread = radius * Math.pow(progress, 1.05) * 1.45;
    const points = Array.from({ length: 144 }, (_, i) => {
      const angle = (i / 144) * Math.PI * 2;
      const wave =
        1 +
        0.1 * Math.sin(angle * 5 + progress * 2) +
        0.055 * Math.cos(angle * 11 - progress * 2.5) +
        0.035 * Math.sin(angle * 19 + progress) +
        0.015 * Math.cos(angle * 31);
      return [
        x + Math.cos(angle) * spread * wave,
        y + Math.sin(angle) * spread * wave,
      ];
    });
    let path = contour(points);
    // Small satellite drops appear in front of the moving edge, then merge into it.
    for (let drop = 0; drop < 5; drop++) {
      const angle = -2.95 + drop * 0.4;
      const distance = spread * (1.08 + 0.08 * Math.sin(drop * 7));
      const size = Math.pow(Math.sin(progress * Math.PI), 2) * (8 + drop * 2);
      const cx = x + Math.cos(angle) * distance;
      const cy = y + Math.sin(angle) * distance;
      path += contour(
        Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return [
            cx + Math.cos(a) * size,
            cy + Math.sin(a) * size * (1.15 + drop * 0.05),
          ];
        }),
      );
    }
    return { clipPath: `path('${path}')`, offset: progress };
  });
}
