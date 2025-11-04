import {
  BorderRadius,
  Colors,
  EventCategories,
  Spacing,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { GlassContainer } from './glass-container';
import { IconSymbol } from './icon-symbol';

interface EventCardProps {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  category: keyof typeof EventCategories;
  attendees?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  category,
  attendees = 0,
  onPress,
  style,
}: EventCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const categoryInfo = EventCategories[category];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassContainer
        style={[styles.card, style]}
        variant='elevated'
        borderRadius='lg'
        padding={Spacing.lg}
      >
        {/* Header with category */}
        <View style={styles.header}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryInfo.color },
            ]}
          >
            <IconSymbol name={categoryInfo.icon} size={16} color='#FFFFFF' />
            <Text style={styles.categoryText}>{categoryInfo.name}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {/* Date and time */}
        <View style={styles.timeContainer}>
          <IconSymbol name='calendar' size={16} color={colors.textTertiary} />
          <Text style={[styles.timeText, { color: colors.textTertiary }]}>
            {date} в {time}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <IconSymbol name='location' size={16} color={colors.textTertiary} />
          <Text
            style={[styles.locationText, { color: colors.textTertiary }]}
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>

        {/* Footer with attendees */}
        {attendees > 0 && (
          <View style={styles.footer}>
            <View style={styles.attendeesContainer}>
              <IconSymbol
                name='person.2'
                size={16}
                color={colors.textTertiary}
              />
              <Text
                style={[styles.attendeesText, { color: colors.textTertiary }]}
              >
                {attendees} участников
              </Text>
            </View>
          </View>
        )}
      </GlassContainer>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  attendeesText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
