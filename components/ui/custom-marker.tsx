import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CustomMarkerProps {
  text: string;
  type: 'friend' | 'event';
  status?: 'online' | 'away' | 'offline';
}

export function CustomMarker({ text, type, status }: CustomMarkerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getMarkerColor = () => {
    if (type === 'friend') {
      switch (status) {
        case 'online':
          return '#4CAF50';
        case 'away':
          return '#FF9800';
        case 'offline':
          return '#9E9E9E';
        default:
          return colors.primary;
      }
    } else {
      // Для событий всегда синий цвет
      return '#2196F3';
    }
  };

  const getTextColor = () => {
    return '#FFFFFF';
  };

  const getMarkerSize = () => {
    return type === 'friend' ? 44 : 48; // События немного больше
  };

  const getFontSize = () => {
    return type === 'friend' ? 16 : 14; // Для событий меньше шрифт, так как 2 буквы
  };

  return (
    <View
      style={[
        styles.marker,
        {
          width: getMarkerSize(),
          height: getMarkerSize(),
          borderRadius: getMarkerSize() / 2,
          backgroundColor: getMarkerColor(),
          borderColor: colors.background,
          borderWidth: 2,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <Text
        style={[
          styles.markerText,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
            fontWeight: type === 'friend' ? '600' : '700',
          },
        ]}
      >
        {text.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    textAlign: 'center',
  },
});
