import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Canvas, Circle, Group, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const theme = useTheme();

  const progress = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animate logo appearance
    scale.value = withSpring(1, { stiffness: 100, damping: 10 });

    // Animate particles
    progress.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    // Fade out and finish
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }, 2000);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.primary },
        containerStyle,
      ]}
    >
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Canvas style={styles.canvas}>
          {/* Animated particles/circles for splash effect */}
          <Group>
            <Circle cx={width / 2} cy={height / 2} r={60} color="#FFFFFF" opacity={0.3} />
            <Circle cx={width / 2} cy={height / 2} r={40} color="#FFFFFF" opacity={0.6} />
            <Circle cx={width / 2} cy={height / 2} r={20} color="#FFFFFF" />
          </Group>
        </Canvas>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: width,
    height: height,
  },
});
