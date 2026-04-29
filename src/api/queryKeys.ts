import type { CommentsSort, Tier } from './types';

export const feedQueryKey = (tier: Tier | null, simulateError: boolean) =>
  ['posts', { tier: tier ?? 'all', simulateError }] as const;

export const postQueryKey = (postId: string) => ['post', postId] as const;

export const commentsQueryKey = (postId: string, sort: CommentsSort = 'new') =>
  ['comments', postId, { sort }] as const;
