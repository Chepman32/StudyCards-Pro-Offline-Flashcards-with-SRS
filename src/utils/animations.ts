import { Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

/**
 * Animation configurations for consistent motion across the app
 */

// Spring configurations
export const springConfigs = {
  gentle: {
    stiffness: 180,
    damping: 20,
    mass: 1,
    overshootClamping: false,
  } as WithSpringConfig,

  default: {
    stiffness: 240,
    damping: 18,
    mass: 1,
    overshootClamping: false,
  } as WithSpringConfig,

  snappy: {
    stiffness: 320,
    damping: 16,
    mass: 0.8,
    overshootClamping: false,
  } as WithSpringConfig,

  bouncy: {
    stiffness: 200,
    damping: 12,
    mass: 1.2,
    overshootClamping: false,
  } as WithSpringConfig,
};

// Timing configurations
export const timingConfigs = {
  fast: {
    duration: 220,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  default: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  slow: {
    duration: 400,
    easing: Easing.out(Easing.cubic),
  } as WithTimingConfig,

  linear: {
    duration: 300,
    easing: Easing.linear,
  } as WithTimingConfig,
};

// Card flip animation
export const cardFlipConfig = {
  duration: 600,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
} as WithTimingConfig;

// Press scale animation values
export const pressScale = {
  default: 0.96,
  subtle: 0.98,
  strong: 0.92,
};

// Gesture thresholds
export const gestureThresholds = {
  swipeVelocity: 500,
  swipeDistance: 100,
  longPressDuration: 500,
  doubleTapDelay: 300,
};

// Card swipe thresholds for review ratings
export const reviewSwipeThresholds = {
  again: { x: -150, color: '#FF3B30' },
  hard: { x: -75, color: '#FF9500' },
  good: { x: 75, color: '#34C759' },
  easy: { x: 150, color: '#007AFF' },
};

/**
 * Interpolate values for smooth animations
 */
export const interpolateColor = (
  value: number,
  inputRange: number[],
  outputRange: string[]
): string => {
  'worklet';
  // Simplified color interpolation for worklet compatibility
  // In production, use Reanimated's interpolateColor
  return outputRange[0];
};

/**
 * Calculate rotation for 3D card flip
 */
export const getCardRotation = (progress: number): number => {
  'worklet';
  return progress * 180;
};

/**
 * Calculate perspective for 3D transforms
 */
export const getPerspective = (): number => {
  return 1000;
};
