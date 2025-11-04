import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFriend?: (user: User) => void;
}

export function AddFriendModal({
  visible,
  onClose,
  onAddFriend,
}: AddFriendModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock данные для поиска
  const mockUsers: User[] = [
    {
      id: 'pipka123',
      username: 'Pipka',
      email: 'pipka@example.com',
      name: 'Пипка Тестович',
      isOnline: true,
    },
    {
      id: 'user456',
      username: 'TestUser',
      email: 'test@yandex.ru',
      name: 'Тестовый Пользователь',
      isOnline: false,
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Имитация задержки поиска
    setTimeout(() => {
      const query = searchQuery.trim().toLowerCase();

      // Поиск по username (без @) или email
      const foundUsers = mockUsers.filter((user) => {
        const username = user.username.toLowerCase();
        const email = user.email.toLowerCase();

        return (
          username.includes(query) ||
          email.includes(query) ||
          (query.startsWith('@') && username.includes(query.slice(1)))
        );
      });

      setSearchResults(foundUsers);
      setIsSearching(false);
    }, 800);
  };

  const handleAddFriend = (user: User) => {
    onAddFriend?.(user);
    // Сброс состояния после добавления
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
    onClose();
  };

  const isValidInput = (input: string) => {
    const trimmed = input.trim();
    return (
      trimmed.length > 0 &&
      (trimmed.includes('@') || // email
        /^@?[a-zA-Z0-9_]+$/.test(trimmed)) // username с @ или без
    );
  };

  const renderUserCard = (user: User) => (
    <GlassContainer style={styles.userCard} variant='elevated'>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.userUsername, { color: colors.textSecondary }]}>
            @{user.username}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textTertiary }]}>
            {user.email}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: user.isOnline ? '#4CAF50' : '#9E9E9E' },
              ]}
            />
            <Text style={[styles.statusText, { color: colors.textTertiary }]}>
              {user.isOnline ? 'В сети' : 'Не в сети'}
            </Text>
          </View>
        </View>
      </View>
      <GlassButton
        title='Добавить'
        onPress={() => handleAddFriend(user)}
        variant='primary'
        size='small'
        icon={<IconSymbol name='person.badge.plus' size={16} color='#FFFFFF' />}
      />
    </GlassContainer>
  );

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name='xmark' size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Добавить друга
            </Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Search Input */}
        <GlassContainer style={styles.searchContainer} variant='elevated'>
          <Text style={[styles.searchLabel, { color: colors.text }]}>
            Найдите друга по имени пользователя или email
          </Text>

          <View
            style={[styles.inputContainer, { backgroundColor: colors.surface }]}
          >
            <IconSymbol
              name='magnifyingglass'
              size={20}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder='@username или email@example.com'
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
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

          <GlassButton
            title={isSearching ? 'Поиск...' : 'Найти'}
            onPress={handleSearch}
            variant='primary'
            size='large'
            disabled={!isValidInput(searchQuery) || isSearching}
            icon={
              isSearching ? (
                <IconSymbol name='hourglass' size={18} color='#FFFFFF' />
              ) : (
                <IconSymbol name='magnifyingglass' size={18} color='#FFFFFF' />
              )
            }
            style={styles.searchButton}
          />
        </GlassContainer>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {isSearching && (
            <View style={styles.loadingContainer}>
              <IconSymbol
                name='hourglass'
                size={32}
                color={colors.textTertiary}
              />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Поиск пользователей...
              </Text>
            </View>
          )}

          {!isSearching && hasSearched && searchResults.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol
                name='person.crop.circle.badge.xmark'
                size={48}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Пользователь не найден
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                Проверьте правильность введенных данных
              </Text>
            </View>
          )}

          {!isSearching && searchResults.length > 0 && (
            <View style={styles.resultsList}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                Найдено пользователей: {searchResults.length}
              </Text>
              {searchResults.map((user) => (
                <View key={user.id} style={styles.resultItem}>
                  {renderUserCard(user)}
                </View>
              ))}
            </View>
          )}

          {!hasSearched && !isSearching && (
            <View style={styles.initialState}>
              <IconSymbol
                name='person.2.circle'
                size={48}
                color={colors.textTertiary}
              />
              <Text
                style={[styles.initialText, { color: colors.textSecondary }]}
              >
                Введите имя пользователя или email для поиска
              </Text>
            </View>
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
  searchContainer: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: Spacing.md,
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
  searchButton: {
    marginBottom: 0,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    fontSize: 16,
    marginTop: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  initialText: {
    fontSize: 16,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  resultItem: {
    marginBottom: Spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: 12,
  },
});
