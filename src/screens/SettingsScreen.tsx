import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settingsStore';
import { Card } from '@/components/Card';
import { spacing } from '@/theme';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    theme: appTheme,
    notificationsEnabled,
    soundEnabled,
    hapticEnabled,
    showTimer,
    isPro,
    updateSettings,
    toggleTheme,
  } = useSettingsStore();

  const SettingRow: React.FC<{
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }> = ({ label, value, onPress, rightElement }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[theme.typography.body, { color: theme.colors.text }]}>
        {label}
      </Text>
      {value && (
        <Text style={[theme.typography.body, { color: theme.colors.textTertiary }]}>
          {value}
        </Text>
      )}
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[theme.typography.body, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        <Text style={[theme.typography.headline, { color: theme.colors.text }]}>
          Settings
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <Text style={[theme.typography.title3, { color: theme.colors.text, marginBottom: spacing.md }]}>
            Appearance
          </Text>
          <SettingRow
            label="Theme"
            value={appTheme === 'auto' ? 'Auto' : appTheme === 'light' ? 'Light' : 'Dark'}
            onPress={toggleTheme}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[theme.typography.title3, { color: theme.colors.text, marginBottom: spacing.md }]}>
            Study
          </Text>
          <SettingRow
            label="Show Timer"
            rightElement={
              <Switch
                value={showTimer}
                onValueChange={(value) => updateSettings({ showTimer: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[theme.typography.title3, { color: theme.colors.text, marginBottom: spacing.md }]}>
            Feedback
          </Text>
          <SettingRow
            label="Sound Effects"
            rightElement={
              <Switch
                value={soundEnabled}
                onValueChange={(value) => updateSettings({ soundEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
          <SettingRow
            label="Haptic Feedback"
            rightElement={
              <Switch
                value={hapticEnabled}
                onValueChange={(value) => updateSettings({ hapticEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[theme.typography.title3, { color: theme.colors.text, marginBottom: spacing.md }]}>
            Notifications
          </Text>
          <SettingRow
            label="Daily Reminders"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            }
          />
        </Card>

        {!isPro && (
          <Card style={[styles.section, { backgroundColor: theme.colors.primary }]}>
            <Text style={[theme.typography.title3, { color: '#FFFFFF', marginBottom: spacing.sm }]}>
              Upgrade to Pro
            </Text>
            <Text style={[theme.typography.body, { color: 'rgba(255,255,255,0.9)', marginBottom: spacing.md }]}>
              Unlock media support, themes, and advanced features
            </Text>
            <TouchableOpacity
              style={styles.proButton}
              onPress={() => {}}
            >
              <Text style={[theme.typography.headline, { color: theme.colors.primary }]}>
                Learn More
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        <View style={styles.footer}>
          <Text style={[theme.typography.caption1, { color: theme.colors.textTertiary, textAlign: 'center' }]}>
            StudyCards Pro v1.0.0{'\n'}
            Made with ❤️ for learners
          </Text>
        </View>
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
  section: {
    margin: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  proButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  footer: {
    padding: spacing.xl,
  },
});
