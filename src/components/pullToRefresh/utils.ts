export const springConfig = (velocity: number) => {
  'worklet';

  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  };
};

export function clamp(value: number, lowerbound: number, upperbound: number) {
  'worklet';

  return Math.min(Math.max(value, lowerbound), upperbound);
}

/**
 * calculates rubber value
 *
 * @param x distance from the edge
 * @param dim dimension, either width or height
 * @param coeff constant value, UIScrollView uses 0.55
 * @returns rubber = (1.0 – (1.0 / ((x * coeff / dim) + 1.0))) * dim
 */
export const rubberBandClamp = (x: number, dim: number, coeff: number) => {
  'worklet';

  return (1.0 - 1.0 / ((x * coeff) / dim + 1.0)) * dim;
};

export const rubberClamp = (
  y: number,
  topBound: number,
  bottomBound: number,
  coeff = 0.55
) => {
  'worklet';

  const clampedY = clamp(y, topBound, bottomBound);
  const diff = Math.abs(y - clampedY);
  const sign = clampedY > y ? -1 : 1;
  const dimension = bottomBound - topBound;

  return clampedY + sign * rubberBandClamp(diff, dimension, coeff);
};
