import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { useDeckStore } from '@/stores/deckStore';
import { useCardStore } from '@/stores/cardStore';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/theme';
import { RootStackParamList } from '@/types';

type RouteProps = RouteProp<RootStackParamList, 'DeckDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DeckDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { deckId } = route.params;

  const { getDeck } = useDeckStore();
  const { cards, fetchCards } = useCardStore();

  const deck = getDeck(deckId);

  useEffect(() => {
    fetchCards(deckId);
  }, [deckId]);

  const handleStartReview = () => {
    navigation.navigate('Review', { deckId });
  };

  const handleAddCard = () => {
    navigation.navigate('CardEditor', { deckId });
  };

  const handleEditCard = (cardId: string) => {
    navigation.navigate('CardEditor', { deckId, cardId });
  };

  if (!deck) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState title="Deck Not Found" message="Unable to load deck" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[theme.typography.body, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        <Text style={[theme.typography.headline, { color: theme.colors.text }]} numberOfLines={1}>
          {deck.title}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <Card style={styles.statsCard} elevation="md">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[theme.typography.title1, { color: theme.colors.text }]}>
              {deck.cardCount}
            </Text>
            <Text style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}>
              Total Cards
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[theme.typography.title1, { color: theme.colors.primary }]}>
              {deck.dueCount}
            </Text>
            <Text style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}>
              Due
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[theme.typography.title1, { color: theme.colors.success }]}>
              {deck.newCount}
            </Text>
            <Text style={[theme.typography.caption1, { color: theme.colors.textTertiary }]}>
              New
            </Text>
          </View>
        </View>
        <Button
          title="Start Review"
          onPress={handleStartReview}
          variant="primary"
          fullWidth
          disabled={deck.dueCount === 0 && deck.newCount === 0}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[theme.typography.title3, { color: theme.colors.text }]}>
            Cards
          </Text>
          <Button title="Add Card" onPress={handleAddCard} variant="primary" size="small" />
        </View>

        {cards.length === 0 ? (
          <EmptyState
            title="No Cards Yet"
            message="Add your first card to start learning"
            actionLabel="Add Card"
            onAction={handleAddCard}
          />
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEditCard(item.id)}>
                <Card style={styles.cardItem} elevation="sm">
                  <Text
                    style={[theme.typography.body, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {item.front}
                  </Text>
                  <Text
                    style={[
                      theme.typography.caption1,
                      { color: theme.colors.textTertiary, marginTop: spacing.xxs },
                    ]}
                    numberOfLines={1}
                  >
                    {item.back}
                  </Text>
                </Card>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
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
  statsCard: {
    margin: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  section: {
    flex: 1,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  cardItem: {
    padding: spacing.md,
  },
});
