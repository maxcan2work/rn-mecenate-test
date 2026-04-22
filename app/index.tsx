import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    error,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFeed({ tier: ui.tierFilter, simulateError: ui.simulateError });

  const posts = useMemo<Post[]>(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.flex}>
          <FeedSkeleton />
        </View>
      );
    }

    if (isError && posts.length === 0) {
      return (
        <View style={styles.flex}>
          <FeedErrorState
            onRetry={() => refetch()}
            isRetrying={isFetching}
            detail={error?.message}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.flex, { backgroundColor: t.color.bgMuted }]}
    >
      <View style={styles.statusSpacer} />
      {renderContent()}
    </SafeAreaView>
  );
});

export default FeedScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingVertical: 0 },
  statusSpacer: { height: 16 },
});
