import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, EventCategories, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  distance: string;
  lat: number;
  lng: number;
}

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

interface TabbedSearchProps {
  friends: Friend[];
  events: Event[];
  visible: boolean;
  onClose: () => void;
  onFriendSelect: (friend: Friend) => void;
  onEventSelect: (event: Event) => void;
}

type SearchTab = 'friends' | 'events';

export function TabbedSearch({
  friends,
  events,
  visible,
  onClose,
  onFriendSelect,
  onEventSelect,
}: TabbedSearchProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('friends');

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFriendSelect = (friend: Friend) => {
    onFriendSelect(friend);
    onClose();
    setSearchQuery('');
  };

  const handleEventSelect = (event: Event) => {
    onEventSelect(event);
    onClose();
    setSearchQuery('');
  };

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'away':
        return '#FF9800';
      case 'offline':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: Friend['status']) => {
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

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={[styles.friendItem, { borderBottomColor: colors.surface }]}
      onPress={() => handleFriendSelect(item)}
    >
      <View style={styles.friendInfo}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {item.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Text>
        </View>
        <View style={styles.friendDetails}>
          <Text style={[styles.friendName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text
              style={[styles.friendStatus, { color: colors.textSecondary }]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={[styles.friendDistance, { color: colors.textTertiary }]}>
            📍 {item.distance}
          </Text>
        </View>
      </View>
      <IconSymbol name='chevron.right' size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }: { item: Event }) => {
    const categoryInfo = EventCategories[item.category];

    return (
      <TouchableOpacity
        style={[styles.eventItem, { borderBottomColor: colors.surface }]}
        onPress={() => handleEventSelect(item)}
      >
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryInfo.color },
              ]}
            >
              <IconSymbol name={categoryInfo.icon} size={14} color='#FFFFFF' />
            </View>
            <View style={styles.eventDetails}>
              <Text
                style={[styles.eventTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
                {item.date} в {item.time}
              </Text>
              <Text
                style={[styles.eventLocation, { color: colors.textTertiary }]}
                numberOfLines={1}
              >
                📍 {item.location}
              </Text>
            </View>
          </View>
          {item.attendees > 0 && (
            <View style={styles.eventAttendees}>
              <IconSymbol
                name='person.2'
                size={14}
                color={colors.textTertiary}
              />
              <Text
                style={[styles.attendeesText, { color: colors.textTertiary }]}
              >
                {item.attendees}
              </Text>
            </View>
          )}
        </View>
        <IconSymbol
          name='chevron.right'
          size={16}
          color={colors.textTertiary}
        />
      </TouchableOpacity>
    );
  };

  const getCurrentResults = () => {
    return activeTab === 'friends'
      ? filteredFriends.length
      : filteredEvents.length;
  };

  const getEmptyMessage = () => {
    if (searchQuery.length === 0) {
      return activeTab === 'friends'
        ? 'Начните вводить имя друга'
        : 'Начните вводить название события';
    }
    return activeTab === 'friends' ? 'Друзья не найдены' : 'События не найдены';
  };

  const getEmptyIcon = () => {
    return activeTab === 'friends'
      ? 'person.crop.circle'
      : 'calendar.badge.plus';
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
              Поиск
            </Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Tabs */}
        <View
          style={[styles.tabsContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'friends' && styles.activeTab,
              { borderBottomColor: colors.primary },
            ]}
            onPress={() => setActiveTab('friends')}
          >
            <IconSymbol
              name='person.2'
              size={18}
              color={
                activeTab === 'friends' ? colors.primary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'friends'
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              Друзья
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'events' && styles.activeTab,
              { borderBottomColor: colors.primary },
            ]}
            onPress={() => setActiveTab('events')}
          >
            <IconSymbol
              name='calendar'
              size={18}
              color={
                activeTab === 'events' ? colors.primary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'events'
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              События
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View
          style={[styles.searchContainer, { backgroundColor: colors.surface }]}
        >
          <IconSymbol
            name='magnifyingglass'
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={
              activeTab === 'friends'
                ? 'Введите имя друга...'
                : 'Введите название события...'
            }
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <IconSymbol
                name='xmark.circle.fill'
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            Найдено: {getCurrentResults()}
          </Text>

          {getCurrentResults() === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                name={getEmptyIcon()}
                size={48}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {getEmptyMessage()}
              </Text>
            </View>
          ) : (
            <FlatList
              data={activeTab === 'friends' ? filteredFriends : filteredEvents}
              renderItem={
                activeTab === 'friends' ? renderFriendItem : renderEventItem
              }
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
  placeholder: {
    width: 44,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: Spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.md,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  // Friend item styles
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  friendStatus: {
    fontSize: 14,
  },
  friendDistance: {
    fontSize: 12,
  },
  // Event item styles
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  eventInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  attendeesText: {
    fontSize: 12,
  },
});
