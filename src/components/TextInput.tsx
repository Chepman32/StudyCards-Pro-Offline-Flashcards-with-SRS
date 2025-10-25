import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  style,
  ...props
}) => {
  const theme = useTheme();

  const inputStyle = {
    ...styles.input,
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: error ? theme.colors.error : theme.colors.border,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            theme.typography.subheadline,
            { color: theme.colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      )}
      <RNTextInput
        style={[inputStyle, style]}
        placeholderTextColor={theme.colors.textTertiary}
        {...props}
      />
      {error && (
        <Text
          style={[
            styles.helperText,
            theme.typography.caption1,
            { color: theme.colors.error },
          ]}
        >
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text
          style={[
            styles.helperText,
            theme.typography.caption1,
            { color: theme.colors.textTertiary },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
  },
  helperText: {
    marginTop: spacing.xxs,
    marginLeft: spacing.xs,
  },
});
