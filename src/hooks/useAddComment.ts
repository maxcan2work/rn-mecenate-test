import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCommentEverywhere } from '@/api/cache';
import { addComment } from '@/api/posts';
import type { Comment } from '@/api/types';
import { triggerSuccessHaptic } from '@/utils/haptics';

export const useAddComment = (postId: string) => {
  const qc = useQueryClient();

  return useMutation<{ comment: Comment }, Error, string>({
    mutationFn: (text) => addComment(postId, text),
    onSuccess: ({ comment }) => {
      addCommentEverywhere(qc, comment);
      triggerSuccessHaptic();
    },
  });
};
