import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { UserSettings, defaultUserSettings } from '@/types';

const storage = new MMKV({ id: 'settings' });

interface SettingsStore extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  toggleTheme: () => void;
  setProStatus: (isPro: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => {
  // Load settings from storage
  const storedSettings = storage.getString('userSettings');
  const initialSettings = storedSettings
    ? JSON.parse(storedSettings)
    : defaultUserSettings;

  return {
    ...initialSettings,

    updateSettings: (newSettings) => {
      const updated = { ...get(), ...newSettings };
      storage.set('userSettings', JSON.stringify(updated));
      set(newSettings);
    },

    resetSettings: () => {
      storage.set('userSettings', JSON.stringify(defaultUserSettings));
      set(defaultUserSettings);
    },

    toggleTheme: () => {
      const current = get().theme;
      const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      get().updateSettings({ theme: next });
    },

    setProStatus: (isPro) => {
      get().updateSettings({ isPro });
    },
  };
});
