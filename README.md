# Mecenate — Feed (Test Assignment)

Экран ленты публикаций для платформы Mecenate (аналог Patreon/Boosty). React Native + Expo, iOS и Android.

## Стек

- **TypeScript** (strict)
- **Expo SDK 54** + **expo-router** (file-based routing)
- **React Query** (`@tanstack/react-query`) — server state, курсорная пагинация, мутации
- **MobX** + **mobx-react-lite** — auth-токен, UI-настройки
- **axios** + **AsyncStorage** — HTTP-клиент и персист UUID-токена
- **expo-image** — кешированные изображения с placeholder'ами

## Запуск

```bash
npm install --legacy-peer-deps
npx expo start
```

Отсканируй QR приложением **Expo Go** (iOS/Android). Или нажми `i` / `a` для запуска в симуляторе.

### Переменные окружения

Создай `.env` (см. `.env.example`):

```
EXPO_PUBLIC_API_URL=https://k8s.mectest.ru/test-app
```

Параметр опциональный — дефолт уже зашит.

## Что реализовано

- **Feed** с курсорной пагинацией (`useInfiniteQuery`, `onEndReached`).
- **Pull-to-refresh** (`RefreshControl` + `refetch`).
- **Закрытые посты** (`tier === 'paid'`) — заглушка «Доступно подписчикам».
- **Ошибка API** — экран «Не удалось загрузить публикации» + кнопка «Повторить».
- **Лайки** с оптимистичным апдейтом кеша RQ (откат при ошибке).
- **Auth**: UUID генерируется один раз, сохраняется в AsyncStorage, подставляется как `Bearer` axios-интерсептором.
- **Design tokens**: `src/theme/tokens.ts` — цвета, spacing, radii, typography.
- **Скелетон** первой загрузки, подвал-лоадер при подгрузке страниц.

## Структура

```
app/
  _layout.tsx          # AppProviders + Stack
  index.tsx            # Feed screen
src/
  api/                 # axios client, posts, types (TS-модели по Swagger)
  hooks/               # useFeed, useLikePost
  stores/              # AuthStore, UIStore, RootStore, context
  components/
    feed/              # PostCard, AuthorHeader, PaidPostLock, FeedErrorState, FeedFooter, FeedSkeleton
    ui/                # Avatar, IconCounter
  theme/               # tokens, ThemeProvider
  providers/           # AppProviders (QueryClient + Stores + Theme)
  utils/               # formatDate, formatCount
```

## API

Базовый URL: `https://k8s.mectest.ru/test-app`. Swagger: `/openapi.json`. Авторизация — `Authorization: Bearer <uuid>`.

Используемые эндпоинты:
- `GET /posts?limit&cursor&tier&simulate_error` — лента с курсорной пагинацией.
- `POST /posts/{id}/like` — тогл лайка.

## Проверка вручную

- **Пагинация**: скролл вниз — подгружаются новые посты, в URL уходит `cursor=…`.
- **Pull-to-refresh**: тяни список вниз — данные перезапрашиваются.
- **Paid-пост**: среди постов встречается `tier: "paid"` → заглушка вместо текста.
- **Ошибка API**: выключи сеть → экран ошибки с кнопкой «Повторить».
- **Лайк**: тап по сердцу — счётчик меняется мгновенно; при ошибке откатывается.

## Скрипты

- `npm start` — dev-server Expo.
- `npm run ios` / `npm run android` — запуск в симуляторе.
- `npm run typecheck` — `tsc --noEmit`.
