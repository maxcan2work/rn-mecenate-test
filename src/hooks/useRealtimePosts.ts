import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { WS_BASE_URL } from '@/api/client';
import { addCommentEverywhere, patchPostEverywhere } from '@/api/cache';
import type { Comment } from '@/api/types';

type RealtimeEvent =
  | { type: 'ping' }
  | { type: 'like_updated'; postId: string; likesCount: number }
  | { type: 'comment_added'; postId: string; comment: Comment };

export const useRealtimePosts = (token: string | null) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!token) return undefined;

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByCleanup = false;

    const connect = () => {
      ws = new WebSocket(`${WS_BASE_URL}/ws?token=${encodeURIComponent(token)}`);

      ws.onmessage = (message) => {
        try {
          const event = JSON.parse(String(message.data)) as RealtimeEvent;
          if (event.type === 'like_updated') {
            patchPostEverywhere(qc, event.postId, (post) => ({
              ...post,
              likesCount: event.likesCount,
            }));
          }
          if (event.type === 'comment_added') {
            addCommentEverywhere(qc, event.comment);
          }
        } catch {
          // Ignore malformed realtime messages; REST remains the source of truth.
        }
      };

      ws.onclose = () => {
        if (!closedByCleanup) {
          reconnectTimer = setTimeout(connect, 1500);
        }
      };
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [qc, token]);
};
