import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({
  onNavigateToLogin,
}: RegisterScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
    } catch (error) {
      alert('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    onNavigateToLogin();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Регистрация
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Создайте аккаунт для доступа ко всем функциям
            </Text>
          </View>

          {/* Register Form */}
          <GlassContainer style={styles.formContainer} variant='elevated'>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Создать аккаунт
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: colors.glassBorder },
                ]}
              >
                <IconSymbol
                  name='envelope'
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder='Введите email'
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Пароль
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: colors.glassBorder },
                ]}
              >
                <IconSymbol name='lock' size={20} color={colors.textTertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder='Введите пароль'
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <IconSymbol
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Подтвердите пароль
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: colors.glassBorder },
                ]}
              >
                <IconSymbol name='lock' size={20} color={colors.textTertiary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder='Подтвердите пароль'
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <IconSymbol
                    name={showConfirmPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <GlassButton
              title={isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              onPress={handleRegister}
              variant='primary'
              size='large'
              style={styles.registerButton}
              disabled={isLoading}
            />

            {/* Login Link */}
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.linkContainer}
            >
              <Text style={[styles.linkText, { color: colors.textTertiary }]}>
                Уже есть аккаунт?
                <Text style={[styles.linkTextBold, { color: colors.primary }]}>
                  {' '}
                  Войти
                </Text>
              </Text>
            </TouchableOpacity>
          </GlassContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    padding: Spacing.xl,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  registerButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: '600',
  },
});
