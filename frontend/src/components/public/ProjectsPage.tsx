// Public Projects Page for Wheeler Knight Portfolio
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
  Select,
  Modal,
  Image,
  Anchor,
  Center,
  Loader,
  Alert,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconBrandGithub,
  IconExternalLink,
  IconCode,
  IconCalendar,
} from "@tabler/icons-react";
import { useProjects } from "../../hooks/useApi";

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { data: projectsData, isLoading } = useProjects({
    status: selectedStatus || undefined,
  });

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

  // Filter projects based on search term
  const filteredProjects =
    projectsData?.items?.filter(
      (project: any) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some((tech: string) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading projects...</Text>
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
            My Projects
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            A collection of my work showcasing my skills in software
            development, data analysis, and problem-solving.
          </Text>
        </Stack>

        {/* Filters */}
        <Card withBorder p="md">
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
                data={["completed", "in_progress", "planned"]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Alert color="blue" icon={<IconCode size={16} />}>
            No projects found matching your criteria.
          </Alert>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {filteredProjects.map((project: any) => (
              <Card
                key={project.id}
                withBorder
                p="md"
                style={{ height: "100%" }}
              >
                <Stack gap="md" style={{ height: "100%" }}>
                  {/* Project Image */}
                  {project.featured_image && (
                    <Box
                      style={{
                        height: 200,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={project.featured_image}
                        alt={project.title}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  )}

                  {/* Project Info */}
                  <Stack gap="sm" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Title order={3} lineClamp={1}>
                        {project.title}
                      </Title>
                      <Badge
                        color={getStatusColor(project.status)}
                        variant="light"
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={3}>
                      {project.description}
                    </Text>

                    {/* Technologies */}
                    <Group gap="xs">
                      {Array.isArray(project.technologies) &&
                        project.technologies
                          .slice(0, 4)
                          .map((tech: string, index: number) => (
                            <Badge key={index} size="sm" variant="outline">
                              {tech}
                            </Badge>
                          ))}
                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 4 && (
                          <Badge size="sm" variant="outline">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                    </Group>

                    {/* Dates */}
                    <Group gap="md">
                      <Group gap="xs">
                        <IconCalendar size={14} color="gray" />
                        <Text size="xs" c="dimmed">
                          Started: {formatDate(project.start_date)}
                        </Text>
                      </Group>
                      {project.end_date && (
                        <Group gap="xs">
                          <IconCalendar size={14} color="gray" />
                          <Text size="xs" c="dimmed">
                            Completed: {formatDate(project.end_date)}
                          </Text>
                        </Group>
                      )}
                    </Group>
                  </Stack>

                  {/* Action Buttons */}
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="sm"
                      leftSection={<IconCode size={16} />}
                      onClick={() => setSelectedProject(project)}
                      style={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftSection={<IconBrandGithub size={16} />}
                        component="a"
                        href={project.github_url}
                        target="_blank"
                      >
                        Code
                      </Button>
                    )}
                    {project.live_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftSection={<IconExternalLink size={16} />}
                        component="a"
                        href={project.live_url}
                        target="_blank"
                      >
                        Demo
                      </Button>
                    )}
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Project Details Modal */}
        <Modal
          opened={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title}
          size="lg"
        >
          {selectedProject && (
            <Stack gap="md">
              {selectedProject.featured_image && (
                <Image
                  src={selectedProject.featured_image}
                  alt={selectedProject.title}
                  height={300}
                  radius="md"
                />
              )}

              <Group justify="space-between">
                <Badge
                  color={getStatusColor(selectedProject.status)}
                  variant="light"
                  size="lg"
                >
                  {selectedProject.status.replace("_", " ")}
                </Badge>
                {selectedProject.is_featured && (
                  <Badge color="yellow" variant="light" size="lg">
                    Featured Project
                  </Badge>
                )}
              </Group>

              <Text>{selectedProject.description}</Text>

              {selectedProject.long_description && (
                <Text>{selectedProject.long_description}</Text>
              )}

              <div>
                <Text fw={500} mb="sm">
                  Technologies Used:
                </Text>
                <Group gap="xs">
                  {Array.isArray(selectedProject.technologies) &&
                    selectedProject.technologies.map(
                      (tech: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      )
                    )}
                </Group>
              </div>

              <div>
                <Text fw={500} mb="sm">
                  Project Timeline:
                </Text>
                <Group gap="md">
                  <Text size="sm">
                    <strong>Started:</strong>{" "}
                    {formatDate(selectedProject.start_date)}
                  </Text>
                  {selectedProject.end_date && (
                    <Text size="sm">
                      <strong>Completed:</strong>{" "}
                      {formatDate(selectedProject.end_date)}
                    </Text>
                  )}
                </Group>
              </div>

              <Group gap="md" mt="md">
                {selectedProject.github_url && (
                  <Button
                    leftSection={<IconBrandGithub size={16} />}
                    component="a"
                    href={selectedProject.github_url}
                    target="_blank"
                  >
                    View Source Code
                  </Button>
                )}
                {selectedProject.live_url && (
                  <Button
                    leftSection={<IconExternalLink size={16} />}
                    component="a"
                    href={selectedProject.live_url}
                    target="_blank"
                  >
                    Live Demo
                  </Button>
                )}
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default ProjectsPage;
