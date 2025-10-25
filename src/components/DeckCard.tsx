import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { Deck } from '@/types';
import { spacing, shadows } from '@/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
  onLongPress?: () => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();
  const { onPressIn, onPressOut, animatedStyle } = useAnimatedPress();

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        {
          backgroundColor: deck.color || theme.colors.surface,
          ...shadows.md,
        },
        animatedStyle,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${deck.title} deck`}
      accessibilityHint={`${deck.dueCount} cards due, ${deck.newCount} new cards`}
    >
      <View style={styles.header}>
        <Text
          style={[
            theme.typography.title2,
            { color: theme.colors.text },
            styles.title,
          ]}
          numberOfLines={2}
        >
          {deck.title}
        </Text>
        {deck.description && (
          <Text
            style={[
              theme.typography.footnote,
              { color: theme.colors.textSecondary },
            ]}
            numberOfLines={2}
          >
            {deck.description}
          </Text>
        )}
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[theme.typography.title1, { color: theme.colors.text }]}>
            {deck.cardCount}
          </Text>
          <Text
            style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}
          >
            Total
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[theme.typography.title1, { color: theme.colors.primary }]}>
            {deck.dueCount}
          </Text>
          <Text
            style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}
          >
            Due
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[theme.typography.title1, { color: theme.colors.success }]}>
            {deck.newCount}
          </Text>
          <Text
            style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}
          >
            New
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xxs,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
});
