# Mecenate — Feed (Test Assignment)

Экран ленты публикаций для платформы Mecenate (аналог Patreon/Boosty). React Native + Expo, iOS и Android.

## Быстрый просмотр (без локальной сборки)

Приложение опубликовано через **EAS Update**. Чтобы открыть:

1. Установи [**Expo Go**](https://expo.dev/go) (App Store / Google Play).
2. Сканируй QR ниже (iOS — камерой, Android — сканером в Expo Go).

<p align="center">
  <img src="./assets/eas-update-qr.svg" alt="EAS Update QR" width="260" />
</p>

Либо открой страницу проекта и возьми QR оттуда: <https://expo.dev/accounts/realmizzer/projects/mecenate-app>.

## Стек

- **TypeScript** (strict)
- **Expo SDK 54** + **expo-router** (file-based routing)
- **React Query** (`@tanstack/react-query`) — server state, курсорная пагинация, оптимистичные мутации
- **MobX** + **mobx-react-lite** — auth-токен, UI-настройки (клиентский стейт)
- **axios** + **AsyncStorage** — HTTP-клиент, персист UUID-токена
- **expo-image** — кешированные изображения
- **react-native-svg** — иконки лайка и комментария
- **react-native-safe-area-context** — safe area

## Запуск

```bash
npm install --legacy-peer-deps
npx expo start
```

> `--legacy-peer-deps` нужен из-за несовпадения peer-dep версий React 19 в зависимостях expo-router (внутренние transitive deps @radix-ui/react-navigation-menu).

### Переменные окружения

```
EXPO_PUBLIC_API_URL=https://k8s.mectest.ru/test-app
```

Параметр опциональный — дефолт уже зашит в `src/api/client.ts`. См. `.env.example`.

## Что реализовано

- **Лента постов** с курсорной пагинацией (`useInfiniteQuery`, `onEndReached`, `hasMore` / `nextCursor`).
- **Pull-to-refresh** (`RefreshControl` + `refetch`).
- **Paid-посты** (`tier === 'paid'`) — заглушка «Доступно подписчикам» вместо тела.
- **Экран ошибки** — маскот + «Не удалось загрузить публикации» + кнопка «Повторить» (при попытке — спиннер в кнопке, под заголовком — причина ошибки).
- **Скелетон** первой загрузки, повторяющий геометрию реальной карточки (без «прыжка» при переходе).
- **Футер-лоадер** при подгрузке следующих страниц.
- **Лайки** — оптимистичный апдейт кеша RQ, откат при ошибке. В liked-состоянии чип меняет фон на `#FF2B75`, сердце заливается `#FFEAF1`.
- **Auth**: UUID генерируется при первом запуске, сохраняется в AsyncStorage (`@react-native-async-storage`), подставляется как `Bearer` axios-интерсептором. Перезапуск приложения — токен тот же, серверный стейт (лайки) сохраняется.
- **Design tokens**: централизованы в `src/theme/tokens.ts` (цвета, spacing, radii, typography), пробрасываются через `ThemeProvider`.

## Структура

```
app/
  _layout.tsx              # expo-router root: шрифты + AppProviders + Stack
  index.tsx                # Feed screen (observer)
assets/
  mascot.png               # маскот аксолотля для экрана ошибки
src/
  api/
    client.ts              # axios instance + Bearer interceptor + unwrap envelope
    posts.ts               # getPosts, likePost, getComments, addComment
    types.ts               # Post, Author, PostsResponse, ApiEnvelope<T>
  hooks/
    useFeed.ts             # useInfiniteQuery с курсором
    useLikePost.ts         # useMutation + optimistic update кеша
  stores/
    AuthStore.ts           # UUID + AsyncStorage persistence
    UIStore.ts             # tier-фильтр, simulateError-тогл
    RootStore.ts + context # Provider + useStores()
  providers/
    AppProviders.tsx       # QueryClient + Stores + Theme + SafeAreaProvider
  components/
    icons/
      HeartIcon.tsx        # outline/filled сердце
      CommentIcon.tsx      # облачко коммента
    feed/
      PostCard.tsx         # карточка поста
      AuthorHeader.tsx     # аватар + имя
      PaidPostLock.tsx     # заглушка paid
      FeedErrorState.tsx   # экран ошибки с маскотом
      FeedSkeleton.tsx     # плейсхолдер первой загрузки
      FeedFooter.tsx       # лоадер подгрузки
    ui/
      Avatar.tsx           # аватар с инициалами-fallback
      IconCounter.tsx      # чип с иконкой + счётчиком (лайк/коммент)
  theme/
    tokens.ts              # цвета, spacing, radii, typography, fontFamily
    ThemeProvider.tsx
  utils/
    formatDate.ts          # relative дата, formatCount
```

## API

- Base URL: `https://k8s.mectest.ru/test-app`
- Swagger: `/openapi.json`
- Auth: `Authorization: Bearer <uuid>`

Все ответы обёрнуты в envelope:
```json
{ "ok": true,  "data": { /* payload */ } }
{ "ok": false, "error": { "code": "...", "message": "..." } }
```

В `src/api/posts.ts` payload разворачивается хелпером `unwrap()` — наверх отдаются «чистые» модели.

Используемые эндпоинты:
- `GET /posts?limit&cursor&tier&simulate_error` — лента с курсорной пагинацией (поле ответа: `posts`, `nextCursor`, `hasMore`).
- `POST /posts/{id}/like` — тогл лайка (возвращает `isLiked`, `likesCount`).

## Проверка вручную

- **Пагинация**: скролл вниз → в URL уходит `cursor=…`, приходят новые посты.
- **Pull-to-refresh**: тянем список вниз → данные перезапрашиваются с первого курсора.
- **Paid-пост**: среди постов встречается `tier: "paid"` → вместо текста показывается замок + «Доступно подписчикам».
- **Экран ошибки**: airplane mode → перезапуск → маскот + «Не удалось загрузить публикации». Нажатие «Повторить» пробует заново, на кнопке крутится спиннер.
- **Симуляция 500**: у API есть флаг `simulate_error=true` — можно временно передать `simulateError: true` в `useFeed` или переключить через `UIStore.toggleSimulateError()`.
- **Лайк**: тап по сердцу — чип сразу становится розовым, счётчик увеличивается. При сетевой ошибке — откат.

## Что можно доработать

- **Юнит-тесты**.
- **Детальный экран поста** и **поиск**.
- **React 19 + expo-router**: в зависимостях expo-router пока есть конфликты peer-deps (@radix-ui). Решается флагом `--legacy-peer-deps` при `npm install`.

## Скрипты

- `npm start` / `npx expo start` — dev-server.
- `npm run ios` / `npm run android` — запуск в симуляторе.
- `npm run typecheck` — `tsc --noEmit`.
