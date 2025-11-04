import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlassContainer } from './glass-container';
import { IconSymbol } from './icon-symbol';

interface FriendPinProps {
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  distance?: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export function FriendPin({
  name,
  avatar,
  status,
  distance,
  onPress,
  isSelected = false,
}: FriendPinProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'away':
        return colors.warning;
      case 'offline':
        return colors.textTertiary;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'В сети';
      case 'away':
        return 'Отошел';
      case 'offline':
        return 'Не в сети';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassContainer
        style={[
          styles.pin,
          {
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? colors.primary : 'transparent',
          },
        ]}
        variant='elevated'
        borderRadius='lg'
        padding={Spacing.md}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {avatar ? (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Status indicator */}
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor() },
            ]}
          />
        </View>

        {/* Name */}
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>

        {/* Status */}
        <Text style={[styles.status, { color: colors.textSecondary }]}>
          {getStatusText()}
        </Text>

        {/* Distance */}
        {distance && (
          <View style={styles.distanceContainer}>
            <IconSymbol name='location' size={12} color={colors.textTertiary} />
            <Text style={[styles.distance, { color: colors.textTertiary }]}>
              {distance}
            </Text>
          </View>
        )}
      </GlassContainer>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    minWidth: 80,
    maxWidth: 120,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 11,
    fontWeight: '500',
  },
});
