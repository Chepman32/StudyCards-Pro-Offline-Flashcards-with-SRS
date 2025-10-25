import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { ReviewRating } from '@/types';
import { spacing } from '@/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ReviewButtonProps {
  rating: ReviewRating;
  interval: string;
  onPress: () => void;
}

const RATING_CONFIG = {
  again: {
    label: 'Again',
    color: '#FF3B30',
    shortcut: '1',
  },
  hard: {
    label: 'Hard',
    color: '#FF9500',
    shortcut: '2',
  },
  good: {
    label: 'Good',
    color: '#34C759',
    shortcut: '3',
  },
  easy: {
    label: 'Easy',
    color: '#007AFF',
    shortcut: '4',
  },
};

export const ReviewButton: React.FC<ReviewButtonProps> = ({
  rating,
  interval,
  onPress,
}) => {
  const theme = useTheme();
  const { onPressIn, onPressOut, animatedStyle } = useAnimatedPress();
  const config = RATING_CONFIG[rating];

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        { backgroundColor: config.color },
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${config.label}, ${interval}`}
    >
      <Text style={[styles.label, theme.typography.headline]}>
        {config.label}
      </Text>
      <Text style={[styles.interval, theme.typography.caption1]}>
        {interval}
      </Text>
      <View style={styles.shortcut}>
        <Text style={[styles.shortcutText, theme.typography.caption2]}>
          {config.shortcut}
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    marginHorizontal: spacing.xxs,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  interval: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  shortcut: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
