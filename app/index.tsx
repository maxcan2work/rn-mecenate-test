import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import type { Post } from '@/api/types';
import { FeedErrorState } from '@/components/feed/FeedErrorState';
import { FeedFooter } from '@/components/feed/FeedFooter';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { PostCard } from '@/components/feed/PostCard';
import { useFeed } from '@/hooks/useFeed';
import { useStores } from '@/stores/context';
import { useTheme } from '@/theme/ThemeProvider';

const keyExtractor = (p: Post) => p.id;

const FeedScreen = observer(() => {
  const t = useTheme();
  const { ui } = useStores();

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFeed({ tier: ui.tierFilter, simulateError: ui.simulateError });

  const posts = useMemo<Post[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.flex, { backgroundColor: t.color.bgMuted }]}>
        <FeedSkeleton />
      </View>
    );
  }

  if (isError && posts.length === 0) {
    return (
      <View style={[styles.flex, { backgroundColor: t.color.bgMuted }]}>
        <FeedErrorState onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      style={{ backgroundColor: t.color.bgMuted }}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={() => refetch()}
          tintColor={t.color.textMuted}
        />
      }
      ListFooterComponent={isFetchingNextPage ? <FeedFooter /> : null}
    />
  );
});

export default FeedScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingVertical: 12 },
});
