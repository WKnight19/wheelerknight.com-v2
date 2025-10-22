// Public Homepage for Wheeler Knight Portfolio
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
  Avatar,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Anchor,
  Box,
  Center,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconCode,
  IconBriefcase,
  IconArticle,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconSchool,
  IconHeart,
  IconBrandGithub,
  IconBrandLinkedin,
  IconExternalLink,
  IconDownload,
} from "@tabler/icons-react";
import {
  useSkills,
  useProjects,
  useBlogPosts,
  useEducation,
  useWorkExperience,
  useInterests,
} from "../../hooks/useApi";
import { useEffect } from "react";

const HomePage: React.FC = () => {
  // Fetch data for the homepage
  const { data: skills, isLoading: skillsLoading } = useSkills({
    featured: true,
  });
  const { data: projects, isLoading: projectsLoading } = useProjects({
    featured: true,
  });
  const { data: blogPosts, isLoading: blogLoading } = useBlogPosts({
    status: "published",
    per_page: 3,
  });
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: workExperience, isLoading: experienceLoading } =
    useWorkExperience();
  const { data: interests, isLoading: interestsLoading } = useInterests({
    featured: true,
  });

  const isLoading =
    skillsLoading ||
    projectsLoading ||
    blogLoading ||
    educationLoading ||
    experienceLoading ||
    interestsLoading;

  // Smooth scrolling effect
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "blue";
      case "soft":
        return "green";
      case "language":
        return "orange";
      case "certification":
        return "purple";
      default:
        return "gray";
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "movie":
        return "🎬";
      case "tv_show":
        return "📺";
      case "music":
        return "🎵";
      case "book":
        return "📚";
      case "sport":
        return "⚽";
      case "hobby":
        return "🎨";
      case "other":
        return "⭐";
      default:
        return "⭐";
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading portfolio...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Hero Section */}
          <Paper
            p="xl"
            withBorder
            radius="md"
            style={{
              background: "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)",
            }}
            className="animate-fade-in-up"
          >
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="md">
                  <Title order={1} c="white" size="3rem">
                    Wheeler Knight
                  </Title>
                  <Text size="xl" c="white" opacity={0.9}>
                    Management Information Systems Student | Computer Science
                    Minor
                  </Text>
                  <Text size="lg" c="white" opacity={0.8}>
                    University of Alabama | Class of 2026
                  </Text>
                  <Group gap="md" mt="md">
                    <Badge size="lg" variant="white" color="crimson">
                      Data Analyst
                    </Badge>
                    <Badge size="lg" variant="white" color="crimson">
                      Business Intelligence
                    </Badge>
                    <Badge size="lg" variant="white" color="crimson">
                      Software Developer
                    </Badge>
                  </Group>
                  <Group gap="md" mt="lg">
                    <Button
                      size="lg"
                      variant="white"
                      color="crimson"
                      leftSection={<IconMail size={20} />}
                      component="a"
                      href="#contact"
                      className="hover-lift"
                    >
                      Get In Touch
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      color="white"
                      leftSection={<IconDownload size={20} />}
                      className="hover-lift"
                    >
                      Download Resume
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Center>
                  <Avatar
                    src="https://api.dicebear.com/7.x/initials/svg?seed=Wheeler+Knight&backgroundColor=ffffff&textColor=dc143c"
                    size={200}
                    radius="md"
                    className="hover-lift"
                  />
                </Center>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* About Section */}
          <Card withBorder p="xl" className="animate-fade-in-up hover-lift">
            <Stack gap="md">
              <Title order={2} c="crimson">
                About Me
              </Title>
              <Text size="lg">
                I'm a senior at the University of Alabama studying Management
                Information Systems with a Computer Science minor. I'm
                passionate about data analysis, business intelligence, and
                software development. When I'm not coding or studying, you'll
                find me cheering on the Alabama Crimson Tide, playing golf, or
                spending time with my dog Brownie.
              </Text>
              <Group gap="md" mt="md">
                <Group gap="xs">
                  <IconMapPin size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    Moulton, Alabama
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconSchool size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    University of Alabama
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={16} color="gray" />
                  <Text size="sm" c="dimmed">
                    Class of 2026
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Card>

          {/* Featured Skills */}
          <Card withBorder p="xl" className="animate-fade-in-up hover-lift">
            <Stack gap="md">
              <Title order={2} c="crimson">
                Featured Skills
              </Title>
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {skills && skills.items && Array.isArray(skills.items)
                  ? skills.items.slice(0, 8).map((skill: any) => (
                      <Paper
                        key={skill.id}
                        p="md"
                        withBorder
                        className="hover-lift"
                      >
                        <Stack gap="xs" align="center">
                          {skill.icon && <Text size="xl">{skill.icon}</Text>}
                          <Text fw={500} ta="center">
                            {skill.name}
                          </Text>
                          <Badge
                            color={getCategoryColor(skill.category)}
                            variant="light"
                            size="sm"
                          >
                            {skill.category}
                          </Badge>
                          <Badge color="blue" variant="outline" size="xs">
                            {skill.proficiency_level}/5
                          </Badge>
                        </Stack>
                      </Paper>
                    ))
                  : null}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Featured Projects */}
          <Card withBorder p="xl" className="animate-fade-in-up hover-lift">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={2} c="crimson">
                  Featured Projects
                </Title>
                <Button
                  variant="outline"
                  component="a"
                  href="/projects"
                  className="hover-lift"
                >
                  View All Projects
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {projects && projects.items && Array.isArray(projects.items)
                  ? projects.items.slice(0, 4).map((project: any) => (
                      <Card
                        key={project.id}
                        withBorder
                        p="md"
                        className="hover-lift"
                      >
                        <Stack gap="md">
                          <Group justify="space-between">
                            <Title order={4}>{project.title}</Title>
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
                          <Group gap="xs">
                            {Array.isArray(project.technologies) &&
                              project.technologies
                                .slice(0, 3)
                                .map((tech: string, index: number) => (
                                  <Badge
                                    key={index}
                                    size="sm"
                                    variant="outline"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                          </Group>
                          <Group gap="xs">
                            {project.github_url && (
                              <Button
                                size="sm"
                                variant="light"
                                leftSection={<IconBrandGithub size={16} />}
                                component="a"
                                href={project.github_url}
                                target="_blank"
                                className="hover-lift"
                              >
                                GitHub
                              </Button>
                            )}
                            {project.live_url && (
                              <Button
                                size="sm"
                                variant="light"
                                leftSection={<IconExternalLink size={16} />}
                                component="a"
                                href={project.live_url}
                                target="_blank"
                                className="hover-lift"
                              >
                                Live Demo
                              </Button>
                            )}
                          </Group>
                        </Stack>
                      </Card>
                    ))
                  : null}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Education & Experience */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder p="xl">
                <Stack gap="md">
                  <Title order={3} c="crimson">
                    Education
                  </Title>
                  {education && Array.isArray(education)
                    ? education.map((edu: any) => (
                        <Paper key={edu.id} p="md" withBorder>
                          <Stack gap="xs">
                            <Group justify="space-between">
                              <Text fw={500}>{edu.institution}</Text>
                              <Badge color="blue" variant="light">
                                {edu.is_current ? "Current" : "Completed"}
                              </Badge>
                            </Group>
                            <Text size="sm">{edu.degree}</Text>
                            {edu.field_of_study && (
                              <Text size="sm" c="dimmed">
                                {edu.field_of_study}
                              </Text>
                            )}
                            {edu.gpa &&
                              typeof edu.gpa === "number" &&
                              edu.gpa > 0 && (
                                <Text size="sm" c="dimmed">
                                  GPA: {edu.gpa.toFixed(2)}
                                </Text>
                              )}
                          </Stack>
                        </Paper>
                      ))
                    : null}
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder p="xl">
                <Stack gap="md">
                  <Title order={3} c="crimson">
                    Work Experience
                  </Title>
                  {workExperience && Array.isArray(workExperience)
                    ? workExperience.map((exp: any) => (
                        <Paper key={exp.id} p="md" withBorder>
                          <Stack gap="xs">
                            <Group justify="space-between">
                              <Text fw={500}>{exp.company}</Text>
                              <Badge color="green" variant="light">
                                {exp.is_current ? "Current" : "Previous"}
                              </Badge>
                            </Group>
                            <Text size="sm">{exp.position}</Text>
                            {exp.location && (
                              <Text size="sm" c="dimmed">
                                {exp.location}
                              </Text>
                            )}
                            {exp.description && (
                              <Text size="sm" c="dimmed" lineClamp={2}>
                                {exp.description}
                              </Text>
                            )}
                          </Stack>
                        </Paper>
                      ))
                    : null}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Latest Blog Posts */}
          <Card withBorder p="xl">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={2} c="crimson">
                  Latest Blog Posts
                </Title>
                <Button variant="outline" component="a" href="/blog">
                  View All Posts
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                {blogPosts && blogPosts.items && Array.isArray(blogPosts.items)
                  ? blogPosts.items.map((post: any) => (
                      <Card key={post.id} withBorder p="md">
                        <Stack gap="md">
                          {post.featured_image && (
                            <Box
                              style={{
                                height: 200,
                                background: `url(${post.featured_image}) center/cover`,
                              }}
                            />
                          )}
                          <Stack gap="xs">
                            <Title order={4}>{post.title}</Title>
                            <Text size="sm" c="dimmed" lineClamp={3}>
                              {post.excerpt ||
                                post.content?.substring(0, 150) + "..."}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {post.published_at
                                ? new Date(
                                    post.published_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </Text>
                          </Stack>
                          <Button
                            variant="light"
                            size="sm"
                            component="a"
                            href={`/blog/${post.slug}`}
                          >
                            Read More
                          </Button>
                        </Stack>
                      </Card>
                    ))
                  : null}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Interests */}
          <Card withBorder p="xl">
            <Stack gap="md">
              <Title order={2} c="crimson">
                What I'm Into
              </Title>
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {interests && Array.isArray(interests)
                  ? interests.slice(0, 8).map((interest: any) => (
                      <Paper key={interest.id} p="md" withBorder>
                        <Stack gap="xs" align="center">
                          <Text size="xl">
                            {getCategoryIcon(interest.category)}
                          </Text>
                          <Text fw={500} ta="center">
                            {interest.title}
                          </Text>
                          <Badge color="gray" variant="light" size="sm">
                            {interest.category.replace("_", " ")}
                          </Badge>
                        </Stack>
                      </Paper>
                    ))
                  : null}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Contact Section */}
          <Card
            id="contact"
            withBorder
            p="xl"
            className="animate-fade-in-up hover-lift"
          >
            <Stack gap="md">
              <Title order={2} c="crimson">
                Get In Touch
              </Title>
              <Text size="lg">
                I'm always interested in new opportunities and collaborations.
                Whether you have a project in mind or just want to chat about
                technology, feel free to reach out!
              </Text>
              <Group gap="md" mt="md">
                <Button
                  size="lg"
                  leftSection={<IconMail size={20} />}
                  component="a"
                  href="mailto:wheeler@wheelerknight.com"
                  className="hover-lift"
                >
                  Send Email
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  leftSection={<IconBrandLinkedin size={20} />}
                  component="a"
                  href="https://linkedin.com/in/wheelerknight"
                  target="_blank"
                  className="hover-lift"
                >
                  LinkedIn
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  leftSection={<IconBrandGithub size={20} />}
                  component="a"
                  href="https://github.com/wheelerknight"
                  target="_blank"
                  className="hover-lift"
                >
                  GitHub
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default HomePage;
