import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { useDeckStore } from '@/stores/deckStore';
import { useCardStore } from '@/stores/cardStore';
import { Card, ReviewRating, RootStackParamList } from '@/types';
import { getDueCards, getNewCards, getIntervalDisplay, calculateNextReview } from '@/utils/srs';
import { ReviewButton } from '@/components/ReviewButton';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/theme';
import { cardFlipConfig } from '@/utils/animations';

const { width } = Dimensions.get('window');

type RouteProps = RouteProp<RootStackParamList, 'Review'>;

export const ReviewScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { deckId } = route.params;

  const { getDeck } = useDeckStore();
  const { cards, fetchCards, reviewCard } = useCardStore();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<Card[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  const flipProgress = useSharedValue(0);
  const swipeX = useSharedValue(0);

  const deck = getDeck(deckId);
  const currentCard = reviewQueue[currentCardIndex];

  useEffect(() => {
    fetchCards(deckId).then(() => {
      const dueCards = getDueCards(cards);
      const newCards = getNewCards(cards, deck?.settings.newCardsPerDay || 20);
      setReviewQueue([...dueCards, ...newCards]);
    });
  }, [deckId]);

  const handleFlip = () => {
    flipProgress.value = withTiming(isFlipped ? 0 : 1, cardFlipConfig);
    setIsFlipped(!isFlipped);
  };

  const handleReview = async (rating: ReviewRating) => {
    if (!currentCard || !deck) return;

    const timeTaken = Date.now() - startTime;
    await reviewCard(currentCard, rating, timeTaken);

    // Move to next card
    if (currentCardIndex < reviewQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      flipProgress.value = 0;
      swipeX.value = 0;
      setStartTime(Date.now());
    } else {
      // Review session completed
      navigation.goBack();
    }
  };

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleFlip)();
  });

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      swipeX.value = event.translationX;
    })
    .onEnd((event) => {
      if (!isFlipped) return;

      if (event.translationX < -150) {
        runOnJS(handleReview)('again');
      } else if (event.translationX < -75) {
        runOnJS(handleReview)('hard');
      } else if (event.translationX > 150) {
        runOnJS(handleReview)('easy');
      } else if (event.translationX > 75) {
        runOnJS(handleReview)('good');
      }

      swipeX.value = withTiming(0);
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    const translateX = swipeX.value;
    const rotate = interpolate(swipeX.value, [-width, width], [-20, 20]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { translateX },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const frontOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(flipProgress.value, [0, 0.5], [1, 0]),
  }));

  const backOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(flipProgress.value, [0.5, 1], [0, 1]),
  }));

  if (!deck) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState title="Deck Not Found" message="Unable to load deck" />
      </SafeAreaView>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="No Cards to Review"
          message="All caught up! Come back later for more reviews."
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return null;
  }

  // Calculate intervals for review buttons
  const reviewIntervals = {
    again: '< 1min',
    hard: getIntervalDisplay(
      calculateNextReview(currentCard, 'hard', deck.settings).interval
    ),
    good: getIntervalDisplay(
      calculateNextReview(currentCard, 'good', deck.settings).interval
    ),
    easy: getIntervalDisplay(
      calculateNextReview(currentCard, 'easy', deck.settings).interval
    ),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[theme.typography.body, { color: theme.colors.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={[theme.typography.headline, { color: theme.colors.text }]}>
          {currentCardIndex + 1} / {reviewQueue.length}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={Gesture.Exclusive(tapGesture, panGesture)}>
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface },
              cardAnimatedStyle,
            ]}
          >
            <Animated.View style={[styles.cardContent, frontOpacity]}>
              <Text style={[theme.typography.title1, { color: theme.colors.text }]}>
                {currentCard.front}
              </Text>
            </Animated.View>

            <Animated.View style={[styles.cardContent, styles.cardBack, backOpacity]}>
              <Text style={[theme.typography.title1, { color: theme.colors.text }]}>
                {currentCard.back}
              </Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        <Text
          style={[
            theme.typography.caption1,
            { color: theme.colors.textTertiary, textAlign: 'center', marginTop: spacing.md },
          ]}
        >
          {isFlipped ? 'Swipe or tap buttons to rate' : 'Tap to reveal answer'}
        </Text>
      </View>

      {isFlipped && (
        <View style={styles.buttonContainer}>
          <ReviewButton
            rating="again"
            interval={reviewIntervals.again}
            onPress={() => handleReview('again')}
          />
          <ReviewButton
            rating="hard"
            interval={reviewIntervals.hard}
            onPress={() => handleReview('hard')}
          />
          <ReviewButton
            rating="good"
            interval={reviewIntervals.good}
            onPress={() => handleReview('good')}
          />
          <ReviewButton
            rating="easy"
            interval={reviewIntervals.easy}
            onPress={() => handleReview('easy')}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 24,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  cardContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardBack: {
    backfaceVisibility: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
});
