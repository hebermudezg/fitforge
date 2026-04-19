export const LightColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceLight: '#F0F0F0',
  border: '#E0E0E0',

  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#999999',

  accent: '#FFD200',
  accentLight: '#FFE14D',
  accentDark: '#CCA800',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  bodyFill: '#F0F0F0',
  bodyStroke: '#333333',
  bodyHighlight: '#FFD200',
  bodyBadge: '#FFFFFF',

  gradientPrimary: ['#FFD200', '#FFE14D'] as const,
  gradientDark: ['#FFFFFF', '#F5F5F5'] as const,

  tabBarBackground: '#FFFFFF',
  tabBarActive: '#CCA800',
  tabBarInactive: '#AAAAAA',
} as const;

export const DarkColors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  border: '#333333',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#666666',

  accent: '#FFD200',
  accentLight: '#FFE14D',
  accentDark: '#CCA800',

  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  bodyFill: '#2A2A2A',
  bodyStroke: '#FFD200',
  bodyHighlight: '#FFD200',
  bodyBadge: '#1A1A1A',

  gradientPrimary: ['#FFD200', '#FFE14D'] as const,
  gradientDark: ['#1A1A1A', '#0D0D0D'] as const,

  tabBarBackground: '#111111',
  tabBarActive: '#FFD200',
  tabBarInactive: '#555555',
} as const;

export type ThemeColors = {
  [K in keyof typeof DarkColors]: (typeof DarkColors)[K] extends readonly string[]
    ? readonly string[]
    : string;
};

// Default export for backward compatibility — will be replaced by context
export const Colors = DarkColors;
