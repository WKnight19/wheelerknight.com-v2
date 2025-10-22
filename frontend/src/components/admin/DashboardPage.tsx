// Admin Dashboard Component for Wheeler Knight Portfolio
import React from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Badge,
  Progress,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Divider,
} from "@mantine/core";
import {
  IconCode,
  IconBriefcase,
  IconArticle,
  IconMail,
  IconSchool,
  IconHeart,
  IconTrendingUp,
  IconUsers,
  IconEye,
  IconHeart as IconHeartFilled,
} from "@tabler/icons-react";
import {
  useSkillsStats,
  useProjectsStats,
  useBlogStats,
  useContactStats,
} from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: skillsStats, isLoading: skillsLoading } = useSkillsStats();
  const { data: projectsStats, isLoading: projectsLoading } =
    useProjectsStats();
  const { data: blogStats, isLoading: blogLoading } = useBlogStats();
  const { data: contactStats, isLoading: contactLoading } = useContactStats();

  const statsCards = [
    {
      title: "Skills",
      value: skillsStats?.total_skills || 0,
      icon: IconCode,
      color: "blue",
      description: `${skillsStats?.featured_skills || 0} featured`,
    },
    {
      title: "Projects",
      value: projectsStats?.total_projects || 0,
      icon: IconBriefcase,
      color: "green",
      description: `${projectsStats?.featured_projects || 0} featured`,
    },
    {
      title: "Blog Posts",
      value: blogStats?.total_posts || 0,
      icon: IconArticle,
      color: "orange",
      description: `${blogStats?.published_posts || 0} published`,
    },
    {
      title: "Messages",
      value: contactStats?.total_messages || 0,
      icon: IconMail,
      color: "red",
      description: `${contactStats?.new_messages || 0} new`,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "red";
      case "read":
        return "blue";
      case "replied":
        return "green";
      case "archived":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <div>
          <Title order={1} c="crimson">
            Dashboard
          </Title>
          <Text c="dimmed" size="sm">
            Welcome to Wheeler Knight Portfolio Admin Dashboard
          </Text>
        </div>

        {/* Stats Overview */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      {stat.title}
                    </Text>
                    <Text fw={700} size="xl">
                      {stat.value}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {stat.description}
                    </Text>
                  </div>
                  <ThemeIcon color={stat.color} size={38} radius="md">
                    <Icon size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>

        <Grid>
          {/* Skills Breakdown */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap="md">
                <Title order={3}>Skills by Category</Title>
                {skillsStats?.category_stats && (
                  <Stack gap="xs">
                    {Object.entries(skillsStats.category_stats).map(
                      ([category, count]) => (
                        <div key={category}>
                          <Group justify="space-between" mb={5}>
                            <Text size="sm" tt="capitalize">
                              {category.replace("_", " ")}
                            </Text>
                            <Text size="sm" fw={500}>
                              {count as number}
                            </Text>
                          </Group>
                          <Progress
                            value={
                              ((count as number) /
                                (skillsStats.total_skills || 1)) *
                              100
                            }
                            size="sm"
                            radius="xl"
                          />
                        </div>
                      )
                    )}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Projects Status */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap="md">
                <Title order={3}>Projects by Status</Title>
                {projectsStats?.status_stats && (
                  <Stack gap="xs">
                    {Object.entries(projectsStats.status_stats).map(
                      ([status, count]) => (
                        <Group key={status} justify="space-between">
                          <Badge
                            color={
                              status === "completed"
                                ? "green"
                                : status === "in_progress"
                                ? "blue"
                                : "gray"
                            }
                            variant="light"
                            tt="capitalize"
                          >
                            {status.replace("_", " ")}
                          </Badge>
                          <Text fw={500}>{count as number}</Text>
                        </Group>
                      )
                    )}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Blog Analytics */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap="md">
                <Title order={3}>Blog Analytics</Title>
                <SimpleGrid cols={2} spacing="md">
                  <Paper p="md" withBorder>
                    <Group>
                      <ThemeIcon color="blue" size="lg" radius="md">
                        <IconEye size={20} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Total Views
                        </Text>
                        <Text fw={700} size="lg">
                          {blogStats?.total_views || 0}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                  <Paper p="md" withBorder>
                    <Group>
                      <ThemeIcon color="red" size="lg" radius="md">
                        <IconHeartFilled size={20} />
                      </ThemeIcon>
                      <div>
                        <Text size="xs" c="dimmed">
                          Total Likes
                        </Text>
                        <Text fw={700} size="lg">
                          {blogStats?.total_likes || 0}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Recent Messages */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Stack gap="md">
                <Title order={3}>Recent Messages</Title>
                {contactStats?.recent_messages &&
                contactStats.recent_messages.length > 0 ? (
                  <Stack gap="xs">
                    {contactStats.recent_messages
                      .slice(0, 5)
                      .map((message: any) => (
                        <Paper key={message.id} p="sm" withBorder>
                          <Group justify="space-between" mb="xs">
                            <Text size="sm" fw={500}>
                              {message.name}
                            </Text>
                            <Badge
                              color={getStatusColor(message.status)}
                              size="xs"
                              variant="light"
                            >
                              {message.status}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {message.message}
                          </Text>
                          <Text size="xs" c="dimmed" mt="xs">
                            {new Date(message.created_at).toLocaleDateString()}
                          </Text>
                        </Paper>
                      ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    No recent messages
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Quick Actions */}
        <Card withBorder>
          <Stack gap="md">
            <Title order={3}>Quick Actions</Title>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              <Card
                withBorder
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/admin/skills")}
              >
                <Group>
                  <ThemeIcon color="blue" size="lg">
                    <IconCode size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      Manage Skills
                    </Text>
                    <Text size="xs" c="dimmed">
                      View and edit skills
                    </Text>
                  </div>
                </Group>
              </Card>
              <Card
                withBorder
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/admin/projects")}
              >
                <Group>
                  <ThemeIcon color="green" size="lg">
                    <IconBriefcase size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      Manage Projects
                    </Text>
                    <Text size="xs" c="dimmed">
                      View and edit projects
                    </Text>
                  </div>
                </Group>
              </Card>
              <Card
                withBorder
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/admin/blog")}
              >
                <Group>
                  <ThemeIcon color="orange" size="lg">
                    <IconArticle size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      Manage Blog
                    </Text>
                    <Text size="xs" c="dimmed">
                      View and edit posts
                    </Text>
                  </div>
                </Group>
              </Card>
              <Card
                withBorder
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/admin/messages")}
              >
                <Group>
                  <ThemeIcon color="red" size="lg">
                    <IconMail size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={500}>
                      View Messages
                    </Text>
                    <Text size="xs" c="dimmed">
                      Check inbox
                    </Text>
                  </div>
                </Group>
              </Card>
            </SimpleGrid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
