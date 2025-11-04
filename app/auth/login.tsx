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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onShowForgotPassword: () => void;
}

export default function LoginScreen({
  onNavigateToRegister,
  onShowForgotPassword,
}: LoginScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      alert('Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    onNavigateToRegister();
  };

  const handleForgotPassword = () => {
    onShowForgotPassword();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            MatesEvents
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ваша социальная сеть с картой и событиями
          </Text>
        </View>

        {/* Login Form */}
        <GlassContainer style={styles.formContainer} variant='elevated'>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Вход в аккаунт
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Email
            </Text>
            <View
              style={[styles.inputWrapper, { borderColor: colors.glassBorder }]}
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
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Пароль
            </Text>
            <View
              style={[styles.inputWrapper, { borderColor: colors.glassBorder }]}
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

          {/* Login Button */}
          <GlassButton
            title={isLoading ? 'Вход...' : 'Войти'}
            onPress={handleLogin}
            variant='primary'
            size='large'
            style={styles.loginButton}
            disabled={isLoading}
          />

          {/* Register Link */}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.linkContainer}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Регистрация
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotContainer}
          >
            <Text style={[styles.forgotText, { color: colors.textTertiary }]}>
              Забыли пароль?
            </Text>
          </TouchableOpacity>
        </GlassContainer>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 32,
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
    fontSize: 24,
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
  loginButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  forgotContainer: {
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
  },
});
