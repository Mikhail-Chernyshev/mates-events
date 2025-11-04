import { Animation, BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}: GlassButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor:
        variant === 'primary'
          ? colors.primary
          : variant === 'secondary'
          ? colors.secondary
          : 'transparent',
      borderWidth: variant === 'ghost' ? 1 : 0,
      borderColor: variant === 'ghost' ? colors.glassBorder : 'transparent',
      borderRadius: BorderRadius.md,
      paddingHorizontal:
        size === 'small'
          ? Spacing.md
          : size === 'large'
          ? Spacing.xl
          : Spacing.lg,
      paddingVertical:
        size === 'small'
          ? Spacing.sm
          : size === 'large'
          ? Spacing.lg
          : Spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
    };

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      color: variant === 'ghost' ? colors.text : '#FFFFFF',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    return baseTextStyle;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: Animation.fast });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: Animation.fast });
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[getButtonStyle()]}
      >
        {icon && <>{icon}</>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}
