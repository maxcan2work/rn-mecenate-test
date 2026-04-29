import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { addCommentEverywhere } from '@/api/cache';
import { addComment } from '@/api/posts';
import type { Comment } from '@/api/types';

export const useAddComment = (postId: string) => {
  const qc = useQueryClient();

  return useMutation<{ comment: Comment }, Error, string>({
    mutationFn: (text) => addComment(postId, text),
    onSuccess: ({ comment }) => {
      addCommentEverywhere(qc, comment);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    },
  });
};
