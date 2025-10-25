import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const { onPressIn, onPressOut, animatedStyle } = useAnimatedPress();

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    ...styles.base,
    ...styles[`${size}Container`],
    backgroundColor:
      variant === 'primary'
        ? theme.colors.primary
        : variant === 'secondary'
        ? theme.colors.secondary
        : 'transparent',
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: theme.colors.primary,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const titleStyle: TextStyle = {
    ...theme.typography.headline,
    ...styles[`${size}Text`],
    color:
      variant === 'primary' || variant === 'secondary'
        ? '#FFFFFF'
        : theme.colors.primary,
  };

  return (
    <AnimatedTouchable
      style={[containerStyle, animatedStyle, style]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={titleStyle.color} />
      ) : (
        <>
          {icon}
          <Text style={[titleStyle, textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: spacing.xs,
  },
  smallContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  mediumContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  largeContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
