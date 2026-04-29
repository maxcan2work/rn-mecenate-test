import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commentsQueryKey } from '@/api/queryKeys';
import type { Comment, CommentsSort } from '@/api/types';
import { AuthorHeader } from '@/components/feed/AuthorHeader';
import { FeedErrorState } from '@/components/feed/FeedErrorState';
import { PaperPlaneIcon } from '@/components/icons/PaperPlaneIcon';
import { AnimatedLikeButton } from '@/components/post/AnimatedLikeButton';
import { CommentItem } from '@/components/post/CommentItem';
import { IconCounter } from '@/components/ui/IconCounter';
import { useAddComment } from '@/hooks/useAddComment';
import { useComments } from '@/hooks/useComments';
import { usePost } from '@/hooks/usePost';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const keyExtractor = (comment: Comment) => comment.id;

const getCommentsLabel = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return 'комментарий';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'комментария';
  }
  return 'комментариев';
};

export default function PostDetailScreen() {
  const t = useTheme();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const [text, setText] = useState('');
  const [commentsSort, setCommentsSort] = useState<CommentsSort>('new');
  const [isCommentsEndVisible, setIsCommentsEndVisible] = useState(false);

  const post = usePost(postId);
  const comments = useComments(postId, commentsSort);
  const addComment = useAddComment(postId);

  const commentItems = useMemo(
    () => comments.data?.pages.flatMap((page) => page.comments) ?? [],
    [comments.data],
  );

  const handleToggleCommentsSort = useCallback(() => {
    const nextSort = commentsSort === 'new' ? 'old' : 'new';
    queryClient.removeQueries({
      queryKey: commentsQueryKey(postId, nextSort),
      exact: true,
    });
    setCommentsSort(nextSort);
  }, [commentsSort, postId, queryClient]);

  const fetchNextComments = useCallback(() => {
    if (comments.hasNextPage && !comments.isFetchingNextPage) {
      comments.fetchNextPage();
    }
  }, [comments.fetchNextPage, comments.hasNextPage, comments.isFetchingNextPage]);

  const commentItemsLengthRef = useRef(commentItems.length);
  const fetchNextCommentsRef = useRef(fetchNextComments);
  const hasNextCommentsPageRef = useRef(comments.hasNextPage);
  const isFetchingNextCommentsPageRef = useRef(comments.isFetchingNextPage);
  commentItemsLengthRef.current = commentItems.length;
  fetchNextCommentsRef.current = fetchNextComments;
  hasNextCommentsPageRef.current = comments.hasNextPage;
  isFetchingNextCommentsPageRef.current = comments.isFetchingNextPage;

  useEffect(() => {
    const isEmptyEnd =
      !comments.isLoading &&
      !comments.isFetchingNextPage &&
      !comments.hasNextPage &&
      commentItems.length === 0;

    if (comments.isLoading || comments.hasNextPage || isEmptyEnd) {
      setIsCommentsEndVisible(isEmptyEnd);
    }
  }, [
    commentItems.length,
    comments.hasNextPage,
    comments.isFetchingNextPage,
    comments.isLoading,
  ]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 1,
  }).current;

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const lastVisibleIndex = viewableItems.reduce((max, item) => {
        if (typeof item.index !== 'number') return max;
        return Math.max(max, item.index);
      }, -1);

      if (lastVisibleIndex >= commentItemsLengthRef.current - 10) {
        fetchNextCommentsRef.current();
      }

      const isEndVisible =
        commentItemsLengthRef.current > 0 &&
        lastVisibleIndex >= commentItemsLengthRef.current - 1 &&
        !hasNextCommentsPageRef.current &&
        !isFetchingNextCommentsPageRef.current;

      setIsCommentsEndVisible((current) =>
        current === isEndVisible ? current : isEndVisible,
      );
    },
  ).current;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || addComment.isPending) return;
    addComment.mutate(trimmed, {
      onSuccess: () => setText(''),
    });
  };

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => (
      <View style={styles.commentItem}>
        <CommentItem comment={item} />
      </View>
    ),
    [],
  );

  const renderCommentsFooter = useCallback(
    () =>
      comments.isFetchingNextPage ? (
        <View style={styles.commentsFooter}>
          <ActivityIndicator color={t.color.textMuted} />
        </View>
      ) : null,
    [comments.isFetchingNextPage, t.color.textMuted],
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
  const commentsTitle = `${currentPost.commentsCount} ${getCommentsLabel(
    currentPost.commentsCount,
  )}`;

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
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          style={[styles.commentsList, { backgroundColor: t.color.bgMuted }]}
          ListHeaderComponent={
            <View style={[styles.post, { backgroundColor: t.color.surface }]}>
              <View style={styles.postHeader}>
                <AuthorHeader author={currentPost.author} />
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

              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>{commentsTitle}</Text>
                <Pressable
                  onPress={handleToggleCommentsSort}
                  hitSlop={8}
                  style={({ pressed }) => pressed && { opacity: 0.6 }}
                  accessibilityRole="button"
                >
                  <Text style={styles.sortText}>
                    {commentsSort === 'new' ? 'Сначала новые' : 'Сначала старые'}
                  </Text>
                </Pressable>
              </View>
            </View>
          }
          ListEmptyComponent={
            comments.isLoading ? (
              <View style={[styles.commentsLoading, styles.commentsEnd]}>
                <ActivityIndicator color={t.color.textMuted} />
              </View>
            ) : (
              <Text
                style={[
                  styles.empty,
                  styles.commentsEnd,
                  { color: t.color.textMuted },
                ]}
              >
                Комментариев пока нет
              </Text>
            )
          }
          ListFooterComponent={renderCommentsFooter}
        />

        <View
          style={[
            styles.composer,
            isCommentsEndVisible && styles.composerAtCommentsEnd,
            { backgroundColor: t.color.surface },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ваш комментарий"
            placeholderTextColor={t.color.textMuted}
            multiline
            maxLength={500}
            style={[
              styles.input,
              { backgroundColor: t.color.surface, color: t.color.text },
            ]}
          />
          <Pressable
            onPress={handleSubmit}
            disabled={!text.trim() || addComment.isPending}
            style={({ pressed }) => [
              styles.send,
              (!text.trim() || addComment.isPending) && { opacity: 0.45 },
              pressed && { opacity: 0.75 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Отправить комментарий"
          >
            {addComment.isPending ? (
              <ActivityIndicator color={t.color.accent} />
            ) : (
              <PaperPlaneIcon size={30} />
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
    paddingBottom: 8,
  },
  commentsList: {
    overflow: 'hidden',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  post: {
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  postHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: '#68727D',
  },
  sortText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: '#6115CD',
  },
  commentItem: {
    backgroundColor: '#FFFFFF',
  },
  commentsEnd: {
    overflow: 'hidden',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  commentsLoading: {
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  commentsFooter: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  composerAtCommentsEnd: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EFF2F7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  send: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
