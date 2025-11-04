import { CustomMarker } from '@/components/ui/custom-marker';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Linking from 'expo-linking';
import React from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  distance: string;
  lat: number;
  lng: number;
}

interface FriendDetailsModalProps {
  friend: Friend | null;
  visible: boolean;
  onClose: () => void;
  onMessageFriend?: (friend: Friend) => void;
  onNavigateToFriend?: (friend: Friend) => void;
  onCallFriend?: (friend: Friend) => void;
}

export function FriendDetailsModal({
  friend,
  visible,
  onClose,
  onMessageFriend,
  onNavigateToFriend,
  onCallFriend,
}: FriendDetailsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!friend) return null;

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

  const handleMessageFriend = () => {
    onMessageFriend?.(friend);
  };

  const handleNavigateToFriend = async () => {
    try {
      const { lat, lng } = friend;

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
      onNavigateToFriend?.(friend);
      onClose();
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось открыть маршрут. Проверьте, установлено ли приложение Google Maps.'
      );
      console.error('Error opening Google Maps:', error);
    }
  };

  const handleCallFriend = () => {
    onCallFriend?.(friend);
  };

  const getStatusIcon = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'circle.fill';
      case 'away':
        return 'clock.fill';
      case 'offline':
        return 'circle';
      default:
        return 'circle';
    }
  };

  // Вычисляем максимальную высоту карты
  const screenHeight = Dimensions.get('window').height;
  const mapHeight = screenHeight * 0.35; // 55% высоты экрана для максимального размера

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
              Профиль друга
            </Text>
            <TouchableOpacity
              onPress={handleCallFriend}
              style={styles.callButton}
            >
              <IconSymbol name='phone' size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Friend Header */}
          <GlassContainer style={styles.friendHeader} variant='elevated'>
            <View style={styles.profileSection}>
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
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, { color: colors.text }]}>
                  {friend.name}
                </Text>
                <View style={styles.statusContainer}>
                  <IconSymbol
                    name={getStatusIcon(friend.status)}
                    size={12}
                    color={getStatusColor(friend.status)}
                  />
                  <Text
                    style={[
                      styles.friendStatus,
                      { color: getStatusColor(friend.status) },
                    ]}
                  >
                    {getStatusText(friend.status)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.friendDistance,
                    { color: colors.textTertiary },
                  ]}
                >
                  📍 {friend.distance}
                </Text>
                <View style={styles.detailRow}>
                  {' '}
                  <IconSymbol name='clock' size={20} color={colors.primary} />
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {friend.status === 'online'
                        ? 'Сейчас'
                        : friend.status === 'away'
                        ? '15 минут назад'
                        : '2 часа назад'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </GlassContainer>

          {/* Map Preview */}
          <GlassContainer style={styles.mapContainer} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Расположение на карте
            </Text>
            <View style={[styles.mapPreview, { height: mapHeight }]}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={{
                  latitude: friend.lat,
                  longitude: friend.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                mapType='standard'
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: friend.lat,
                    longitude: friend.lng,
                  }}
                >
                  <CustomMarker
                    text={friend.name.split(' ')[0][0]}
                    type='friend'
                    status={friend.status}
                  />
                </Marker>
              </MapView>
            </View>
          </GlassContainer>

          {/* Actions */}
          <GlassContainer style={styles.actionsContainer} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Действия
            </Text>

            <View style={styles.actionsGrid}>
              <GlassButton
                title='Написать'
                onPress={handleMessageFriend}
                variant='primary'
                size='medium'
                icon={<IconSymbol name='message' size={16} color='#FFFFFF' />}
                style={styles.actionButton}
              />

              <GlassButton
                title='Маршрут'
                onPress={handleNavigateToFriend}
                variant='ghost'
                size='medium'
                icon={
                  <IconSymbol
                    name='location'
                    size={16}
                    color={colors.primary}
                  />
                }
                style={styles.actionButton}
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
  callButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  friendHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  friendStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
  friendDistance: {
    fontSize: 14,
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
    // marginLeft: 0,
  },
  mapContainer: {
    marginBottom: Spacing.sm,
  },
  mapPreview: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
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
