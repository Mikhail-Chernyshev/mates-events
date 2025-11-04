import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, EventCategories, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Linking from 'expo-linking';
import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: keyof typeof EventCategories;
  attendees: number;
  lat?: number;
  lng?: number;
}

interface EventDetailsModalProps {
  event: Event | null;
  visible: boolean;
  onClose: () => void;
  onJoinEvent?: (event: Event) => void;
  onShareEvent?: (event: Event) => void;
  onNavigateToEvent?: (event: Event) => void;
}

export function EventDetailsModal({
  event,
  visible,
  onClose,
  onJoinEvent,
  onShareEvent,
  onNavigateToEvent,
}: EventDetailsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!event) return null;

  const categoryInfo = EventCategories[event.category];

  const handleJoinEvent = () => {
    onJoinEvent?.(event);
  };

  const handleShareEvent = () => {
    onShareEvent?.(event);
  };

  const handleNavigateToEvent = async () => {
    try {
      // Проверяем наличие координат
      if (!event.lat || !event.lng) {
        Alert.alert(
          'Ошибка',
          'У этого события нет координат. Невозможно построить маршрут.'
        );
        return;
      }

      const { lat, lng } = event;

      // Формируем URL для Google Maps с маршрутом
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      // Пытаемся открыть нативное приложение Google Maps
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Если нативное приложение недоступно, открываем в браузере
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        await Linking.openURL(webUrl);
      }

      // Вызываем коллбек, если он предоставлен (для логирования и т.д.)
      onNavigateToEvent?.(event);
      onClose();
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось открыть маршрут. Проверьте, установлено ли приложение Google Maps.'
      );
      console.error('Error opening Google Maps:', error);
    }
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    return `${dateStr} в ${timeStr}`;
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name='xmark' size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Детали события
            </Text>
            <TouchableOpacity
              onPress={handleShareEvent}
              style={styles.shareButton}
            >
              <IconSymbol
                name='square.and.arrow.up'
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Event Header */}
          <GlassContainer style={styles.eventHeader} variant='elevated'>
            <View style={styles.categorySection}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryInfo.color },
                ]}
              >
                <IconSymbol
                  name={categoryInfo.icon}
                  size={24}
                  color='#FFFFFF'
                />
              </View>
              <View style={styles.categoryInfo}>
                <Text
                  style={[styles.categoryName, { color: categoryInfo.color }]}
                >
                  {categoryInfo.name}
                </Text>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
              </View>
            </View>
          </GlassContainer>

          {/* Event Details */}
          <GlassContainer style={styles.detailsContainer} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Информация о событии
            </Text>

            {/* Description */}
            <View style={styles.detailRow}>
              <IconSymbol
                name='text.alignleft'
                size={20}
                color={colors.primary}
              />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Описание
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {event.description}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.detailRow}>
              <IconSymbol name='calendar' size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Дата и время
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(event.date, event.time)}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.detailRow}>
              <IconSymbol name='location' size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Место проведения
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {event.location}
                </Text>
              </View>
            </View>

            {/* Attendees */}
            <View style={styles.detailRow}>
              <IconSymbol name='person.2' size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Участники
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {event.attendees}{' '}
                  {event.attendees === 1 ? 'человек' : 'человека'}
                </Text>
              </View>
            </View>
          </GlassContainer>

          {/* Map Preview */}
          {event.lat && event.lng && (
            <GlassContainer style={styles.mapContainer} variant='elevated'>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Расположение на карте
              </Text>
              <View
                style={[styles.mapPreview, { backgroundColor: colors.surface }]}
              >
                <IconSymbol name='map' size={32} color={colors.textTertiary} />
                <Text style={[styles.mapText, { color: colors.textTertiary }]}>
                  Нажмите для просмотра на карте
                </Text>
              </View>
            </GlassContainer>
          )}

          {/* Actions */}
          <GlassContainer style={styles.actionsContainer} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Действия
            </Text>

            <View style={styles.actionsGrid}>
              <GlassButton
                title='Присоединиться'
                onPress={handleJoinEvent}
                variant='primary'
                size='large'
                icon={
                  <IconSymbol
                    name='person.badge.plus'
                    size={18}
                    color='#FFFFFF'
                  />
                }
                style={styles.primaryAction}
              />
            </View>

            <View style={styles.additionalActions}>
              {event.lat && event.lng && (
                <GlassButton
                  title='Маршрут'
                  onPress={handleNavigateToEvent}
                  variant='ghost'
                  size='small'
                  icon={
                    <IconSymbol
                      name='location'
                      size={16}
                      color={colors.primary}
                    />
                  }
                  style={styles.smallAction}
                />
              )}

              <GlassButton
                title='Добавить в календарь'
                onPress={() => alert('Добавление в календарь')}
                variant='ghost'
                size='small'
                icon={
                  <IconSymbol
                    name='calendar.badge.plus'
                    size={16}
                    color={colors.primary}
                  />
                }
                style={styles.smallAction}
              />

              <GlassButton
                title='Поделиться'
                onPress={handleShareEvent}
                variant='ghost'
                size='small'
                icon={
                  <IconSymbol
                    name='square.and.arrow.up'
                    size={16}
                    color={colors.primary}
                  />
                }
                style={styles.smallAction}
              />
            </View>
          </GlassContainer>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  eventHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  detailsContainer: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  detailContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  mapContainer: {
    marginBottom: Spacing.sm,
  },
  mapPreview: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  mapText: {
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  primaryAction: {
    marginBottom: 0,
  },
  secondaryAction: {
    marginBottom: 0,
  },
  additionalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  smallAction: {
    flex: 1,
  },
});
