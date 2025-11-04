import {
  CreateEventData,
  CreateEventModal,
} from '@/components/ui/create-event-modal';
import { EventCard } from '@/components/ui/event-card';
import { Event, EventDetailsModal } from '@/components/ui/event-details-modal';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, EventCategories, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>(
    'all'
  );
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [eventDetailsModalVisible, setEventDetailsModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock data for events
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Корпоративная вечеринка',
      description: 'Отмечаем успешный квартал в офисе',
      date: '15 декабря',
      time: '19:00',
      location: 'Офис на Тверской',
      category: 'corporate' as keyof typeof EventCategories,
      attendees: 25,
      lat: 55.7558,
      lng: 37.6176,
    },
    {
      id: '2',
      title: 'День рождения Алины',
      description: 'Приглашаем всех на праздник!',
      date: '20 декабря',
      time: '18:30',
      location: 'Ресторан "У Алины"',
      category: 'birthday' as keyof typeof EventCategories,
      attendees: 12,
      lat: 55.76,
      lng: 37.62,
    },
    {
      id: '3',
      title: 'Бизнес-встреча с клиентом',
      description: 'Обсуждение нового проекта',
      date: '18 декабря',
      time: '14:00',
      location: 'Кофейня "Работа"',
      category: 'business' as keyof typeof EventCategories,
      attendees: 4,
      lat: 55.7628,
      lng: 37.6228,
    },
    {
      id: '4',
      title: 'Неформальная встреча',
      description: 'Просто пообщаться за чашкой кофе',
      date: '22 декабря',
      time: '16:00',
      location: 'Старбакс на Арбате',
      category: 'casual' as keyof typeof EventCategories,
      attendees: 8,
      lat: 55.7488,
      lng: 37.6088,
    },
  ]);

  const handleCreateEvent = (eventData: CreateEventData) => {
    // Преобразуем CreateEventData в Event
    const formattedDate = eventData.date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
    const formattedTime = eventData.time.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title,
      description: eventData.description,
      date: formattedDate,
      time: formattedTime,
      location: eventData.location,
      category: eventData.eventType === 'commercial' ? 'business' : 'casual',
      attendees: 0,
      lat: eventData.lat,
      lng: eventData.lng,
    };

    setEvents([newEvent, ...events]);
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsModalVisible(true);
  };

  const handleJoinEvent = (event: Event) => {
    alert(`Вы присоединились к событию: ${event.title}`);
  };

  const handleShareEvent = (event: Event) => {
    alert(`Поделиться событием: ${event.title}`);
  };

  const handleNavigateToEvent = (event: Event) => {
    // Переход на карту с событием (обработчик уже реализован в модалке через Google Maps)
    // Этот коллбек используется для логирования и других действий
  };

  // Фильтрация по категориям
  const categoryFilteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  // Фильтрация по табам (заглушка - в реальности нужно проверять даты)
  const filteredEvents =
    activeTab === 'upcoming'
      ? categoryFilteredEvents.filter((_, index) => index < 3) // Предстоящие
      : activeTab === 'past'
      ? categoryFilteredEvents.filter((_, index) => index >= 3) // Прошедшие
      : categoryFilteredEvents; // Все

  const categories = Object.entries(EventCategories);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <GlassContainer style={styles.header} variant='elevated'>
        <Text style={[styles.title, { color: colors.text }]}>События</Text>
        <GlassButton
          title='Создать'
          onPress={() => setCreateEventModalVisible(true)}
          variant='primary'
          size='small'
          icon={<IconSymbol name='plus' size={16} color='#FFFFFF' />}
        />
      </GlassContainer>

      {/* Category Filter */}
      <GlassContainer style={styles.filterContainer} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Категории
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesList}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && styles.categoryButtonActive,
                { borderColor: colors.primary },
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color: !selectedCategory
                      ? colors.primary
                      : colors.textSecondary,
                  },
                ]}
              >
                Все
              </Text>
            </TouchableOpacity>

            {categories.map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryButton,
                  selectedCategory === key && styles.categoryButtonActive,
                  { borderColor: category.color },
                ]}
                onPress={() => setSelectedCategory(key)}
              >
                <IconSymbol
                  name={category.icon}
                  size={16}
                  color={
                    selectedCategory === key
                      ? category.color
                      : colors.textTertiary
                  }
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        selectedCategory === key
                          ? category.color
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </GlassContainer>

      {/* Events List */}
      <GlassContainer style={styles.eventsContainer} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {selectedCategory
            ? EventCategories[selectedCategory as keyof typeof EventCategories]
                .name
            : 'Все события'}{' '}
          ({filteredEvents.length})
        </Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'all' && styles.tabActive,
              {
                backgroundColor:
                  activeTab === 'all' ? colors.primary + '20' : 'transparent',
                borderColor:
                  activeTab === 'all' ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'all' ? colors.primary : colors.textSecondary,
                  fontWeight: activeTab === 'all' ? '600' : '500',
                },
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.tabActive,
              {
                backgroundColor:
                  activeTab === 'upcoming'
                    ? colors.primary + '20'
                    : 'transparent',
                borderColor:
                  activeTab === 'upcoming' ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'upcoming'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'upcoming' ? '600' : '500',
                },
              ]}
            >
              Предстоящие
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' && styles.tabActive,
              {
                backgroundColor:
                  activeTab === 'past' ? colors.primary + '20' : 'transparent',
                borderColor:
                  activeTab === 'past' ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'past'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'past' ? '600' : '500',
                },
              ]}
            >
              Прошедшие
            </Text>
          </TouchableOpacity>
        </View>

        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            time={event.time}
            location={event.location}
            category={event.category}
            attendees={event.attendees}
            onPress={() => handleEventPress(event)}
          />
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              name='calendar.badge.plus'
              size={48}
              color={colors.textTertiary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Нет событий в этой категории
            </Text>
            <GlassButton
              title='Создать первое событие'
              onPress={() => setCreateEventModalVisible(true)}
              variant='primary'
              style={styles.emptyButton}
            />
          </View>
        )}
      </GlassContainer>

      {/* Quick Actions */}
      <GlassContainer style={styles.actionsContainer} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Быстрые действия
        </Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary + '30',
              },
            ]}
            onPress={() =>
              alert('Здесь откроется страница с ивентами где вы организатор')
            }
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: colors.primary + '25' },
              ]}
            >
              <IconSymbol
                name='person.circle.fill'
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              Мои события
            </Text>
            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              События, которые вы создали
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.secondary + '15',
                borderColor: colors.secondary + '30',
              },
            ]}
            onPress={() =>
              alert('Здесь откроется страница с ивентами, где вы участник')
            }
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: colors.secondary + '25' },
              ]}
            >
              <IconSymbol
                name='envelope.fill'
                size={24}
                color={colors.secondary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              Приглашения
            </Text>
            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              События, на которые вас пригласили
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.textTertiary + '15',
                borderColor: colors.textTertiary + '30',
              },
            ]}
            onPress={() => alert('История событий')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: colors.textTertiary + '25' },
              ]}
            >
              <IconSymbol
                name='clock.fill'
                size={24}
                color={colors.textTertiary}
              />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              История
            </Text>
            <Text
              style={[
                styles.actionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Прошедшие события
            </Text>
          </TouchableOpacity>
        </View>
      </GlassContainer>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={createEventModalVisible}
        onClose={() => setCreateEventModalVisible(false)}
        onCreateEvent={handleCreateEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        visible={eventDetailsModalVisible}
        onClose={() => {
          setEventDetailsModalVisible(false);
          setSelectedEvent(null);
        }}
        onJoinEvent={handleJoinEvent}
        onShareEvent={handleShareEvent}
        onNavigateToEvent={handleNavigateToEvent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    margin: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  categoriesList: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
  },
  actionsContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    gap: Spacing.md,
  },
  actionCard: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
