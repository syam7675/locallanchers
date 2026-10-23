export const motionTokens = {
  ease: { enter: [0.16, 1, 0.3, 1], standard: [0.22, 1, 0.36, 1] },
  blur: { soft: 3, subtle: 1 },
  duration: { fast: 0.16 },
  spring: {
    morph: { type: "spring" as const, stiffness: 420, damping: 38 },
    snappy: { type: "spring" as const, stiffness: 500, damping: 40 },
  },
};
