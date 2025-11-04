import { AddFriendModal } from '@/components/ui/add-friend-modal';
import { FriendDetailsModal } from '@/components/ui/friend-details-modal';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FriendsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  // Mock data for friends
  const friends = [
    {
      id: '1',
      name: 'Анна Петрова',
      status: 'online' as const,
      distance: '500м',
      lastSeen: '2 мин назад',
      lat: 55.7558,
      lng: 37.6176,
    },
    {
      id: '2',
      name: 'Максим Иванов',
      status: 'away' as const,
      distance: '1.2км',
      lastSeen: '15 мин назад',
      lat: 55.76,
      lng: 37.62,
    },
    {
      id: '3',
      name: 'Елена Сидорова',
      status: 'online' as const,
      distance: '800м',
      lastSeen: '1 мин назад',
      lat: 55.75,
      lng: 37.615,
    },
    {
      id: '4',
      name: 'Дмитрий Козлов',
      status: 'offline' as const,
      distance: '2.1км',
      lastSeen: '2 часа назад',
      lat: 55.765,
      lng: 37.625,
    },
    {
      id: '5',
      name: 'Ольга Морозова',
      status: 'online' as const,
      distance: '1.5км',
      lastSeen: '5 мин назад',
      lat: 55.748,
      lng: 37.62,
    },
    {
      id: '6',
      name: 'Алексей Волков',
      status: 'away' as const,
      distance: '3.2км',
      lastSeen: '30 мин назад',
      lat: 55.77,
      lng: 37.63,
    },
  ];

  const filteredFriends = friends
    .filter((friend) => {
      const matchesSearch = friend.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      // Сортировка по удаленности (сначала ближайшие)
      const parseDistance = (distance: string) => {
        if (!distance) return 999;
        const num = parseFloat(distance.replace(/[^\d.]/g, ''));
        // Если есть "км", умножаем на 1000
        if (distance.includes('км')) {
          return num * 1000;
        }
        // Если есть "м", оставляем как есть
        return num;
      };

      const distanceA = parseDistance(a.distance || '');
      const distanceB = parseDistance(b.distance || '');
      return distanceA - distanceB;
    });

  const handleAddFriend = () => {
    setAddFriendModalVisible(true);
  };

  const handleAddFriendSuccess = (user: any) => {
    alert(`Друг ${user.name} (@${user.username}) успешно добавлен!`);
  };

  const handleFriendPress = (friend: any) => {
    setSelectedFriend(friend);
    setFriendModalVisible(true);
  };

  const handleLocationPress = (friendId: string) => {
    // Переходим на страницу Карта с параметром выбранного друга
    router.push({
      pathname: '/map',
      params: { selectedFriendId: friendId },
    });
  };

  const handleMessageFriend = (friend: any) => {
    alert(`Отправляем сообщение ${friend.name}`);
  };

  const handleNavigateToFriend = (friend: any) => {
    // Переходим на страницу Карта с параметром выбранного друга
    router.push({
      pathname: '/map',
      params: { selectedFriendId: friend.id },
    });
    setFriendModalVisible(false);
  };

  const handleCallFriend = (friend: any) => {
    alert(`Звоним ${friend.name}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <GlassContainer style={styles.header} variant='elevated'>
        <Text style={[styles.title, { color: colors.text }]}>Друзья</Text>
        <GlassButton
          title='Добавить'
          onPress={handleAddFriend}
          variant='primary'
          size='small'
          icon={
            <IconSymbol name='person.badge.plus' size={16} color='#FFFFFF' />
          }
        />
      </GlassContainer>

      {/* Search */}
      <GlassContainer style={styles.searchContainer} variant='elevated'>
        <View style={styles.searchInputContainer}>
          <IconSymbol
            name='magnifyingglass'
            size={20}
            color={colors.textTertiary}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder='Поиск друзей...'
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol
                name='xmark.circle.fill'
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </GlassContainer>

      {/* Friends List */}
      <GlassContainer style={styles.friendsContainer} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Друзья ({filteredFriends.length})
        </Text>

        {filteredFriends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={[styles.friendItem, { borderBottomColor: colors.surface }]}
            onPress={() => handleFriendPress(friend)}
          >
            <View style={styles.friendInfo}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.avatarText}>
                  {friend.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.friendDetails}>
                <Text style={[styles.friendName, { color: colors.text }]}>
                  {friend.name}
                </Text>
                <Text
                  style={[styles.friendStatus, { color: colors.textSecondary }]}
                >
                  {friend.status === 'online'
                    ? 'В сети'
                    : friend.status === 'away'
                    ? 'Отошел'
                    : 'Не в сети'}{' '}
                  • {friend.lastSeen}
                </Text>
                {friend.distance && (
                  <Text
                    style={[
                      styles.friendDistance,
                      { color: colors.textTertiary },
                    ]}
                  >
                    📍 {friend.distance}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.friendActions}>
              <TouchableOpacity style={styles.actionButton}>
                <IconSymbol name='message' size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLocationPress(friend.id)}
              >
                <IconSymbol
                  name='location'
                  size={20}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredFriends.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name='person.2' size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? 'Друзья не найдены' : 'У вас пока нет друзей'}
            </Text>
            <GlassButton
              title='Найти друзей'
              onPress={handleAddFriend}
              variant='primary'
              style={styles.emptyButton}
            />
          </View>
        )}
      </GlassContainer>

      {/* Friend Details Modal */}
      <FriendDetailsModal
        friend={selectedFriend}
        visible={friendModalVisible}
        onClose={() => {
          setFriendModalVisible(false);
          setSelectedFriend(null);
        }}
        onMessageFriend={handleMessageFriend}
        onNavigateToFriend={handleNavigateToFriend}
        onCallFriend={handleCallFriend}
      />

      {/* Add Friend Modal */}
      <AddFriendModal
        visible={addFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
        onAddFriend={handleAddFriendSuccess}
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
  searchContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  friendsContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 14,
    marginBottom: 2,
  },
  friendDistance: {
    fontSize: 12,
  },
  friendActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
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
});
