import type { Point } from '../types';

export const getIntersection = (
  A: Point,
  B: Point,
  C: Point,
  D: Point
): { x: number; y: number; offset: number } | null => {
  const denominator = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);
  if (denominator === 0) {
    return null; // Lines are parallel
  }

  const t =
    ((C.x - A.x) * (D.y - C.y) - (C.y - A.y) * (D.x - C.x)) / denominator;
  const u =
    ((C.x - A.x) * (B.y - A.y) - (C.y - A.y) * (B.x - A.x)) / denominator;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: A.x + t * (B.x - A.x),
      y: A.y + t * (B.y - A.y),
      offset: u,
    };
  }

  return null;
};
