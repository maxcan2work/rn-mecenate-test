import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '@/api/posts';
import { commentsQueryKey } from '@/api/queryKeys';
import type { CommentsResponse, CommentsSort } from '@/api/types';

export const useComments = (postId: string, sort: CommentsSort) =>
  useInfiniteQuery<CommentsResponse, Error>({
    queryKey: commentsQueryKey(postId, sort),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getComments(postId, {
        cursor: pageParam as string | null,
        limit: 20,
        sort,
      }),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    retry: 1,
    staleTime: 15_000,
  });
