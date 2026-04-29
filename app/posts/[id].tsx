import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Comment } from '@/api/types';
import { AuthorHeader } from '@/components/feed/AuthorHeader';
import { FeedErrorState } from '@/components/feed/FeedErrorState';
import { FeedFooter } from '@/components/feed/FeedFooter';
import { AnimatedLikeButton } from '@/components/post/AnimatedLikeButton';
import { CommentItem } from '@/components/post/CommentItem';
import { IconCounter } from '@/components/ui/IconCounter';
import { useAddComment } from '@/hooks/useAddComment';
import { useComments } from '@/hooks/useComments';
import { usePost } from '@/hooks/usePost';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRelativeDate } from '@/utils/formatDate';

const keyExtractor = (comment: Comment) => comment.id;

export default function PostDetailScreen() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const [text, setText] = useState('');

  const post = usePost(postId);
  const comments = useComments(postId);
  const addComment = useAddComment(postId);

  const commentItems = useMemo(
    () => comments.data?.pages.flatMap((page) => page.comments) ?? [],
    [comments.data],
  );

  const handleEndReached = useCallback(() => {
    if (comments.hasNextPage && !comments.isFetchingNextPage) {
      comments.fetchNextPage();
    }
  }, [comments]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || addComment.isPending) return;
    addComment.mutate(trimmed, {
      onSuccess: () => setText(''),
    });
  };

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => <CommentItem comment={item} />,
    [],
  );

  if (post.isLoading) {
    return (
      <SafeAreaView style={[styles.flex, styles.center, { backgroundColor: t.color.bgMuted }]}>
        <ActivityIndicator color={t.color.textMuted} />
      </SafeAreaView>
    );
  }

  if (post.isError || !post.data) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: t.color.bgMuted }]}>
        <FeedErrorState
          onRetry={() => post.refetch()}
          isRetrying={post.isFetching}
          detail={post.error?.message}
        />
      </SafeAreaView>
    );
  }

  const currentPost = post.data;
  const isPaid = currentPost.tier === 'paid';

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: t.color.bgMuted }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.nav, { backgroundColor: t.color.bgMuted }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <Text style={[styles.backText, { color: t.color.text }]}>‹</Text>
          </Pressable>
          <Text style={[styles.navTitle, { color: t.color.text }]}>
            Детальный пост
          </Text>
          <View style={styles.back} />
        </View>

        <FlatList
          data={commentItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={[styles.post, { backgroundColor: t.color.surface }]}>
              <View style={styles.postHeader}>
                <AuthorHeader author={currentPost.author} />
                <Text style={[styles.date, { color: t.color.textMuted }]}>
                  {formatRelativeDate(currentPost.createdAt)}
                </Text>
              </View>

              {currentPost.coverUrl ? (
                <View style={styles.coverWrap}>
                  <Image
                    source={{ uri: currentPost.coverUrl }}
                    style={[styles.cover, { backgroundColor: t.color.skeleton }]}
                    contentFit="cover"
                    transition={200}
                  />
                  {isPaid ? (
                    <View style={[StyleSheet.absoluteFill, styles.paidOverlay]}>
                      <Text style={styles.paidTitle}>Доступно подписчикам</Text>
                      <Text style={styles.paidText}>Полный текст скрыт</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.postBody}>
                <Text style={t.typography.postTitle}>{currentPost.title}</Text>
                <Text style={t.typography.postBody}>
                  {isPaid ? currentPost.preview : currentPost.body || currentPost.preview}
                </Text>
              </View>

              <View style={styles.actions}>
                <AnimatedLikeButton
                  postId={currentPost.id}
                  count={currentPost.likesCount}
                  active={currentPost.isLiked}
                />
                <IconCounter kind="comment" count={currentPost.commentsCount} />
              </View>

              <View style={[styles.sectionHead, { borderTopColor: t.color.border }]}>
                <Text style={[styles.sectionTitle, { color: t.color.text }]}>
                  Комментарии
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            comments.isLoading ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator color={t.color.textMuted} />
              </View>
            ) : (
              <Text style={[styles.empty, { color: t.color.textMuted }]}>
                Комментариев пока нет
              </Text>
            )
          }
          ListFooterComponent={
            comments.isFetchingNextPage ? <FeedFooter /> : null
          }
        />

        <View
          style={[
            styles.composer,
            { backgroundColor: t.color.surface, borderTopColor: t.color.border },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Написать комментарий"
            placeholderTextColor={t.color.textMuted}
            multiline
            maxLength={500}
            style={[
              styles.input,
              { backgroundColor: t.color.chipBg, color: t.color.text },
            ]}
          />
          <Pressable
            onPress={handleSubmit}
            disabled={!text.trim() || addComment.isPending}
            style={({ pressed }) => [
              styles.send,
              { backgroundColor: t.color.accent },
              (!text.trim() || addComment.isPending) && { opacity: 0.45 },
              pressed && { opacity: 0.75 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Отправить комментарий"
          >
            {addComment.isPending ? (
              <ActivityIndicator color={t.color.textInverse} />
            ) : (
              <Text style={styles.sendText}>Отправить</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: fontFamily.regular,
    fontSize: 34,
    lineHeight: 36,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
  },
  list: {
    paddingBottom: 16,
  },
  post: {
    overflow: 'hidden',
  },
  postHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    paddingLeft: 52,
  },
  coverWrap: {
    position: 'relative',
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  paidOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 17, 21, 0.72)',
    gap: 4,
  },
  paidTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  paidText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.82)',
  },
  postBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionHead: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
  },
  commentsLoading: {
    paddingVertical: 24,
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  send: {
    minHeight: 42,
    minWidth: 104,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  sendText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
  },
});
