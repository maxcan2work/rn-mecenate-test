import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commentsQueryKey } from '@/api/queryKeys';
import type { CommentsSort } from '@/api/types';
import { AuthorHeader } from '@/components/feed/AuthorHeader';
import { FeedErrorState } from '@/components/feed/FeedErrorState';
import { CommentIcon } from '@/components/icons/CommentIcon';
import { CommentComposer } from '@/components/post/CommentComposer';
import { AnimatedLikeButton } from '@/components/post/AnimatedLikeButton';
import { PaidPostCoverOverlay } from '@/components/post/PaidPostCoverOverlay';
import { PaidPostTextPlaceholder } from '@/components/post/PaidPostTextPlaceholder';
import { PostCommentsList } from '@/components/post/PostCommentsList';
import { ActionCounterButton } from '@/components/ui/ActionCounterButton';
import { AppNavBar } from '@/components/ui/AppNavBar';
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
  const [commentsSort, setCommentsSort] = useState<CommentsSort>('old');
  const [isCommentsEndVisible, setIsCommentsEndVisible] = useState(false);
  const [scrollCommentsToTopSignal, setScrollCommentsToTopSignal] = useState(0);

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
      onSuccess: () => {
        setText('');
        if (commentsSort === 'new') {
          setScrollCommentsToTopSignal((current) => current + 1);
        }
      },
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
  const postTitle = currentPost.title.trim() || 'Детальный пост';
  const commentsTitle = `${currentPost.commentsCount} ${getCommentsLabel(
    currentPost.commentsCount,
  )}`;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: t.color.bgMuted }]}
    >
      <View style={styles.flex}>
        <AppNavBar title={postTitle} onBackPress={() => router.back()} />

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
          scrollToTopSignal={scrollCommentsToTopSignal}
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
                    <PaidPostCoverOverlay coverUrl={currentPost.coverUrl} />
                  ) : null}
                </View>
              ) : null}

              <View style={styles.postBody}>
                {isPaid ? (
                  <PaidPostTextPlaceholder />
                ) : (
                  <>
                    <Text style={t.typography.postTitle}>
                      {currentPost.title}
                    </Text>
                    <Text style={t.typography.postBody}>
                      {currentPost.body || currentPost.preview}
                    </Text>
                  </>
                )}
              </View>

              {!isPaid ? (
                <View style={styles.actions}>
                  <AnimatedLikeButton
                    postId={currentPost.id}
                    count={currentPost.likesCount}
                    active={currentPost.isLiked}
                  />
                  <ActionCounterButton
                    count={currentPost.commentsCount}
                    renderIcon={(color) => <CommentIcon size={22} color={color} />}
                    accessibilityLabel="Комментарии"
                  />
                </View>
              ) : null}
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
