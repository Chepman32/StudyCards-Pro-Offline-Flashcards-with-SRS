import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { spacing, shadows } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'md',
  padding = 'md',
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: theme.colors.surface,
    padding: spacing[padding],
    ...(elevation !== 'none' && shadows[elevation]),
  };

  return <View style={[containerStyle, style]}>{children}</View>;
};

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: Animated.SharedValue<number>;
  style?: ViewStyle;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  isFlipped,
  style,
}) => {
  const theme = useTheme();

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [0, 180]);
    const opacity = interpolate(isFlipped.value, [0, 0.5, 1], [1, 0, 0]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
      opacity,
      backfaceVisibility: 'hidden' as const,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(isFlipped.value, [0, 1], [180, 360]);
    const opacity = interpolate(isFlipped.value, [0, 0.5, 1], [0, 0, 1]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
      opacity,
      backfaceVisibility: 'hidden' as const,
    };
  });

  const containerStyle: ViewStyle = {
    ...styles.flipCard,
    backgroundColor: theme.colors.surface,
    ...shadows.lg,
  };

  return (
    <View style={[containerStyle, style]}>
      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        {front}
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
        {back}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  flipCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
