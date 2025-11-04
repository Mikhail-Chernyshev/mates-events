import { CustomMarker } from '@/components/ui/custom-marker';
import { EventDetailsModal } from '@/components/ui/event-details-modal';
import { FriendDetailsModal } from '@/components/ui/friend-details-modal';
import { FriendPin } from '@/components/ui/friend-pin';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Event, Friend, TabbedSearch } from '@/components/ui/tabbed-search';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] =
    useState<Event | null>(null);
  const [selectedFriendForModal, setSelectedFriendForModal] =
    useState<Friend | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);

  // Mock data for friends
  const friends: Friend[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Анна Петрова',
        status: 'online' as const,
        distance: '500м',
        lat: 55.7558,
        lng: 37.6176,
      },
      {
        id: '2',
        name: 'Максим Иванов',
        status: 'away' as const,
        distance: '1.2км',
        lat: 55.76,
        lng: 37.62,
      },
      {
        id: '3',
        name: 'Елена Сидорова',
        status: 'online' as const,
        distance: '800м',
        lat: 55.75,
        lng: 37.615,
      },
      {
        id: '4',
        name: 'Дмитрий Козлов',
        status: 'offline' as const,
        distance: '2.1км',
        lat: 55.765,
        lng: 37.625,
      },
      {
        id: '5',
        name: 'Ольга Морозова',
        status: 'online' as const,
        distance: '1.5км',
        lat: 55.748,
        lng: 37.62,
      },
      {
        id: '6',
        name: 'Алексей Волков',
        status: 'away' as const,
        distance: '3.2км',
        lat: 55.77,
        lng: 37.63,
      },
      {
        id: '7',
        name: 'Мария Новикова',
        status: 'online' as const,
        distance: '900м',
        lat: 55.752,
        lng: 37.618,
      },
      {
        id: '8',
        name: 'Сергей Федоров',
        status: 'offline' as const,
        distance: '4.1км',
        lat: 55.74,
        lng: 37.61,
      },
    ],
    []
  );

  // Mock data for events
  const events: Event[] = [
    {
      id: 'e1',
      title: 'Корпоративная вечеринка',
      description: 'Отмечаем успешный квартал в офисе',
      date: '15 декабря',
      time: '19:00',
      location: 'Офис на Тверской',
      category: 'corporate',
      attendees: 25,
      lat: 55.7588,
      lng: 37.6188,
    },
    {
      id: 'e2',
      title: 'День рождения Алины',
      description: 'Приглашаем всех на праздник!',
      date: '20 декабря',
      time: '18:30',
      location: 'Ресторан "У Алины"',
      category: 'birthday',
      attendees: 12,
      lat: 55.7528,
      lng: 37.6128,
    },
    {
      id: 'e3',
      title: 'Бизнес-встреча с клиентом',
      description: 'Обсуждение нового проекта',
      date: '18 декабря',
      time: '14:00',
      location: 'Кофейня "Работа"',
      category: 'business',
      attendees: 4,
      lat: 55.7628,
      lng: 37.6228,
    },
    {
      id: 'e4',
      title: 'Неформальная встреча',
      description: 'Просто пообщаться за чашкой кофе',
      date: '22 декабря',
      time: '16:00',
      location: 'Старбакс на Арбате',
      category: 'casual',
      attendees: 8,
      lat: 55.7488,
      lng: 37.6088,
    },
    {
      id: 'e5',
      title: 'Конференция по IT',
      description: 'Обсуждение новых технологий',
      date: '25 декабря',
      time: '10:00',
      location: 'Конференц-зал "Технопарк"',
      category: 'business',
      attendees: 50,
      lat: 55.7688,
      lng: 37.6288,
    },
  ];

  // Обработка параметра выбранного друга при навигации со страницы друзей
  useEffect(() => {
    if (
      params.selectedFriendId &&
      typeof params.selectedFriendId === 'string'
    ) {
      const friendId = params.selectedFriendId;
      const friend = friends.find((f) => f.id === friendId);

      if (friend && mapRef) {
        // Перемещаем карту к выбранному другу
        setTimeout(() => {
          if (mapRef) {
            mapRef.animateToRegion({
              latitude: friend.lat,
              longitude: friend.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }, 500); // Небольшая задержка для загрузки карты

        // Выбираем друга на карте
        setSelectedFriend(friendId);
        setSelectedEvent(null);
      }
    }
  }, [params.selectedFriendId, mapRef, friends]);

  const handleFriendPress = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);

    if (selectedFriend === friendId) {
      // Если друг уже выбран, открываем модальное окно
      setSelectedFriendForModal(friend || null);
      setFriendModalVisible(true);
    } else {
      // Если друг не выбран, перемещаем карту к нему и выбираем
      if (friend && mapRef) {
        mapRef.animateToRegion({
          latitude: friend.lat,
          longitude: friend.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
      setSelectedFriend(friendId);
      setSelectedEvent(null); // Сброс выбора события
    }
  };

  const handleEventPress = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event && mapRef && event.lat && event.lng) {
      // Перемещаем карту к выбранному событию
      mapRef.animateToRegion({
        latitude: event.lat,
        longitude: event.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
    setSelectedFriend(null); // Сброс выбора друга

    // Открываем модальное окно с деталями события
    setSelectedEventForModal(event || null);
    setEventModalVisible(true);
  };

  const handleMyLocation = async () => {
    try {
      // Запрашиваем разрешение на доступ к местоположению
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Разрешение на доступ к местоположению отклонено');
        return;
      }

      // Получаем текущее местоположение
      const location = await Location.getCurrentPositionAsync({});

      if (mapRef) {
        mapRef.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Ошибка получения местоположения:', error);
      alert('Не удалось получить ваше местоположение');
    }
  };

  const handleSearch = () => {
    setSearchVisible(true);
  };

  const handleFriendSelect = (friend: Friend) => {
    // Перемещаем карту к выбранному другу
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: friend.lat,
        longitude: friend.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
    setSelectedFriend(friend.id);
    setSelectedEvent(null);
  };

  const handleEventSelect = (event: Event) => {
    // Перемещаем карту к выбранному событию
    if (mapRef && event.lat && event.lng) {
      mapRef.animateToRegion({
        latitude: event.lat,
        longitude: event.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
    setSelectedEvent(event.id);
    setSelectedFriend(null);
  };

  const handleJoinEvent = (event: Event) => {
    alert(`Присоединяемся к событию: ${event.title}`);
  };

  const handleShareEvent = (event: Event) => {
    alert(`Поделиться событием: ${event.title}`);
  };

  const handleNavigateToEvent = (event: Event) => {
    if (mapRef && event.lat && event.lng) {
      mapRef.animateToRegion({
        latitude: event.lat,
        longitude: event.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
    setSelectedEvent(event.id);
    setSelectedFriend(null);
  };

  const handleMessageFriend = (friend: Friend) => {
    alert(`Отправляем сообщение ${friend.name}`);
  };

  const handleNavigateToFriend = (friend: Friend) => {
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: friend.lat,
        longitude: friend.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
    setSelectedFriend(friend.id);
    setSelectedEvent(null);
  };

  const handleCallFriend = (friend: Friend) => {
    alert(`Звоним ${friend.name}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navigation Controls - сверху */}
      <GlassContainer style={styles.controlsContainer} variant='elevated'>
        <View style={styles.controlsRow}>
          <GlassButton
            title='Мое местоположение'
            onPress={handleMyLocation}
            variant='ghost'
            size='small'
            icon={
              <IconSymbol
                name='location.fill'
                size={16}
                color={colors.primary}
              />
            }
          />
          <GlassButton
            title='Поиск'
            onPress={handleSearch}
            variant='ghost'
            size='small'
            icon={
              <IconSymbol
                name='magnifyingglass'
                size={16}
                color={colors.primary}
              />
            }
          />
        </View>
      </GlassContainer>

      {/* Карта */}
      <View style={styles.mapContainer}>
        <MapView
          ref={setMapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 55.7558,
            longitude: 37.6176,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType='standard'
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={false}
        >
          {/* Маркеры друзей */}
          {friends.map((friend) => (
            <Marker
              key={friend.id}
              coordinate={{
                latitude: friend.lat,
                longitude: friend.lng,
              }}
              onPress={() => handleFriendPress(friend.id)}
            >
              <CustomMarker
                text={friend.name.split(' ')[0][0]}
                type='friend'
                status={friend.status}
              />
            </Marker>
          ))}

          {/* Маркеры событий */}
          {events.map((event) =>
            event.lat && event.lng ? (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: event.lat,
                  longitude: event.lng,
                }}
                onPress={() => handleEventPress(event.id)}
              >
                <CustomMarker
                  text={event.title
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')}
                  type='event'
                />
              </Marker>
            ) : null
          )}
        </MapView>
      </View>

      {/* Friends List */}
      <GlassContainer style={styles.friendsContainer} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Друзья поблизости ({friends.length})
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.friendsList}>
            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendItem}>
                <FriendPin
                  name={friend.name.split(' ')[0]}
                  status={friend.status}
                  distance={friend.distance}
                  onPress={() => handleFriendPress(friend.id)}
                  isSelected={selectedFriend === friend.id}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </GlassContainer>

      {/* Tabbed Search Modal */}
      <TabbedSearch
        friends={friends}
        events={events}
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onFriendSelect={handleFriendSelect}
        onEventSelect={handleEventSelect}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEventForModal}
        visible={eventModalVisible}
        onClose={() => {
          setEventModalVisible(false);
          setSelectedEventForModal(null);
        }}
        onJoinEvent={handleJoinEvent}
        onShareEvent={handleShareEvent}
        onNavigateToEvent={handleNavigateToEvent}
      />

      {/* Friend Details Modal */}
      <FriendDetailsModal
        friend={selectedFriendForModal}
        visible={friendModalVisible}
        onClose={() => {
          setFriendModalVisible(false);
          setSelectedFriendForModal(null);
        }}
        onMessageFriend={handleMessageFriend}
        onNavigateToFriend={handleNavigateToFriend}
        onCallFriend={handleCallFriend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  mapContainer: {
    flex: 1, // Занимает оставшееся место
    margin: Spacing.md,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  mapSubtext: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  controlsContainer: {
    margin: Spacing.md,
    marginBottom: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  friendsContainer: {
    margin: Spacing.md,
    marginBottom: 8,
    paddingVertical: 6, // Уменьшенная высота контейнера
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  friendsList: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  friendItem: {
    alignItems: 'center',
  },
});
