import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { likePost } from '@/api/posts';
import type { LikeResponse, PostsResponse } from '@/api/types';

type FeedCache = InfiniteData<PostsResponse>;

const patchFeedCache = (
  cache: FeedCache | undefined,
  postId: string,
  patch: (p: PostsResponse['items'][number]) => PostsResponse['items'][number],
): FeedCache | undefined => {
  if (!cache) return cache;
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.id === postId ? patch(item) : item,
      ),
    })),
  };
};

export const useLikePost = (postId: string) => {
  const qc = useQueryClient();

  return useMutation<LikeResponse, Error, void, { previous?: FeedCache }[]>({
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['posts'] });

      const snapshots = qc
        .getQueriesData<FeedCache>({ queryKey: ['posts'] })
        .map(([key, data]) => ({ key, previous: data }));

      qc.setQueriesData<FeedCache>({ queryKey: ['posts'] }, (old) =>
        patchFeedCache(old, postId, (p) => ({
          ...p,
          isLiked: !p.isLiked,
          likesCount: p.likesCount + (p.isLiked ? -1 : 1),
        })),
      );

      return snapshots.map((s) => ({ previous: s.previous }));
    },
    onError: (_err, _vars, context) => {
      if (!context) return;
      qc.getQueriesData<FeedCache>({ queryKey: ['posts'] }).forEach(
        ([key], idx) => {
          const snap = context[idx];
          if (snap?.previous) qc.setQueryData(key, snap.previous);
        },
      );
    },
    onSuccess: (data) => {
      qc.setQueriesData<FeedCache>({ queryKey: ['posts'] }, (old) =>
        patchFeedCache(old, postId, (p) => ({
          ...p,
          isLiked: data.isLiked,
          likesCount: data.likesCount,
        })),
      );
    },
  });
};
