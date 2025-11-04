import { GlassButton } from '@/components/ui/glass-button';
import { GlassContainer } from '@/components/ui/glass-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, EventCategories, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

export interface CreateEventData {
  title: string;
  description: string;
  eventType: 'commercial' | 'casual';
  date: Date;
  time: Date;
  location: string;
  lat?: number;
  lng?: number;
}

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateEvent?: (eventData: CreateEventData) => void;
}

export function CreateEventModal({
  visible,
  onClose,
  onCreateEvent,
}: CreateEventModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<'commercial' | 'casual'>(
    'casual'
  );
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название события');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Ошибка', 'Выберите место проведения');
      return;
    }

    // Парсим дату и время из строк, если они введены
    let eventDate = date;
    let eventTime = time;

    if (dateInput.trim()) {
      const parsedDate = new Date(dateInput);
      if (!isNaN(parsedDate.getTime())) {
        eventDate = parsedDate;
      }
    }

    if (timeInput.trim()) {
      const [hours, minutes] = timeInput.split(':');
      if (hours && minutes) {
        const parsedTime = new Date();
        parsedTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        eventTime = parsedTime;
      }
    }

    onCreateEvent?.({
      title: title.trim(),
      description: description.trim(),
      eventType,
      date: eventDate,
      time: eventTime,
      location: location.trim(),
    });

    // Сброс формы
    setTitle('');
    setDescription('');
    setLocation('');
    setDateInput('');
    setTimeInput('');
    setEventType('casual');
    setDate(new Date());
    setTime(new Date());
    onClose();
  };

  const handleSelectLocation = () => {
    // Заглушка для выбора места через Google Maps
    Alert.alert(
      'Выбор места',
      'Здесь откроется карта для выбора места проведения события',
      [
        {
          text: 'Использовать текущее место',
          onPress: () => {
            // Заглушка - в реальности получим координаты
            setLocation('Москва, Красная площадь, 1');
          },
        },
        {
          text: 'Ввести вручную',
          onPress: () => {
            Alert.prompt(
              'Введите адрес',
              'Введите адрес места проведения',
              (text) => {
                if (text) setLocation(text);
              }
            );
          },
        },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
              Создать событие
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Type Selection */}
          <GlassContainer style={styles.section} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Тип события
            </Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  eventType === 'casual' && styles.typeButtonActive,
                  {
                    backgroundColor:
                      eventType === 'casual'
                        ? colors.primary + '20'
                        : 'transparent',
                    borderColor:
                      eventType === 'casual'
                        ? colors.primary
                        : colors.surface,
                  },
                ]}
                onPress={() => setEventType('casual')}
              >
                <IconSymbol
                  name='coffee'
                  size={20}
                  color={
                    eventType === 'casual'
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color:
                        eventType === 'casual'
                          ? colors.primary
                          : colors.textSecondary,
                      fontWeight: eventType === 'casual' ? '600' : '500',
                    },
                  ]}
                >
                  Неформальное
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  eventType === 'commercial' && styles.typeButtonActive,
                  {
                    backgroundColor:
                      eventType === 'commercial'
                        ? colors.secondary + '20'
                        : 'transparent',
                    borderColor:
                      eventType === 'commercial'
                        ? colors.secondary
                        : colors.surface,
                  },
                ]}
                onPress={() => setEventType('commercial')}
              >
                <IconSymbol
                  name='briefcase'
                  size={20}
                  color={
                    eventType === 'commercial'
                      ? colors.secondary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    {
                      color:
                        eventType === 'commercial'
                          ? colors.secondary
                          : colors.textSecondary,
                      fontWeight: eventType === 'commercial' ? '600' : '500',
                    },
                  ]}
                >
                  Коммерческое
                </Text>
              </TouchableOpacity>
            </View>
          </GlassContainer>

          {/* Title */}
          <GlassContainer style={styles.section} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Название события *
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.glassBorder },
              ]}
              placeholder='Введите название события'
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </GlassContainer>

          {/* Location */}
          <GlassContainer style={styles.section} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Место проведения *
            </Text>
            <TouchableOpacity
              style={[
                styles.locationButton,
                { borderColor: colors.glassBorder },
              ]}
              onPress={handleSelectLocation}
            >
              {location ? (
                <View style={styles.locationContent}>
                  <IconSymbol
                    name='location.fill'
                    size={20}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.locationText, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {location}
                  </Text>
                </View>
              ) : (
                <View style={styles.locationContent}>
                  <IconSymbol
                    name='location'
                    size={20}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.locationPlaceholder,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Выберите место на карте
                  </Text>
                </View>
              )}
              <IconSymbol
                name='chevron.right'
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </GlassContainer>

          {/* Date and Time */}
          <GlassContainer style={styles.section} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Дата и время
            </Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeInputWrapper}>
                <IconSymbol
                  name='calendar'
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  style={[
                    styles.dateTimeInput,
                    { color: colors.text, borderColor: colors.glassBorder },
                  ]}
                  placeholder={formatDate(date)}
                  placeholderTextColor={colors.textTertiary}
                  value={dateInput}
                  onChangeText={setDateInput}
                />
              </View>

              <View style={styles.dateTimeInputWrapper}>
                <IconSymbol name='clock' size={20} color={colors.textTertiary} />
                <TextInput
                  style={[
                    styles.dateTimeInput,
                    { color: colors.text, borderColor: colors.glassBorder },
                  ]}
                  placeholder={formatTime(time)}
                  placeholderTextColor={colors.textTertiary}
                  value={timeInput}
                  onChangeText={setTimeInput}
                  placeholder='ЧЧ:ММ'
                />
              </View>
            </View>
            <Text style={[styles.hintText, { color: colors.textTertiary }]}>
              Формат даты: ДД.ММ.ГГГГ или используйте текущую дату
            </Text>
          </GlassContainer>

          {/* Description */}
          <GlassContainer style={styles.section} variant='elevated'>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Описание
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { color: colors.text, borderColor: colors.glassBorder },
              ]}
              placeholder='Расскажите о событии...'
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical='top'
            />
          </GlassContainer>

          {/* Create Button */}
          <View style={styles.createButtonContainer}>
            <GlassButton
              title='Создать событие'
              onPress={handleCreate}
              variant='primary'
              size='large'
              style={styles.createButton}
            />
          </View>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  typeButtonActive: {
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
  },
  locationPlaceholder: {
    fontSize: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateTimeInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dateTimeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    marginTop: Spacing.sm,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    minHeight: 100,
  },
  createButtonContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  createButton: {
    width: '100%',
  },
});
