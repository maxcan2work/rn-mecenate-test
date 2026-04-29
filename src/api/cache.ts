import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import { commentsQueryKey, postQueryKey } from './queryKeys';
import type { Comment, CommentsResponse, Post, PostsResponse } from './types';

export type FeedCache = InfiniteData<PostsResponse>;
export type CommentsCache = InfiniteData<CommentsResponse>;

export const patchFeedCache = (
  cache: FeedCache | undefined,
  postId: string,
  patch: (p: Post) => Post,
): FeedCache | undefined => {
  if (!cache) return cache;
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      posts: page.posts.map((item) => (item.id === postId ? patch(item) : item)),
    })),
  };
};

export const patchPostEverywhere = (
  qc: QueryClient,
  postId: string,
  patch: (p: Post) => Post,
) => {
  qc.setQueriesData<FeedCache>({ queryKey: ['posts'] }, (old) =>
    patchFeedCache(old, postId, patch),
  );
  qc.setQueryData<Post>(postQueryKey(postId), (old) =>
    old ? patch(old) : old,
  );
};

export const appendCommentToCache = (
  cache: CommentsCache | undefined,
  comment: Comment,
  sort: 'new' | 'old' = 'new',
): CommentsCache | undefined => {
  if (!cache) return cache;

  const exists = cache.pages.some((page) =>
    page.comments.some((item) => item.id === comment.id),
  );
  if (exists) return cache;

  const [firstPage, ...restPages] = cache.pages;
  if (!firstPage) return cache;

  if (sort === 'old') {
    const lastPageIndex = cache.pages.length - 1;

    return {
      ...cache,
      pages: cache.pages.map((page, index) =>
        index === lastPageIndex
          ? { ...page, comments: [...page.comments, comment] }
          : page,
      ),
    };
  }

  return {
    ...cache,
    pages: [
      {
        ...firstPage,
        comments: [comment, ...firstPage.comments],
      },
      ...restPages,
    ],
  };
};

const getCommentsSortFromQueryKey = (key: QueryKey) => {
  const params = key[2];
  if (
    params &&
    typeof params === 'object' &&
    'sort' in params &&
    params.sort === 'old'
  ) {
    return 'old';
  }

  return 'new';
};

export const addCommentEverywhere = (qc: QueryClient, comment: Comment) => {
  const seenKey = ['seen-comments', comment.postId] as const;
  const seenIds = qc.getQueryData<string[]>(seenKey) ?? [];
  if (seenIds.includes(comment.id)) return;

  const commentsCaches = qc.getQueriesData<CommentsCache>({
    queryKey: ['comments', comment.postId],
  });
  const alreadyInCache = commentsCaches.some(([, cache]) =>
    cache?.pages.some((page) =>
      page.comments.some((item) => item.id === comment.id),
    ),
  );

  commentsCaches.forEach(([key]) => {
    const sort = getCommentsSortFromQueryKey(key);
    qc.setQueryData<CommentsCache>(key, (old) =>
      appendCommentToCache(old, comment, sort),
    );
  });
  qc.setQueryData<string[]>(seenKey, [comment.id, ...seenIds].slice(0, 200));
  if (alreadyInCache) return;

  patchPostEverywhere(qc, comment.postId, (post) => ({
    ...post,
    commentsCount: post.commentsCount + 1,
  }));
};
