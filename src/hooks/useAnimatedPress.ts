import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { springConfigs, pressScale, timingConfigs } from '@/utils/animations';

export const useAnimatedPress = (scaleAmount: number = pressScale.default) => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(scaleAmount, springConfigs.snappy);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springConfigs.default);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    onPressIn,
    onPressOut,
    animatedStyle,
  };
};

export const useAnimatedOpacity = () => {
  const opacity = useSharedValue(1);

  const fadeIn = (callback?: () => void) => {
    opacity.value = withTiming(1, timingConfigs.default, (finished) => {
      if (finished && callback) {
        callback();
      }
    });
  };

  const fadeOut = (callback?: () => void) => {
    opacity.value = withTiming(0, timingConfigs.default, (finished) => {
      if (finished && callback) {
        callback();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    fadeIn,
    fadeOut,
    animatedStyle,
    opacity,
  };
};
