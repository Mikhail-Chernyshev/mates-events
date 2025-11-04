import { GlassButton } from '@/components/ui/glass-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  visible,
  onClose,
}: ForgotPasswordModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      alert('Введите email');
      return;
    }

    setIsLoading(true);
    // Заглушка для отправки письма
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  const handleClose = () => {
    setEmail('');
    setIsSent(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Восстановление пароля
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <IconSymbol
                  name='xmark'
                  size={24}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            {!isSent ? (
              <>
                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                >
                  Введите email, на который зарегистрирован ваш аккаунт. Мы
                  отправим инструкции для восстановления пароля.
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

                {/* Send Button */}
                <GlassButton
                  title={isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  onPress={handleSendReset}
                  variant='primary'
                  size='large'
                  style={styles.sendButton}
                  disabled={isLoading}
                />
              </>
            ) : (
              <>
                {/* Success State */}
                <View style={styles.successContainer}>
                  <View
                    style={[
                      styles.successIcon,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <IconSymbol name='checkmark' size={32} color='#FFFFFF' />
                  </View>
                  <Text style={[styles.successTitle, { color: colors.text }]}>
                    Письмо отправлено!
                  </Text>
                  <Text
                    style={[
                      styles.successDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Проверьте почту {email} и следуйте инструкциям для
                    восстановления пароля.
                  </Text>
                </View>

                <GlassButton
                  title='Понятно'
                  onPress={handleClose}
                  variant='primary'
                  size='large'
                  style={styles.closeSuccessButton}
                />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    zIndex: 10000,
    elevation: 10000,
  },
  modalContainer: {
    padding: Spacing.xl,
    zIndex: 10001,
    elevation: 10001,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
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
  sendButton: {
    marginBottom: Spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  closeSuccessButton: {
    marginTop: Spacing.lg,
  },
});
