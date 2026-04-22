import { apiClient } from './client';
import type {
  ApiEnvelope,
  Comment,
  CommentsResponse,
  GetPostsParams,
  LikeResponse,
  Post,
  PostsResponse,
} from './types';

const unwrap = <T>(resp: { data: ApiEnvelope<T> }): T => resp.data.data;

export const getPosts = async ({
  limit = 20,
  cursor,
  tier,
  simulateError,
}: GetPostsParams = {}): Promise<PostsResponse> => {
  const resp = await apiClient.get<ApiEnvelope<PostsResponse>>('/posts', {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
      ...(tier ? { tier } : {}),
      ...(simulateError ? { simulate_error: true } : {}),
    },
  });
  return unwrap(resp);
};

export const getPost = async (id: string): Promise<Post> => {
  const resp = await apiClient.get<ApiEnvelope<{ post: Post }>>(`/posts/${id}`);
  return unwrap(resp).post;
};

export const likePost = async (id: string): Promise<LikeResponse> => {
  const resp = await apiClient.post<ApiEnvelope<LikeResponse>>(
    `/posts/${id}/like`,
  );
  return unwrap(resp);
};

export const getComments = async (
  postId: string,
  params: { limit?: number; cursor?: string | null } = {},
): Promise<CommentsResponse> => {
  const resp = await apiClient.get<ApiEnvelope<CommentsResponse>>(
    `/posts/${postId}/comments`,
    {
      params: {
        limit: params.limit ?? 20,
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    },
  );
  return unwrap(resp);
};

export const addComment = async (postId: string, text: string) => {
  const resp = await apiClient.post<ApiEnvelope<{ comment: Comment }>>(
    `/posts/${postId}/comments`,
    { text },
  );
  return unwrap(resp);
};
