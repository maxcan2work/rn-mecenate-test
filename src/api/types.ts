export type Tier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  preview: string;
  coverUrl: string | null;
  tier: Tier;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: Author;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface LikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
  author: Author;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetPostsParams {
  limit?: number;
  cursor?: string | null;
  tier?: Tier;
  simulateError?: boolean;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  data: T;
}

export interface ApiErrorEnvelope {
  ok: false;
  error: { code: string; message: string };
}
