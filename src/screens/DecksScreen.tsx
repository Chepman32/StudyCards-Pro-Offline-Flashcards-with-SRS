import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { useDeckStore } from '@/stores/deckStore';
import { DeckCard } from '@/components/DeckCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/theme';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DecksScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { decks, fetchDecks } = useDeckStore();

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleDeckPress = (deckId: string) => {
    navigation.navigate('DeckDetail', { deckId });
  };

  const handleCreateDeck = () => {
    navigation.navigate('DeckEditor', {});
  };

  const handleStartReview = (deckId: string) => {
    navigation.navigate('Review', { deckId });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Button
          title="New Deck"
          onPress={handleCreateDeck}
          variant="primary"
          size="medium"
        />
      </View>

      {decks.length === 0 ? (
        <EmptyState
          title="No Decks Yet"
          message="Create your first deck to start learning with spaced repetition"
          actionLabel="Create Deck"
          onAction={handleCreateDeck}
        />
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DeckCard
              deck={item}
              onPress={() => handleDeckPress(item.id)}
              onLongPress={() => handleStartReview(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
