import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
import { useCardStore } from '@/stores/cardStore';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { spacing } from '@/theme';
import { RootStackParamList } from '@/types';

type RouteProps = RouteProp<RootStackParamList, 'CardEditor'>;

export const CardEditorScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { deckId, cardId } = route.params;

  const { getCard, createCard, updateCard, deleteCard } = useCardStore();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});

  const isEditing = !!cardId;
  const existingCard = cardId ? getCard(cardId) : undefined;

  useEffect(() => {
    if (existingCard) {
      setFront(existingCard.front);
      setBack(existingCard.back);
    }
  }, [existingCard]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!front.trim()) {
      newErrors.front = 'Front side is required';
    }

    if (!back.trim()) {
      newErrors.back = 'Back side is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditing && cardId) {
        await updateCard(cardId, { front: front.trim(), back: back.trim() });
      } else {
        await createCard(deckId, front.trim(), back.trim());
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save card:', error);
    }
  };

  const handleDelete = async () => {
    if (!cardId) return;

    try {
      await deleteCard(cardId);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
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
          {isEditing ? 'Edit Card' : 'New Card'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TextInput
          label="Front"
          value={front}
          onChangeText={setFront}
          multiline
          numberOfLines={4}
          placeholder="Enter the question or prompt"
          error={errors.front}
          style={styles.textArea}
        />

        <TextInput
          label="Back"
          value={back}
          onChangeText={setBack}
          multiline
          numberOfLines={4}
          placeholder="Enter the answer"
          error={errors.back}
          style={styles.textArea}
        />

        {isEditing && (
          <Button
            title="Delete Card"
            onPress={handleDelete}
            variant="ghost"
            style={{ marginTop: spacing.lg }}
            textStyle={{ color: theme.colors.error }}
          />
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
