import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
import { useDeckStore } from '@/stores/deckStore';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { spacing } from '@/theme';
import { RootStackParamList } from '@/types';

type RouteProps = RouteProp<RootStackParamList, 'DeckEditor'>;

export const DeckEditorScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { deckId } = route.params;

  const { getDeck, createDeck, updateDeck, deleteDeck } = useDeckStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const isEditing = !!deckId;
  const existingDeck = deckId ? getDeck(deckId) : undefined;

  useEffect(() => {
    if (existingDeck) {
      setTitle(existingDeck.title);
      setDescription(existingDeck.description || '');
    }
  }, [existingDeck]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditing && deckId) {
        await updateDeck(deckId, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createDeck(title.trim(), description.trim() || undefined);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save deck:', error);
    }
  };

  const handleDelete = async () => {
    if (!deckId) return;

    try {
      await deleteDeck(deckId);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Failed to delete deck:', error);
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
          {isEditing ? 'Edit Deck' : 'New Deck'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter deck title"
          error={errors.title}
        />

        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholder="Enter deck description"
          style={styles.textArea}
        />

        {isEditing && (
          <Button
            title="Delete Deck"
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
