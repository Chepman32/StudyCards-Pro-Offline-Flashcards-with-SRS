import { Platform, TextStyle } from 'react-native';

export const fontFamilies = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  display: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }),
};

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  heavy: '800' as TextStyle['fontWeight'],
};

export const typography = {
  // Large titles
  largeTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.37,
  } as TextStyle,

  // Titles
  title1: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.36,
  } as TextStyle,

  title2: {
    fontFamily: fontFamilies.display,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.35,
  } as TextStyle,

  title3: {
    fontFamily: fontFamilies.display,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.38,
  } as TextStyle,

  // Headlines
  headline: {
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
  } as TextStyle,

  // Body
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.41,
  } as TextStyle,

  bodyEmphasized: {
    fontFamily: fontFamilies.regular,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
  } as TextStyle,

  callout: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.32,
  } as TextStyle,

  subheadline: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.24,
  } as TextStyle,

  footnote: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.08,
  } as TextStyle,

  caption1: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  } as TextStyle,

  caption2: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.07,
  } as TextStyle,
};

export type TypographyVariant = keyof typeof typography;
