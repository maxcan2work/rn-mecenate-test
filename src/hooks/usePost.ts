import { useQuery } from '@tanstack/react-query';
import { getPost } from '@/api/posts';
import { postQueryKey } from '@/api/queryKeys';

export const usePost = (postId: string) =>
  useQuery({
    queryKey: postQueryKey(postId),
    queryFn: () => getPost(postId),
    staleTime: 30_000,
  });
