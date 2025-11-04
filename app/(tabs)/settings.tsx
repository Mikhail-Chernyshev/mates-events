import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username || 'user123');

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  const handleSaveUsername = () => {
    if (username.trim().length < 3) {
      Alert.alert(
        'Ошибка',
        'Имя пользователя должно содержать минимум 3 символа'
      );
      return;
    }

    // Здесь можно добавить API вызов для сохранения username
    Alert.alert('Успех', `Имя пользователя изменено на: ${username}`);
    setIsEditingUsername(false);
  };

  const handleCancelEdit = () => {
    setUsername(user?.username || 'user123');
    setIsEditingUsername(false);
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Сброс пароля',
      'На вашу почту будет отправлена ссылка для сброса пароля',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: () =>
            Alert.alert('Успех', 'Письмо отправлено на вашу почту'),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти из аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const formatEmail = (email: string) => {
    // Маскируем email для безопасности
    const [localPart, domain] = email.split('@');
    const maskedLocal =
      localPart.length > 2
        ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
        : localPart;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <GlassContainer style={styles.header} variant='elevated'>
        <Text style={[styles.title, { color: colors.text }]}>Настройки</Text>
      </GlassContainer>

      {/* Profile Section */}
      <GlassContainer style={styles.profileSection} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Профиль
        </Text>

        {/* Avatar and Greeting */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'U'}
            </Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Привет, {user?.name || 'Пользователь'}! 👋
            </Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              Добро пожаловать в MatesEvents
            </Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <IconSymbol name='envelope' size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.email ? formatEmail(user.email) : 'user@example.com'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name='person' size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Имя пользователя
              </Text>
              {isEditingUsername ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={[
                      styles.usernameInput,
                      {
                        color: colors.text,
                        borderColor: colors.primary,
                        backgroundColor: colors.surface,
                      },
                    ]}
                    value={username}
                    onChangeText={setUsername}
                    autoFocus
                    autoCapitalize='none'
                    autoCorrect={false}
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      onPress={handleSaveUsername}
                      style={[
                        styles.editButton,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <IconSymbol name='checkmark' size={16} color='#FFFFFF' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      style={[
                        styles.editButton,
                        { backgroundColor: colors.textTertiary },
                      ]}
                    >
                      <IconSymbol name='xmark' size={16} color='#FFFFFF' />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.usernameContainer}>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    @{username}
                  </Text>
                  <TouchableOpacity
                    onPress={handleEditUsername}
                    style={styles.editIconButton}
                  >
                    <IconSymbol
                      name='pencil'
                      size={16}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </GlassContainer>

      {/* Account Actions */}
      <GlassContainer style={styles.actionsSection} variant='elevated'>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Управление аккаунтом
        </Text>

        <View style={styles.actionsList}>
          <TouchableOpacity
            style={[styles.actionItem, { borderBottomColor: colors.surface }]}
            onPress={handleResetPassword}
          >
            <View style={styles.actionContent}>
              <IconSymbol name='key' size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Сброс пароля
              </Text>
            </View>
            <IconSymbol
              name='chevron.right'
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { borderBottomColor: colors.surface }]}
            onPress={() => Alert.alert('Уведомления', 'Настройки уведомлений')}
          >
            <View style={styles.actionContent}>
              <IconSymbol name='bell' size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Уведомления
              </Text>
            </View>
            <IconSymbol
              name='chevron.right'
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { borderBottomColor: colors.surface }]}
            onPress={() => Alert.alert('Приватность', 'Настройки приватности')}
          >
            <View style={styles.actionContent}>
              <IconSymbol name='lock' size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Приватность
              </Text>
            </View>
            <IconSymbol
              name='chevron.right'
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('О приложении', 'MatesEvents v1.0.0')}
          >
            <View style={styles.actionContent}>
              <IconSymbol name='info.circle' size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                О приложении
              </Text>
            </View>
            <IconSymbol
              name='chevron.right'
              size={16}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </GlassContainer>

      {/* Logout Section */}
      <GlassContainer style={styles.logoutSection} variant='elevated'>
        <GlassButton
          title='Выйти из аккаунта'
          onPress={handleLogout}
          variant='ghost'
          size='large'
          icon={
            <IconSymbol
              name='rectangle.portrait.and.arrow.right'
              size={18}
              color={colors.error || '#FF6B6B'}
            />
          }
          style={[
            styles.logoutButton,
            { borderColor: colors.error || '#FF6B6B' },
          ]}
        />
      </GlassContainer>
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
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileSection: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: 14,
  },
  userInfo: {
    gap: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIconButton: {
    padding: Spacing.xs,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  usernameInput: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsSection: {
    margin: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionsList: {
    gap: Spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    marginLeft: Spacing.md,
  },
  logoutSection: {
    margin: Spacing.md,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
});
