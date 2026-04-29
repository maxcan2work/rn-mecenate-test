import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commentsQueryKey } from '@/api/queryKeys';
import type { CommentsSort } from '@/api/types';
import { AuthorHeader } from '@/components/feed/AuthorHeader';
import { FeedErrorState } from '@/components/feed/FeedErrorState';
import { CommentComposer } from '@/components/post/CommentComposer';
import { AnimatedLikeButton } from '@/components/post/AnimatedLikeButton';
import { PostCommentsList } from '@/components/post/PostCommentsList';
import { IconCounter } from '@/components/ui/IconCounter';
import { KeyboardLiftView } from '@/components/ui/KeyboardLiftView';
import { useAddComment } from '@/hooks/useAddComment';
import { useComments } from '@/hooks/useComments';
import { usePost } from '@/hooks/usePost';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

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

  const handleCommentsEndVisibleChange = useCallback(
    (isVisible: boolean) => {
      setIsCommentsEndVisible((current) =>
        current === isVisible ? current : isVisible,
      );
    },
    [],
  );

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || addComment.isPending) return;
    addComment.mutate(trimmed, {
      onSuccess: () => setText(''),
    });
  };

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
      <View style={styles.flex}>
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

        <PostCommentsList
          comments={commentItems}
          commentsTitle={commentsTitle}
          commentsSort={commentsSort}
          isLoading={comments.isLoading}
          isFetchingNextPage={comments.isFetchingNextPage}
          hasNextPage={comments.hasNextPage}
          onToggleSort={handleToggleCommentsSort}
          onLoadMore={fetchNextComments}
          onEndVisibleChange={handleCommentsEndVisibleChange}
          header={
            <>
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
            </>
          }
        />

        <KeyboardLiftView>
          <CommentComposer
            value={text}
            onChangeText={setText}
            onSubmit={handleSubmit}
            isPending={addComment.isPending}
            separatedFromComments={isCommentsEndVisible}
          />
        </KeyboardLiftView>
      </View>
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
});
