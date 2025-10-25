export const colors = {
  // Light mode
  light: {
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#4DA2FF',

    secondary: '#5856D6',
    secondaryDark: '#3634A3',
    secondaryLight: '#7D7AFF',

    success: '#34C759',
    successDark: '#248A3D',
    successLight: '#5DD97C',

    warning: '#FF9500',
    warningDark: '#C77700',
    warningLight: '#FFB340',

    error: '#FF3B30',
    errorDark: '#C8271C',
    errorLight: '#FF6259',

    info: '#5AC8FA',
    infoDark: '#32AEE6',
    infoLight: '#85D9FB',

    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#E5E5EA',

    surface: '#FFFFFF',
    surfaceSecondary: '#F9F9F9',
    surfaceElevated: '#FFFFFF',

    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    textQuaternary: '#C7C7CC',

    border: '#C6C6C8',
    borderSecondary: '#E5E5EA',

    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Dark mode
  dark: {
    primary: '#0A84FF',
    primaryDark: '#0066CC',
    primaryLight: '#409CFF',

    secondary: '#5E5CE6',
    secondaryDark: '#4846B4',
    secondaryLight: '#7D7AFF',

    success: '#32D74B',
    successDark: '#28A83C',
    successLight: '#5EE36A',

    warning: '#FF9F0A',
    warningDark: '#CC7F00',
    warningLight: '#FFB340',

    error: '#FF453A',
    errorDark: '#CC342E',
    errorLight: '#FF6961',

    info: '#64D2FF',
    infoDark: '#32AEE6',
    infoLight: '#8ADDFF',

    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',

    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    surfaceElevated: '#3A3A3C',

    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#ABABAB',
    textQuaternary: '#636366',

    border: '#38383A',
    borderSecondary: '#48484A',

    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export type ColorScheme = keyof typeof colors;
export type ColorName = keyof typeof colors.light;
