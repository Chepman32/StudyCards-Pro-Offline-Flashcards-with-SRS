import { colors, ColorScheme, ColorName } from './colors';
import { typography, TypographyVariant, fontFamilies, fontWeights } from './typography';
import { spacing, borderRadius, shadows, hitSlop, Spacing, BorderRadius, Shadow } from './spacing';

export interface Theme {
  colors: typeof colors.light;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  hitSlop: typeof hitSlop;
  isDark: boolean;
}

export const createTheme = (scheme: ColorScheme = 'light'): Theme => ({
  colors: colors[scheme],
  typography,
  spacing,
  borderRadius,
  shadows,
  hitSlop,
  isDark: scheme === 'dark',
});

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  hitSlop,
  fontFamilies,
  fontWeights,
};

export type {
  ColorScheme,
  ColorName,
  TypographyVariant,
  Spacing,
  BorderRadius,
  Shadow,
};
