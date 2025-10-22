// Blog Posts Management Component for Wheeler Knight Portfolio Admin
import React, { useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Textarea,
  Switch,
  Stack,
  Grid,
  Pagination,
  Alert,
  LoadingOverlay,
  Image,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconArticle,
  IconEye,
  IconHeart,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useBlogPosts,
  usePostStatuses,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "../../hooks/useApi";
import FileUpload from "../ui/FileUpload";

interface BlogPostFormData {
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  status: string;
}

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const {
    data: postsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useBlogPosts({
    status: selectedStatus || undefined,
    page: currentPage,
    per_page: 10,
  });

  const { data: statuses } = usePostStatuses();
  const createPostMutation = useCreateBlogPost();
  const updatePostMutation = useUpdateBlogPost();
  const deletePostMutation = useDeleteBlogPost();

  // Form setup
  const form = useForm<BlogPostFormData>({
    initialValues: {
      title: "",
      content: "",
      slug: "",
      excerpt: "",
      featured_image: "",
      status: "draft",
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      content: (value) => (!value ? "Content is required" : null),
      status: (value) => (!value ? "Status is required" : null),
    },
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Filter posts based on search term
  const filteredPosts =
    postsData?.items?.filter(
      (post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreate = async (values: BlogPostFormData) => {
    try {
      const postData = {
        ...values,
        slug: values.slug || generateSlug(values.title),
      };
      await createPostMutation.mutateAsync(postData);
      notifications.show({
        title: "Success",
        message: "Blog post created successfully",
        color: "green",
      });
      setOpened(false);
      form.reset();
      refetchPosts();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create blog post",
        color: "red",
      });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    form.setValues({
      title: post.title,
      content: post.content,
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      featured_image: post.featured_image || "",
      status: post.status,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: BlogPostFormData) => {
    if (!editingPost) return;

    try {
      const postData = {
        ...values,
        slug: values.slug || generateSlug(values.title),
      };
      await updatePostMutation.mutateAsync({
        id: editingPost.id,
        data: postData,
      });
      notifications.show({
        title: "Success",
        message: "Blog post updated successfully",
        color: "green",
      });
      setOpened(false);
      setEditingPost(null);
      form.reset();
      refetchPosts();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update blog post",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      await deletePostMutation.mutateAsync(deleteModal.id);
      notifications.show({
        title: "Success",
        message: "Blog post deleted successfully",
        color: "green",
      });
      setDeleteModal(null);
      refetchPosts();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete blog post",
        color: "red",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "yellow";
      case "archived":
        return "gray";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} c="crimson">
              Blog Posts Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your blog posts and articles
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingPost(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Post
          </Button>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search posts..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                placeholder="Filter by status"
                leftSection={<IconFilter size={16} />}
                data={statuses || []}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Posts Table */}
        <Card withBorder>
          <LoadingOverlay visible={postsLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Post</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Published</Table.Th>
                <Table.Th>Engagement</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredPosts.map((post: any) => (
                <Table.Tr key={post.id}>
                  <Table.Td>
                    <Group gap="sm">
                      {post.featured_image && (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          width={40}
                          height={40}
                          radius="sm"
                        />
                      )}
                      <div>
                        <Text fw={500}>{post.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {post.excerpt ||
                            post.content?.substring(0, 100) + "..."}
                        </Text>
                        <Text size="xs" c="dimmed">
                          /{post.slug}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(post.status)} variant="light">
                      {post.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(post.published_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Group gap={4}>
                        <IconEye size={14} />
                        <Text size="sm">{post.views_count || 0}</Text>
                      </Group>
                      <Group gap={4}>
                        <IconHeart size={14} />
                        <Text size="sm">{post.likes_count || 0}</Text>
                      </Group>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(post)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(post)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {postsData?.pagination && (
            <Group justify="center" mt="md">
              <Pagination
                total={postsData.pagination.total_pages}
                value={currentPage}
                onChange={setCurrentPage}
              />
            </Group>
          )}
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          opened={opened}
          onClose={() => {
            setOpened(false);
            setEditingPost(null);
            form.reset();
          }}
          title={editingPost ? "Edit Blog Post" : "Add New Blog Post"}
          size="xl"
        >
          <form
            onSubmit={form.onSubmit(editingPost ? handleUpdate : handleCreate)}
          >
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Post Title"
                    placeholder="Enter post title..."
                    required
                    {...form.getInputProps("title")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Status"
                    placeholder="Select status"
                    required
                    data={[
                      { value: "draft", label: "Draft" },
                      { value: "published", label: "Published" },
                      { value: "archived", label: "Archived" },
                    ]}
                    {...form.getInputProps("status")}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Slug (URL)"
                placeholder="auto-generated-from-title"
                {...form.getInputProps("slug")}
              />

              <TextInput
                label="Featured Image URL"
                placeholder="https://example.com/image.jpg"
                {...form.getInputProps("featured_image")}
              />

              <FileUpload
                type="image"
                label="Or Upload Featured Image"
                description="Upload an image file for the featured image"
                onUploadSuccess={(fileUrl) => {
                  form.setFieldValue("featured_image", fileUrl);
                }}
                onUploadError={(error) => {
                  notifications.show({
                    title: "Upload Error",
                    message: error,
                    color: "red",
                  });
                }}
                maxSize={5 * 1024 * 1024} // 5MB for images
                accept="image/*"
              />

              <Textarea
                label="Excerpt"
                placeholder="Brief summary of the post..."
                rows={2}
                {...form.getInputProps("excerpt")}
              />

              <Textarea
                label="Content"
                placeholder="Write your blog post content here..."
                rows={12}
                required
                {...form.getInputProps("content")}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingPost(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    createPostMutation.isPending || updatePostMutation.isPending
                  }
                >
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Blog Post"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete "{deleteModal?.title}"? This
              action cannot be undone.
            </Alert>
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setDeleteModal(null)}>
                Cancel
              </Button>
              <Button
                color="red"
                loading={deletePostMutation.isPending}
                onClick={handleDelete}
              >
                Delete Post
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default BlogPage;
