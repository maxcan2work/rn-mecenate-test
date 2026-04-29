import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
  type ViewToken,
} from 'react-native';
import type { Comment, CommentsSort } from '@/api/types';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  commentsTitle: string;
  commentsSort: CommentsSort;
  header: ReactNode;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onToggleSort: () => void;
  onLoadMore: () => void;
  onEndVisibleChange: (isVisible: boolean) => void;
  scrollToTopSignal?: number;
}

const keyExtractor = (comment: Comment) => comment.id;

export const PostCommentsList = ({
  comments,
  commentsTitle,
  commentsSort,
  header,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onToggleSort,
  onLoadMore,
  onEndVisibleChange,
  scrollToTopSignal = 0,
}: Props) => {
  const t = useTheme();
  const listRef = useRef<FlatList<Comment>>(null);
  const commentsLengthRef = useRef(comments.length);
  const onLoadMoreRef = useRef(onLoadMore);
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);
  commentsLengthRef.current = comments.length;
  onLoadMoreRef.current = onLoadMore;
  hasNextPageRef.current = hasNextPage;
  isFetchingNextPageRef.current = isFetchingNextPage;

  useEffect(() => {
    const isEmptyEnd =
      !isLoading && !isFetchingNextPage && !hasNextPage && comments.length === 0;

    if (isLoading || hasNextPage || isEmptyEnd) {
      onEndVisibleChange(isEmptyEnd);
    }
  }, [
    comments.length,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    onEndVisibleChange,
  ]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 1,
  }).current;

  useEffect(() => {
    if (scrollToTopSignal === 0) return;
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [scrollToTopSignal]);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const lastVisibleIndex = viewableItems.reduce((max, item) => {
        if (typeof item.index !== 'number') return max;
        return Math.max(max, item.index);
      }, -1);

      if (lastVisibleIndex >= commentsLengthRef.current - 10) {
        onLoadMoreRef.current();
      }

      const isEndVisible =
        commentsLengthRef.current > 0 &&
        lastVisibleIndex >= commentsLengthRef.current - 1 &&
        !hasNextPageRef.current &&
        !isFetchingNextPageRef.current;

      onEndVisibleChange(isEndVisible);
    },
  ).current;

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => (
      <View style={styles.commentItem}>
        <CommentItem comment={item} />
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <View style={styles.commentsFooter}>
          <ActivityIndicator color={t.color.textMuted} />
        </View>
      ) : null,
    [isFetchingNextPage, t.color.textMuted],
  );

  return (
    <FlatList
      ref={listRef}
      data={comments}
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
          {header}

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{commentsTitle}</Text>
            <Pressable
              onPress={onToggleSort}
              hitSlop={8}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
              accessibilityRole="button"
            >
              <Text style={styles.sortText}>
                {commentsSort === 'new' ? 'Сначала старые' : 'Сначала новые'}
              </Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
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
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
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
});
