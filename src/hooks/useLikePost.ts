import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPostEverywhere, type FeedCache } from '@/api/cache';
import { likePost } from '@/api/posts';
import { postQueryKey } from '@/api/queryKeys';
import type { LikeResponse, Post } from '@/api/types';

export const useLikePost = (postId: string) => {
  const qc = useQueryClient();

  return useMutation<
    LikeResponse,
    Error,
    void,
    { feed: { previous?: FeedCache }[]; post?: Post }
  >({
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      await qc.cancelQueries({ queryKey: postQueryKey(postId) });

      const snapshots = qc
        .getQueriesData<FeedCache>({ queryKey: ['posts'] })
        .map(([, data]) => ({ previous: data }));
      const previousPost = qc.getQueryData<Post>(postQueryKey(postId));

      patchPostEverywhere(qc, postId, (p) => ({
        ...p,
        isLiked: !p.isLiked,
        likesCount: p.likesCount + (p.isLiked ? -1 : 1),
      }));

      return { feed: snapshots, post: previousPost };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;
      qc.getQueriesData<FeedCache>({ queryKey: ['posts'] }).forEach(
        ([key], idx) => {
          const snap = context.feed[idx];
          if (snap?.previous) qc.setQueryData(key, snap.previous);
        },
      );
      if (context.post) qc.setQueryData(postQueryKey(postId), context.post);
    },
    onSuccess: (data) => {
      patchPostEverywhere(qc, postId, (p: Post) => ({
        ...p,
        isLiked: data.isLiked,
        likesCount: data.likesCount,
      }));
    },
  });
};
