export const getIntersection = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
  D: { x: number; y: number }
): { x: number; y: number; offset: number } | null => {
  const denominator = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);
  if (denominator === 0) {
    return null; // Lines are parallel
  }

  const t =
    ((C.x - A.x) * (D.y - C.y) - (C.y - A.y) * (D.x - C.x)) / denominator;
  const u =
    ((C.x - A.x) * (B.y - A.y) - (C.y - A.y) * (B.x - A.x)) / denominator;

  if (t >= 0 && t <= 1 && u >= 0) {
    return {
      x: A.x + t * (B.x - A.x),
      y: A.y + t * (B.y - A.y),
      offset: u,
    };
  }

  return null;
};
