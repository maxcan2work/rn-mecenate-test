import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Post } from '@/api/types';
import { useLikePost } from '@/hooks/useLikePost';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthorHeader } from './AuthorHeader';
import { IconCounter } from '@/components/ui/IconCounter';
import { PaidPostCoverOverlay } from '@/components/post/PaidPostCoverOverlay';
import { PaidPostTextPlaceholder } from '@/components/post/PaidPostTextPlaceholder';

interface Props {
  post: Post;
  onPress?: () => void;
}

const PostCardInner = ({ post, onPress }: Props) => {
  const t = useTheme();
  const like = useLikePost(post.id);
  const isPaid = post.tier === 'paid';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: t.color.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <AuthorHeader author={post.author} />
      </View>

      <View style={styles.content}>
        {post.coverUrl ? (
          <View>
            <Image
              source={{ uri: post.coverUrl }}
              style={[styles.cover, { backgroundColor: t.color.skeleton }]}
              contentFit="cover"
              transition={200}
              blurRadius={isPaid ? 42 : 0}
            />
            {isPaid ? <PaidPostCoverOverlay /> : null}
          </View>
        ) : null}

        <View style={styles.body}>
          {isPaid ? (
            <PaidPostTextPlaceholder />
          ) : (
            <>
              {post.title ? (
                <Text style={t.typography.postTitle} numberOfLines={2}>
                  {post.title}
                </Text>
              ) : null}

              <Text style={t.typography.postBody} numberOfLines={2}>
                {post.preview}
              </Text>
            </>
          )}
        </View>
      </View>

      {!isPaid ? (
        <View style={styles.footer}>
          <IconCounter
            kind="heart"
            count={post.likesCount}
            active={post.isLiked}
            onPress={() => like.mutate()}
            disabled={like.isPending}
          />
          <IconCounter kind="comment" count={post.commentsCount} />
        </View>
      ) : null}
    </Pressable>
  );
};

export const PostCard = memo(PostCardInner);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    overflow: 'hidden',
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  body: {
    minHeight: 92,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
});
