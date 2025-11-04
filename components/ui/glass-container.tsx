import { BorderRadius, Colors, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'subtle';
  borderRadius?: keyof typeof BorderRadius;
  padding?: number;
  margin?: number;
  blur?: boolean;
}

export function GlassContainer({
  children,
  style,
  variant = 'default',
  borderRadius = 'md',
  padding = 16,
  margin = 0,
  blur = true,
}: GlassContainerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getGlassStyle = () => {
    const baseStyle = {
      backgroundColor:
        variant === 'elevated' ? colors.surfaceElevated : colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderRadius: BorderRadius[borderRadius],
      padding,
      margin,
    };

    if (blur) {
      return {
        ...baseStyle,
        ...Shadows[colorScheme].medium,
      };
    }

    return baseStyle;
  };

  return <View style={[getGlassStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    // Base glass container styles
  },
});
