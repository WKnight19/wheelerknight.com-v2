// Individual Blog Post Page for Wheeler Knight Portfolio
import React from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Stack,
  Grid,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Anchor,
  Box,
  Center,
  Loader,
  Image,
  Divider,
  Breadcrumbs,
  Avatar,
} from "@mantine/core";
import {
  IconCalendar,
  IconEye,
  IconHeart,
  IconShare,
  IconArrowLeft,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconArticle,
  IconUser,
  IconClock,
} from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useBlogPostBySlug,
  useBlogPosts,
  useLikeBlogPost,
} from "../../hooks/useApi";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading: postLoading } = useBlogPostBySlug(slug || "");
  const { data: relatedPosts } = useBlogPosts({
    status: "published",
    per_page: 3,
  });
  const likePost = useLikeBlogPost();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await likePost.mutateAsync(post.id);
      // The like count will be updated via React Query cache invalidation
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt || post.content?.substring(0, 150) + "...";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (postLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading blog post...</Text>
        </Stack>
      </Center>
    );
  }

  if (!post) {
    return (
      <Container size="xl" py="md">
        <Stack gap="xl" align="center" ta="center">
          <Title order={1} c="crimson">
            Post Not Found
          </Title>
          <Text size="lg" c="dimmed">
            The blog post you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/blog")}
          >
            Back to Blog
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Stack gap="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs>
          <Anchor href="/" size="sm">
            Home
          </Anchor>
          <Anchor href="/blog" size="sm">
            Blog
          </Anchor>
          <Text size="sm" c="dimmed">
            {post.title}
          </Text>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate("/blog")}
          w="fit-content"
        >
          Back to Blog
        </Button>

        {/* Article Header */}
        <Paper p="xl" withBorder>
          <Stack gap="md">
            <Title order={1} c="crimson" size="2.5rem">
              {post.title}
            </Title>

            <Group gap="md" wrap="wrap">
              <Group gap="xs">
                <IconCalendar size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {formatDate(post.published_at)}
                </Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {formatReadingTime(post.content)}
                </Text>
              </Group>
              <Group gap="xs">
                <IconEye size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {post.views_count || 0} views
                </Text>
              </Group>
              <Group gap="xs">
                <IconHeart size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  {post.likes_count || 0} likes
                </Text>
              </Group>
            </Group>

            {post.excerpt && (
              <Text size="lg" c="dimmed" style={{ lineHeight: 1.6 }}>
                {post.excerpt}
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Featured Image */}
        {post.featured_image && (
          <Box>
            <Image
              src={post.featured_image}
              alt={post.title}
              height={400}
              radius="md"
              style={{ objectFit: "cover" }}
            />
          </Box>
        )}

        {/* Article Content */}
        <Paper p="xl" withBorder>
          <Text
            size="md"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              fontSize: "1.1rem",
            }}
          >
            {post.content}
          </Text>
        </Paper>

        {/* Actions */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Enjoyed this post?</Title>
              <Group gap="xs">
                <Button
                  variant="outline"
                  leftSection={<IconHeart size={16} />}
                  onClick={handleLike}
                  loading={likePost.isPending}
                >
                  Like ({post.likes_count || 0})
                </Button>
                <Button
                  variant="outline"
                  leftSection={<IconShare size={16} />}
                  onClick={handleCopyLink}
                >
                  Share
                </Button>
              </Group>
            </Group>

            <Divider />

            <Group justify="center" gap="md">
              <Text size="sm" c="dimmed">
                Share on:
              </Text>
              <Button
                variant="outline"
                size="sm"
                leftSection={<IconBrandTwitter size={16} />}
                onClick={() => handleShare("twitter")}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftSection={<IconBrandLinkedin size={16} />}
                onClick={() => handleShare("linkedin")}
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftSection={<IconBrandFacebook size={16} />}
                onClick={() => handleShare("facebook")}
              >
                Facebook
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Related Posts */}
        {relatedPosts?.items && relatedPosts.items.length > 0 && (
          <Box>
            <Title order={2} c="crimson" mb="md">
              Related Posts
            </Title>
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {relatedPosts.items.map((relatedPost: any) => (
                <Card
                  key={relatedPost.id}
                  withBorder
                  p="md"
                  style={{ height: "100%" }}
                >
                  <Stack gap="md" style={{ height: "100%" }}>
                    {relatedPost.featured_image && (
                      <Box
                        style={{
                          height: 200,
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          height={200}
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    )}

                    <Stack gap="sm" style={{ flex: 1 }}>
                      <Title order={4} lineClamp={2}>
                        {relatedPost.title}
                      </Title>

                      <Text size="sm" c="dimmed" lineClamp={3}>
                        {relatedPost.excerpt ||
                          relatedPost.content?.substring(0, 150) + "..."}
                      </Text>

                      <Group gap="md" mt="auto">
                        <Group gap="xs">
                          <IconCalendar size={14} color="gray" />
                          <Text size="xs" c="dimmed">
                            {formatDate(relatedPost.published_at)}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <IconEye size={14} color="gray" />
                          <Text size="xs" c="dimmed">
                            {relatedPost.views_count || 0} views
                          </Text>
                        </Group>
                      </Group>
                    </Stack>

                    <Button
                      variant="light"
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                      fullWidth
                    >
                      Read More
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Author Info */}
        <Paper p="md" withBorder>
          <Group gap="md">
            <Avatar
              src="https://api.dicebear.com/7.x/initials/svg?seed=Wheeler+Knight&backgroundColor=dc143c&textColor=ffffff"
              size={60}
              radius="md"
            />
            <Box style={{ flex: 1 }}>
              <Title order={4}>Wheeler Knight</Title>
              <Text size="sm" c="dimmed" mb="xs">
                Management Information Systems Student | Computer Science Minor
              </Text>
              <Text size="sm">
                Passionate about data analysis, business intelligence, and
                software development. Sharing insights on technology,
                programming, and my journey as a student developer.
              </Text>
              <Group gap="xs" mt="sm">
                <Anchor
                  href="https://linkedin.com/in/wheelerknight"
                  target="_blank"
                  size="sm"
                >
                  LinkedIn
                </Anchor>
                <Anchor
                  href="https://github.com/wheelerknight"
                  target="_blank"
                  size="sm"
                >
                  GitHub
                </Anchor>
                <Anchor href="/about" size="sm">
                  About Me
                </Anchor>
              </Group>
            </Box>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
};

export default BlogPostPage;
