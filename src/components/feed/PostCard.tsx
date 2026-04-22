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
          borderColor: t.color.border,
          borderRadius: t.radius.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <AuthorHeader author={post.author} createdAt={post.createdAt} />
      </View>

      {post.title ? (
        <Text
          style={[t.typography.h2, { color: t.color.text }, styles.title]}
          numberOfLines={2}
        >
          {post.title}
        </Text>
      ) : null}

      {post.coverUrl ? (
        <Image
          source={{ uri: post.coverUrl }}
          style={[styles.cover, { backgroundColor: t.color.skeleton }]}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      <View style={styles.bodyWrap}>
        {post.tier === 'paid' ? (
          <PaidPostLock />
        ) : (
          <Text
            style={[t.typography.body, { color: t.color.text }]}
            numberOfLines={4}
          >
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
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {},
  title: { marginTop: 2 },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  bodyWrap: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 4,
  },
});
