import { useInfiniteQuery } from '@tanstack/react-query';
import { feedQueryKey } from '@/api/queryKeys';
import { getPosts } from '@/api/posts';
import type { PostsResponse, Tier } from '@/api/types';

interface UseFeedArgs {
  tier: Tier | null;
  simulateError: boolean;
}

export const useFeed = ({ tier, simulateError }: UseFeedArgs) =>
  useInfiniteQuery<PostsResponse, Error>({
    queryKey: feedQueryKey(tier, simulateError),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getPosts({
        cursor: pageParam as string | null,
        tier: tier ?? undefined,
        simulateError,
        limit: 20,
      }),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    retry: 1,
    staleTime: 30_000,
  });
