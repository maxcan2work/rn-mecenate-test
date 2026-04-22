import { apiClient } from './client';
import type {
  CommentsResponse,
  GetPostsParams,
  LikeResponse,
  Post,
  PostsResponse,
} from './types';

export const getPosts = async ({
  limit = 20,
  cursor,
  tier,
  simulateError,
}: GetPostsParams = {}): Promise<PostsResponse> => {
  const { data } = await apiClient.get<PostsResponse>('/posts', {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
      ...(tier ? { tier } : {}),
      ...(simulateError ? { simulate_error: true } : {}),
    },
  });
  return data;
};

export const getPost = async (id: string): Promise<Post> => {
  const { data } = await apiClient.get<{ post: Post } | Post>(`/posts/${id}`);
  return 'post' in (data as Record<string, unknown>)
    ? (data as { post: Post }).post
    : (data as Post);
};

export const likePost = async (id: string): Promise<LikeResponse> => {
  const { data } = await apiClient.post<LikeResponse>(`/posts/${id}/like`);
  return data;
};

export const getComments = async (
  postId: string,
  params: { limit?: number; cursor?: string | null } = {},
): Promise<CommentsResponse> => {
  const { data } = await apiClient.get<CommentsResponse>(
    `/posts/${postId}/comments`,
    {
      params: {
        limit: params.limit ?? 20,
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    },
  );
  return data;
};

export const addComment = async (postId: string, text: string) => {
  const { data } = await apiClient.post(`/posts/${postId}/comments`, { text });
  return data;
};
