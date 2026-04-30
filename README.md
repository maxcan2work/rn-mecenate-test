# Mecenate App

React Native + Expo приложение для ленты постов Mecenate с бесплатным/платным контентом, деталями поста, лайками и комментариями.

## Быстрый просмотр

Актуальная версия опубликована через **EAS Update**.

1. Установи [Expo Go](https://expo.dev/go).
2. Открой preview-ссылку с телефона:
   <https://expo.dev/preview/update?message=v2.0&updateRuntimeVersion=2.0.1&createdAt=2026-04-30T01%3A25%3A12.844Z&slug=exp&projectId=e5931f70-f802-498f-b93d-ef7a5cf30914&group=1be9ca07-83cf-4eb9-8bb6-906c01b2257b>
3. Или сканируй QR:

<p align="center">
  <img src="./assets/eas-update-qr.svg" alt="EAS Update QR" width="260" />
</p>

Deep link для Expo Go:

```text
exp://u.expo.dev/e5931f70-f802-498f-b93d-ef7a5cf30914/group/1be9ca07-83cf-4eb9-8bb6-906c01b2257b
```

## Стек

- **Expo SDK 54**, **React Native 0.81**, **React 19**, **TypeScript**
- **expo-router** для роутинга
- **@tanstack/react-query** для server state, пагинации и мутаций
- **MobX** для клиентского UI/auth state
- **axios** + **AsyncStorage** для API-клиента и persisted UUID-токена
- **expo-image** для изображений
- **react-native-reanimated** для анимаций лайка, кнопки отправки и shimmer
- **expo-haptics** + Android `Vibration` fallback для haptic feedback
- **expo-blur** для платных постов
- **react-native-svg** для иконок

## Запуск

```bash
npm install
npx expo start
```

Проверка типов:

```bash
npm run typecheck
```

### API

Дефолтный API уже задан в `src/api/client.ts`.

```bash
EXPO_PUBLIC_API_URL=https://k8s.mectest.ru/test-app
```

Auth-токен генерируется на клиенте как UUID, сохраняется в AsyncStorage и отправляется как `Authorization: Bearer <uuid>`.

## Что реализовано

- Лента постов с cursor-пагинацией, pull-to-refresh и footer-loader.
- Фильтр ленты по категориям: все, бесплатные, платные.
- Haptic feedback на лайки, комментарии, отправку комментария, донат и переключение категорий/сортировки.
- Карточка поста с автором, обложкой, текстом, лайками и количеством комментариев.
- Платные посты без перехода в детали: изображение сильно заблюрено через `expo-blur`, поверх blackout, `MoneyIcon`, текст о скрытом контенте и кнопка доната.
- Для платных постов title/body скрыты shimmer-плейсхолдерами.
- Детальный экран поста с динамическим заголовком в кастомном `AppNavBar`.
- Комментарии вынесены в отдельный список, подгружаются по страницам, сортируются через повторную загрузку первой страницы.
- Поле ввода комментария вынесено в `CommentComposer`, отправляет комментарий на backend.
- Универсальный `KeyboardLiftView` поднимает composer над клавиатурой.
- Real-time обновления через WebSocket: лайки и новые комментарии попадают в React Query cache.
- Централизованные дизайн-токены в `src/theme/tokens.ts`.

## Сборки и updates

Опубликовать OTA update:

```bash
eas update --branch preview --message "v2.0"
```

Собрать preview-билды:

```bash
eas build --platform all --profile preview
```

Android preview отдаёт `.apk`. iOS preview отдаёт `.ipa`, но для него нужны Apple Developer credentials.

Последний Android APK:

```text
https://expo.dev/artifacts/eas/nwJhJatoWSSxBkeXVhAKSN.apk
```

Важно: `eas update` обновляет только JS/assets. Нативные изменения вроде `softwareKeyboardLayoutMode`, permissions, новых native dependencies и runtimeVersion требуют нового `eas build`.

## Структура

```text
app/
  _layout.tsx              # root layout, шрифты, providers, Stack
  index.tsx                # экран ленты
  posts/[id].tsx           # детальный экран поста
assets/
  eas-update-qr.svg        # QR актуального EAS Update
src/
  api/
    client.ts              # axios instance + Bearer interceptor
    posts.ts               # posts/comments API
    cache.ts               # helpers для обновления React Query cache
    queryKeys.ts
    types.ts
  components/
    icons/
      CommentIcon.tsx
      HeartIcon.tsx
      MoneyIcon.tsx
    feed/
      FeedFilterTabs.tsx
      PostCard.tsx
      FeedSkeleton.tsx
      FeedErrorState.tsx
    post/
      AnimatedLikeButton.tsx
      CommentComposer.tsx
      CommentItem.tsx
      PaidPostCoverOverlay.tsx
      PaidPostTextPlaceholder.tsx
      PostCommentsList.tsx
    ui/
      ActionCounterButton.tsx
      AppNavBar.tsx
      Avatar.tsx
      KeyboardLiftView.tsx
      ShimmerPlaceholder.tsx
  hooks/
    useAddComment.ts
    useComments.ts
    useFeed.ts
    useLikePost.ts
    usePost.ts
    useRealtimePosts.ts
  stores/
    AuthStore.ts
    UIStore.ts
  theme/
    tokens.ts
    ThemeProvider.tsx
  utils/
    formatDate.ts
    haptics.ts
```

## Скрипты

- `npm start` / `npx expo start` — dev-server.
- `npm run ios` — запуск на iOS simulator.
- `npm run android` — запуск на Android emulator.
- `npm run typecheck` — TypeScript check.
