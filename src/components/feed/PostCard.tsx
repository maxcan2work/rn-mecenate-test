import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Post } from '@/api/types';
import { CommentIcon } from '@/components/icons/CommentIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { PaidPostCoverOverlay } from '@/components/post/PaidPostCoverOverlay';
import { PaidPostTextPlaceholder } from '@/components/post/PaidPostTextPlaceholder';
import { ActionCounterButton } from '@/components/ui/ActionCounterButton';
import { useLikePost } from '@/hooks/useLikePost';
import { useTheme } from '@/theme/ThemeProvider';
import { AuthorHeader } from './AuthorHeader';

interface Props {
  post: Post;
  onPress?: () => void;
}

const PostCardInner = ({ post, onPress }: Props) => {
  const t = useTheme();
  const like = useLikePost(post.id);
  const isPaid = post.tier === 'paid';
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
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
          <ActionCounterButton
            count={post.likesCount}
            active={post.isLiked}
            renderIcon={(color) => (
              <HeartIcon size={22} color={color} filled={post.isLiked} />
            )}
            onPress={() => like.mutate()}
            disabled={like.isPending}
            accessibilityLabel="Лайк"
          />
          <ActionCounterButton
            count={post.commentsCount}
            renderIcon={(color) => <CommentIcon size={22} color={color} />}
            onPress={onPress}
            accessibilityLabel="Комментарии"
          />
        </View>
      ) : null}
    </Container>
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
