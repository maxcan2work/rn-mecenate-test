import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Post } from '@/api/types';
import { useLikePost } from '@/hooks/useLikePost';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthorHeader } from './AuthorHeader';
import { PaidPostLock } from './PaidPostLock';
import { IconCounter } from '@/components/ui/IconCounter';

interface Props {
  post: Post;
}

const PostCardInner = ({ post }: Props) => {
  const t = useTheme();
  const like = useLikePost(post.id);

  return (
    <View
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

      {post.coverUrl ? (
        <Image
          source={{ uri: post.coverUrl }}
          style={[styles.cover, { backgroundColor: t.color.skeleton }]}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      <View style={styles.body}>
        {post.title ? (
          <Text style={t.typography.postTitle} numberOfLines={2}>
            {post.title}
          </Text>
        ) : null}

        {post.tier === 'paid' ? (
          <PaidPostLock />
        ) : (
          <Text style={t.typography.postBody} numberOfLines={2}>
            {post.preview}
          </Text>
        )}
      </View>

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
    </View>
  );
};

export const PostCard = memo(PostCardInner);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 16,
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
    paddingTop: 8,
    paddingHorizontal: 16,
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
