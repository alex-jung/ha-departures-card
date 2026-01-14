export interface AnimatePreset {
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
}

export const animatePresets: Record<string, AnimatePreset> = {
  flash: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }],
    options: { duration: 3000, iterations: Infinity },
  },

  shakeX: {
    keyframes: [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(-5px, 0, 0)" },
      { transform: "translate3d(5px, 0, 0)" },
      { transform: "translate3d(-5px, 0, 0)" },
      { transform: "translate3d(5px, 0, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ],
    options: { duration: 800, iterations: Infinity },
  },

  shakeY: {
    keyframes: [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, -5px, 0)" },
      { transform: "translate3d(0, 5px, 0)" },
      { transform: "translate3d(0, -5px, 0)" },
      { transform: "translate3d(0, 5px, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ],
    options: { duration: 800, iterations: Infinity },
  },

  fadeIn: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 2000, iterations: Infinity },
  },

  fadeOut: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 2000, iterations: Infinity },
  },

  zoomIn: {
    keyframes: [
      { opacity: 0, transform: "scale3d(0.3, 0.3, 0.3)" },
      { opacity: 1, transform: "scale3d(1, 1, 1)" },
    ],
    options: { duration: 2000, iterations: Infinity },
  },

  zoomOut: {
    keyframes: [
      { opacity: 1, transform: "scale3d(1, 1, 1)" },
      { opacity: 0, transform: "scale3d(0.3, 0.3, 0.3)" },
    ],
    options: { duration: 2000, iterations: Infinity },
  },

  flipInX: {
    keyframes: [
      {
        transform: "perspective(400px) rotateX(90deg)",
        opacity: 0,
      },
      {
        transform: "perspective(400px) rotateX(-20deg)",
      },
      {
        transform: "perspective(400px) rotateX(10deg)",
        opacity: 1,
      },
      {
        transform: "perspective(400px) rotateX(0deg)",
      },
    ],
    options: {
      duration: 1500,
      easing: "ease-in",
      iterations: Infinity,
    },
  },

  flipOutX: {
    keyframes: [
      {
        transform: "perspective(400px) rotateX(0deg)",
        opacity: 1,
      },
      {
        transform: "perspective(400px) rotateX(-20deg)",
        opacity: 1,
      },
      {
        transform: "perspective(400px) rotateX(90deg)",
        opacity: 0,
      },
      {
        transform: "perspective(400px) rotateX(-20deg)",
        opacity: 1,
      },
      {
        transform: "perspective(400px) rotateX(0deg)",
        opacity: 1,
      },
    ],
    options: {
      duration: 1500,
      easing: "ease-in",
      iterations: Infinity,
    },
  },

  bounce: {
    keyframes: [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, -10px, 0)" },
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, -2px, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ],
    options: { duration: 1000, easing: "cubic-bezier(.28,.84,.42,1)", iterations: Infinity },
  },
};
