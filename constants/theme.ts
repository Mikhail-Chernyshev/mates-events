/**
 * MatesEvents Design System
 * Glassmorphism-inspired design with warm, cozy accents
 * Modern iPhone-style interface with minimalistic approach
 */

import { Platform } from 'react-native';

// Warm, cozy color palette with glassmorphism support
const warmAccent = '#FF6B6B'; // Warm coral
const cozyOrange = '#FFB347'; // Cozy orange
const softPeach = '#FFE4B5'; // Soft peach
const warmGray = '#8B7D6B'; // Warm gray
const glassWhite = 'rgba(255, 255, 255, 0.25)';
const glassDark = 'rgba(0, 0, 0, 0.25)';

export const Colors = {
  light: {
    // Primary colors
    primary: warmAccent,
    secondary: cozyOrange,
    accent: softPeach,

    // Text colors
    text: '#2D2D2D',
    textSecondary: '#6B6B6B',
    textTertiary: '#9B9B9B',

    // Background colors
    background: '#FAFAFA',
    backgroundSecondary: '#F5F5F5',
    surface: glassWhite,
    surfaceElevated: 'rgba(255, 255, 255, 0.4)',

    // Glass effects
    glass: glassWhite,
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    glassShadow: 'rgba(0, 0, 0, 0.1)',

    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Navigation
    tint: warmAccent,
    tabIconDefault: '#9B9B9B',
    tabIconSelected: warmAccent,

    // Map specific
    mapBackground: '#F8F9FA',
    friendPin: warmAccent,
    eventPin: cozyOrange,
    routeColor: warmAccent,
  },
  dark: {
    // Primary colors
    primary: warmAccent,
    secondary: cozyOrange,
    accent: softPeach,

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',

    // Background colors
    background: '#0A0A0A',
    backgroundSecondary: '#1A1A1A',
    surface: glassDark,
    surfaceElevated: 'rgba(255, 255, 255, 0.1)',

    // Glass effects
    glass: glassDark,
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassShadow: 'rgba(0, 0, 0, 0.3)',

    // Status colors
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#42A5F5',

    // Navigation
    tint: warmAccent,
    tabIconDefault: '#808080',
    tabIconSelected: warmAccent,

    // Map specific
    mapBackground: '#121212',
    friendPin: warmAccent,
    eventPin: cozyOrange,
    routeColor: warmAccent,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing system (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Border radius system
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

// Shadow system for glassmorphism
export const Shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Animation durations
export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Event categories
export const EventCategories = {
  corporate: {
    name: 'Корпоратив',
    color: '#4CAF50',
    icon: 'briefcase',
  },
  birthday: {
    name: 'День рождения',
    color: '#FF6B6B',
    icon: 'gift',
  },
  business: {
    name: 'Бизнес-встреча',
    color: '#2196F3',
    icon: 'handshake',
  },
  casual: {
    name: 'Неформальная встреча',
    color: '#FFB347',
    icon: 'coffee',
  },
  celebration: {
    name: 'Праздник',
    color: '#9C27B0',
    icon: 'party',
  },
} as const;
