// Projects Management Component for Wheeler Knight Portfolio Admin
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
  Anchor,
  NumberInput,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconBriefcase,
  IconExternalLink,
  IconBrandGithub,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useProjects,
  useProjectStatuses,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../../hooks/useApi";
import FileUpload from "../ui/FileUpload";

interface ProjectFormData {
  title: string;
  description: string;
  long_description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  featured_image: string;
  images: string[];
  status: string;
  start_date: string;
  end_date: string;
  display_order: number;
  is_featured: boolean;
}

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const {
    data: projectsData,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useProjects({
    status: selectedStatus || undefined,
    page: currentPage,
    per_page: 10,
  });

  const { data: statuses } = useProjectStatuses();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Form setup
  const form = useForm<ProjectFormData>({
    initialValues: {
      title: "",
      description: "",
      long_description: "",
      technologies: [],
      github_url: "",
      live_url: "",
      featured_image: "",
      images: [],
      status: "completed",
      start_date: "",
      end_date: "",
      display_order: 0,
      is_featured: false,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      status: (value) => (!value ? "Status is required" : null),
    },
  });

  // Filter projects based on search term
  const filteredProjects =
    projectsData?.items?.filter(
      (project: any) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreate = async (values: ProjectFormData) => {
    try {
      await createProjectMutation.mutateAsync(values);
      notifications.show({
        title: "Success",
        message: "Project created successfully",
        color: "green",
      });
      setOpened(false);
      form.reset();
      refetchProjects();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create project",
        color: "red",
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    form.setValues({
      title: project.title,
      description: project.description,
      long_description: project.long_description || "",
      technologies: project.technologies || [],
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      featured_image: project.featured_image || "",
      images: project.images || [],
      status: project.status,
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      display_order: project.display_order || 0,
      is_featured: project.is_featured || false,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: ProjectFormData) => {
    if (!editingProject) return;

    try {
      await updateProjectMutation.mutateAsync({
        id: editingProject.id,
        data: values,
      });
      notifications.show({
        title: "Success",
        message: "Project updated successfully",
        color: "green",
      });
      setOpened(false);
      setEditingProject(null);
      form.reset();
      refetchProjects();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update project",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      await deleteProjectMutation.mutateAsync(deleteModal.id);
      notifications.show({
        title: "Success",
        message: "Project deleted successfully",
        color: "green",
      });
      setDeleteModal(null);
      refetchProjects();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete project",
        color: "red",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "in_progress":
        return "blue";
      case "planned":
        return "orange";
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
              Projects Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your portfolio projects
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingProject(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Project
          </Button>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search projects..."
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

        {/* Projects Table */}
        <Card withBorder>
          <LoadingOverlay visible={projectsLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Technologies</Table.Th>
                <Table.Th>Featured</Table.Th>
                <Table.Th>Links</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredProjects.map((project: any) => (
                <Table.Tr key={project.id}>
                  <Table.Td>
                    <Group gap="sm">
                      {project.featured_image && (
                        <Image
                          src={project.featured_image}
                          alt={project.title}
                          width={40}
                          height={40}
                          radius="sm"
                        />
                      )}
                      <div>
                        <Text fw={500}>{project.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {project.description}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(project.status)}
                      variant="light"
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {Array.isArray(project.technologies) &&
                        project.technologies
                          .slice(0, 3)
                          .map((tech: string, index: number) => (
                            <Badge key={index} size="sm" variant="outline">
                              {tech}
                            </Badge>
                          ))}
                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 3 && (
                          <Badge size="sm" variant="outline">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {project.is_featured ? (
                      <Badge color="green" variant="light">
                        Featured
                      </Badge>
                    ) : (
                      <Badge color="gray" variant="light">
                        Regular
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {project.github_url && (
                        <ActionIcon
                          variant="light"
                          color="gray"
                          component="a"
                          href={project.github_url}
                          target="_blank"
                        >
                          <IconBrandGithub size={16} />
                        </ActionIcon>
                      )}
                      {project.live_url && (
                        <ActionIcon
                          variant="light"
                          color="blue"
                          component="a"
                          href={project.live_url}
                          target="_blank"
                        >
                          <IconExternalLink size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(project)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(project)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {projectsData?.pagination && (
            <Group justify="center" mt="md">
              <Pagination
                total={projectsData.pagination.total_pages}
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
            setEditingProject(null);
            form.reset();
          }}
          title={editingProject ? "Edit Project" : "Add New Project"}
          size="xl"
        >
          <form
            onSubmit={form.onSubmit(
              editingProject ? handleUpdate : handleCreate
            )}
          >
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Project Title"
                    placeholder="e.g., Wheeler Knight Portfolio"
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
                      { value: "completed", label: "Completed" },
                      { value: "in_progress", label: "In Progress" },
                      { value: "planned", label: "Planned" },
                    ]}
                    {...form.getInputProps("status")}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Short Description"
                placeholder="Brief description of the project..."
                rows={2}
                required
                {...form.getInputProps("description")}
              />

              <Textarea
                label="Long Description"
                placeholder="Detailed description of the project..."
                rows={4}
                {...form.getInputProps("long_description")}
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="GitHub URL"
                    placeholder="https://github.com/username/repo"
                    {...form.getInputProps("github_url")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Live URL"
                    placeholder="https://project-demo.com"
                    {...form.getInputProps("live_url")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Featured Image URL"
                    placeholder="https://example.com/image.jpg"
                    {...form.getInputProps("featured_image")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Display Order"
                    placeholder="0"
                    min={0}
                    {...form.getInputProps("display_order")}
                  />
                </Grid.Col>
              </Grid>

              <FileUpload
                type="image"
                label="Or Upload Featured Image"
                description="Upload an image file for the project featured image"
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

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Start Date"
                    type="date"
                    {...form.getInputProps("start_date")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="End Date"
                    type="date"
                    {...form.getInputProps("end_date")}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Technologies (comma-separated)"
                placeholder="React, Python, MySQL, Docker"
                {...form.getInputProps("technologies")}
              />

              <Switch
                label="Featured Project"
                description="Show this project prominently on the portfolio"
                {...form.getInputProps("is_featured", { type: "checkbox" })}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingProject(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    createProjectMutation.isPending ||
                    updateProjectMutation.isPending
                  }
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Project"
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
                loading={deleteProjectMutation.isPending}
                onClick={handleDelete}
              >
                Delete Project
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default ProjectsPage;
