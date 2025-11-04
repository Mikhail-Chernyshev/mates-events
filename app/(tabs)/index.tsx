import { ScrollView, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { EventCard } from '@/components/ui/event-card';
import {
  Friend,
  FriendDetailsModal,
} from '@/components/ui/friend-details-modal';
import { FriendPin } from '@/components/ui/friend-pin';
import { GlassContainer } from '@/components/ui/glass-container';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Mock data for friends
  const friends: Friend[] = [
    {
      id: '1',
      name: 'Анна Петрова',
      status: 'online',
      distance: '500м',
      lat: 55.7558,
      lng: 37.6176,
    },
    {
      id: '2',
      name: 'Максим Иванов',
      status: 'away',
      distance: '1.2км',
      lat: 55.76,
      lng: 37.62,
    },
    {
      id: '3',
      name: 'Елена Сидорова',
      status: 'online',
      distance: '800м',
      lat: 55.75,
      lng: 37.615,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleFriendPress = (friend: Friend) => {
    setSelectedFriend(friend);
    setFriendModalVisible(true);
  };

  const handleMessageFriend = (friend: Friend) => {
    alert(`Отправляем сообщение ${friend.name}`);
  };

  const handleNavigateToFriend = (friend: Friend) => {
    router.push({
      pathname: '/map',
      params: { selectedFriendId: friend.id },
    });
    setFriendModalVisible(false);
  };

  const handleCallFriend = (friend: Friend) => {
    alert(`Звоним ${friend.name}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <GlassContainer style={styles.welcomeSection} variant='elevated'>
        <View style={styles.titleContainer}>
          <ThemedText type='title' style={styles.welcomeTitle}>
            Добро пожаловать в MatesEvents! 👋
          </ThemedText>
          <HelloWave />
        </View>
        <ThemedText style={styles.welcomeSubtitle}>
          Ваша социальная сеть с картой и событиями
        </ThemedText>
      </GlassContainer>

      {/* Recent Events */}
      <GlassContainer style={styles.eventsSection} variant='elevated'>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Ближайшие события
        </ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.eventsList}>
            <EventCard
              title='Корпоративная вечеринка'
              description='Отмечаем успешный квартал в офисе'
              date='15 декабря'
              time='19:00'
              location='Офис на Тверской'
              category='corporate'
              attendees={25}
              onPress={() => alert('Открыть событие')}
              style={styles.eventCard}
            />

            <EventCard
              title='День рождения Алины'
              description='Приглашаем всех на праздник!'
              date='20 декабря'
              time='18:30'
              location="Ресторан 'У Алины'"
              category='birthday'
              attendees={12}
              onPress={() => alert('Открыть событие')}
              style={styles.eventCard}
            />

            <EventCard
              title='Бизнес-встреча'
              description='Обсуждение нового проекта'
              date='18 декабря'
              time='14:00'
              location='Кофейня "Работа"'
              category='business'
              attendees={4}
              onPress={() => alert('Открыть событие')}
              style={styles.eventCard}
            />
          </View>
        </ScrollView>
      </GlassContainer>

      {/* Friends Online */}
      <GlassContainer style={styles.friendsSection} variant='elevated'>
        <ThemedText type='subtitle' style={styles.sectionTitle}>
          Друзья поблизости
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.friendsList}>
            {friends.map((friend) => (
              <FriendPin
                key={friend.id}
                name={friend.name.split(' ')[0]}
                status={friend.status}
                distance={friend.distance}
                onPress={() => handleFriendPress(friend)}
              />
            ))}
          </View>
        </ScrollView>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 40,
  },
  headerSection: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  welcomeSection: {
    margin: Spacing.md,
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  eventsSection: {
    margin: Spacing.md,
    marginBottom: Spacing.lg,
  },
  eventsList: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  eventCard: {
    width: 280,
    marginBottom: 0,
  },
  friendsSection: {
    margin: Spacing.md,
    marginBottom: Spacing.xl,
  },
  friendsList: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
});
