# Настройка Google Maps для MatesEvents

## Шаги для интеграции Google Maps:

### 1. Получение API ключа Google Maps

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите следующие API:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API** (для поиска мест)
   - **Directions API** (для маршрутов)

### 2. Создание API ключей

#### Для Android:

1. Перейдите в "Credentials" → "Create Credentials" → "API Key"
2. Ограничьте ключ для Android приложений
3. Добавьте SHA-1 fingerprint вашего приложения

#### Для iOS:

1. Создайте отдельный API ключ для iOS
2. Ограничьте ключ для iOS приложений
3. Добавьте Bundle ID вашего приложения

### 3. Настройка в приложении

Замените `YOUR_GOOGLE_MAPS_API_KEY` в файле `app.json` на ваши реальные API ключи:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

### 4. Установка зависимостей

```bash
npm install react-native-maps
```

### 5. Настройка для Expo

Если используете Expo, добавьте в `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Это приложение использует геолокацию для показа вашего местоположения на карте."
        }
      ]
    ]
  }
}
```

### 6. Разрешения

Добавьте в `app.json` разрешения для геолокации:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Это приложение использует геолокацию для показа вашего местоположения на карте."
      }
    },
    "android": {
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    }
  }
}
```

## Функциональность

После настройки в приложении будет доступно:

- ✅ **Настоящая Google Maps** вместо placeholder
- ✅ **Маркеры друзей** с цветовой индикацией статуса
- ✅ **Геолокация пользователя** (синяя точка)
- ✅ **Кнопка "Мое местоположение"** для центрирования карты
- ✅ **Интерактивные маркеры** с информацией о друзьях
- ✅ **Плавная анимация** при перемещении по карте

## Безопасность

⚠️ **Важно**: Не коммитьте API ключи в репозиторий! Используйте переменные окружения:

```bash
# .env
GOOGLE_MAPS_ANDROID_API_KEY=your_android_key
GOOGLE_MAPS_IOS_API_KEY=your_ios_key
```
