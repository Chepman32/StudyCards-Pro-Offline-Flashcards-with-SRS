import { useColorScheme } from 'react-native';
import { Theme, createTheme } from '@/theme';
import { useSettingsStore } from '@/stores/settingsStore';

export const useTheme = (): Theme => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme } = useSettingsStore();

  const effectiveTheme =
    userTheme === 'auto'
      ? systemColorScheme || 'light'
      : userTheme;

  return createTheme(effectiveTheme);
};
