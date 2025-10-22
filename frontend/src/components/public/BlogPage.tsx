// Public Blog Page for Wheeler Knight Portfolio
import React, { useState } from "react";
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
  SimpleGrid,
  TextInput,
  Modal,
  Image,
  Center,
  Loader,
  Alert,
  Paper,
  Anchor,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconCalendar,
  IconEye,
  IconHeart,
  IconArticle,
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useBlogPosts, useBlogPost, useLikeBlogPost } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data: postsData, isLoading } = useBlogPosts({
    status: "published",
    per_page: 12,
    page: currentPage,
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

  // Filter posts based on search term
  const filteredPosts =
    postsData?.items?.filter(
      (post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading blog posts...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="md" align="center" ta="center">
          <Title order={1} c="crimson" size="3rem">
            My Blog
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            Thoughts on technology, programming, and my journey as a student
            developer.
          </Text>
        </Stack>

        {/* Search */}
        <Card withBorder p="md">
          <TextInput
            placeholder="Search blog posts..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </Card>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Alert color="blue" icon={<IconArticle size={16} />}>
            No blog posts found matching your search.
          </Alert>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {filteredPosts.map((post: any) => (
              <Card key={post.id} withBorder p="md" style={{ height: "100%" }}>
                <Stack gap="md" style={{ height: "100%" }}>
                  {/* Featured Image */}
                  {post.featured_image && (
                    <Box
                      style={{
                        height: 200,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  )}

                  {/* Post Content */}
                  <Stack gap="sm" style={{ flex: 1 }}>
                    <Title order={3} lineClamp={2}>
                      {post.title}
                    </Title>

                    <Text size="sm" c="dimmed" lineClamp={3}>
                      {post.excerpt || post.content?.substring(0, 150) + "..."}
                    </Text>

                    <Group gap="md" mt="auto">
                      <Group gap="xs">
                        <IconCalendar size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                          {formatDate(post.published_at)}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconEye size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                          {post.views_count || 0} views
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconHeart size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                          {post.likes_count || 0} likes
                        </Text>
                      </Group>
                    </Group>
                  </Stack>

                  {/* Read More Button */}
                  <Button
                    variant="light"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    fullWidth
                  >
                    Read More
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {postsData?.pagination && postsData.pagination.pages > 1 && (
          <Group justify="center" mt="xl">
            <Button
              variant="outline"
              leftSection={<IconChevronLeft size={16} />}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text size="sm" c="dimmed">
              Page {currentPage} of {postsData.pagination.pages}
            </Text>
            <Button
              variant="outline"
              rightSection={<IconChevronRight size={16} />}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === postsData.pagination.pages}
            >
              Next
            </Button>
          </Group>
        )}

        {/* Blog Post Modal */}
        <Modal
          opened={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title={selectedPost?.title}
          size="xl"
        >
          {selectedPost && (
            <Stack gap="md">
              {selectedPost.featured_image && (
                <Image
                  src={selectedPost.featured_image}
                  alt={selectedPost.title}
                  height={300}
                  radius="md"
                />
              )}

              <Group gap="md">
                <Group gap="xs">
                  <IconCalendar size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    {formatDate(selectedPost.published_at)}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconEye size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    {selectedPost.views_count || 0} views
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconHeart size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    {selectedPost.likes_count || 0} likes
                  </Text>
                </Group>
              </Group>

              <Paper p="md" withBorder>
                <Text style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {selectedPost.content}
                </Text>
              </Paper>

              <Group gap="md" mt="md">
                <Button
                  variant="outline"
                  leftSection={<IconHeart size={16} />}
                  onClick={async () => {
                    try {
                      await likePost.mutateAsync(selectedPost.id);
                      // Update the post's like count locally
                      setSelectedPost({
                        ...selectedPost,
                        likes_count: (selectedPost.likes_count || 0) + 1,
                      });
                    } catch (error) {
                      console.error("Failed to like post:", error);
                    }
                  }}
                  loading={likePost.isPending}
                >
                  Like Post ({selectedPost.likes_count || 0})
                </Button>
                <Button
                  variant="outline"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => setSelectedPost(null)}
                >
                  Back to Blog
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default BlogPage;
