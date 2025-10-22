// Public About Page for Wheeler Knight Portfolio
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
  Progress,
  Timeline,
  Avatar,
  Divider,
} from "@mantine/core";
import {
  IconCode,
  IconBriefcase,
  IconSchool,
  IconMapPin,
  IconCalendar,
  IconHeart,
  IconBrandGithub,
  IconBrandLinkedin,
  IconDownload,
  IconTrophy,
  IconStar,
  IconUsers,
  IconBook,
  IconTarget,
} from "@tabler/icons-react";
import {
  useSkills,
  useEducation,
  useWorkExperience,
  useInterests,
  useProjects,
} from "../../hooks/useApi";

const AboutPage: React.FC = () => {
  // Fetch data for the about page
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: workExperience, isLoading: experienceLoading } =
    useWorkExperience();
  const { data: interests, isLoading: interestsLoading } = useInterests();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const isLoading =
    skillsLoading ||
    educationLoading ||
    experienceLoading ||
    interestsLoading ||
    projectsLoading;

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
          <Text c="dimmed">Loading profile...</Text>
        </Stack>
      </Center>
    );
  }

  return (
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
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                <Title order={1} c="white" size="3rem">
                  About Wheeler Knight
                </Title>
                <Text size="xl" c="white" opacity={0.9}>
                  Management Information Systems Student | Computer Science
                  Minor
                </Text>
                <Text size="lg" c="white" opacity={0.8}>
                  Passionate about data analysis, business intelligence, and
                  software development
                </Text>
                <Group gap="md" mt="md">
                  <Group gap="xs">
                    <IconMapPin size={16} color="white" />
                    <Text c="white" size="sm">
                      Moulton, Alabama
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconSchool size={16} color="white" />
                    <Text c="white" size="sm">
                      University of Alabama
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconCalendar size={16} color="white" />
                    <Text c="white" size="sm">
                      Class of 2026
                    </Text>
                  </Group>
                </Group>
                <Group gap="md" mt="lg">
                  <Button
                    size="lg"
                    variant="white"
                    color="crimson"
                    leftSection={<IconDownload size={20} />}
                    className="hover-lift"
                  >
                    Download Resume
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    leftSection={<IconBrandLinkedin size={20} />}
                    component="a"
                    href="https://linkedin.com/in/wheelerknight"
                    target="_blank"
                    className="hover-lift"
                  >
                    LinkedIn
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

        {/* Professional Summary */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Professional Summary
            </Title>
            <Text size="lg" style={{ lineHeight: 1.6 }}>
              I'm a senior at the University of Alabama studying Management
              Information Systems with a Computer Science minor. My passion lies
              at the intersection of technology and business, where I can
              leverage data-driven insights to solve complex problems and drive
              strategic decisions.
            </Text>
            <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
              With a strong foundation in both technical and business concepts,
              I'm pursuing opportunities in data analysis, business
              intelligence, software development, and consulting. When I'm not
              coding or analyzing data, you'll find me cheering on the Alabama
              Crimson Tide, playing golf, or spending time with my dog Brownie.
            </Text>
          </Stack>
        </Card>

        {/* Skills Visualization */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Skills & Expertise
            </Title>
            <Text size="md" c="dimmed">
              A comprehensive overview of my technical and soft skills,
              organized by category and proficiency level.
            </Text>

            {skills?.items && (
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {/* Technical Skills */}
                <Stack gap="md">
                  <Title order={3}>Technical Skills</Title>
                  {skills.items
                    .filter((skill: any) => skill.category === "technical")
                    .map((skill: any) => (
                      <Box key={skill.id}>
                        <Group justify="space-between" mb={5}>
                          <Text fw={500}>{skill.name}</Text>
                          <Text size="sm" c="dimmed">
                            {skill.proficiency_level}/5
                          </Text>
                        </Group>
                        <Progress
                          value={(skill.proficiency_level / 5) * 100}
                          size="sm"
                          radius="xl"
                          color="blue"
                        />
                      </Box>
                    ))}
                </Stack>

                {/* Soft Skills */}
                <Stack gap="md">
                  <Title order={3}>Soft Skills</Title>
                  {skills.items
                    .filter((skill: any) => skill.category === "soft")
                    .map((skill: any) => (
                      <Box key={skill.id}>
                        <Group justify="space-between" mb={5}>
                          <Text fw={500}>{skill.name}</Text>
                          <Text size="sm" c="dimmed">
                            {skill.proficiency_level}/5
                          </Text>
                        </Group>
                        <Progress
                          value={(skill.proficiency_level / 5) * 100}
                          size="sm"
                          radius="xl"
                          color="green"
                        />
                      </Box>
                    ))}
                </Stack>
              </SimpleGrid>
            )}
          </Stack>
        </Card>

        {/* Education Timeline */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Education
            </Title>
            <Timeline
              active={education?.length || 0}
              bulletSize={24}
              lineWidth={2}
            >
              {education && Array.isArray(education)
                ? education.map((edu: any) => (
                    <Timeline.Item
                      key={edu.id}
                      bullet={<IconSchool size={12} />}
                      title={edu.institution}
                    >
                      <Text fw={500} size="lg">
                        {edu.degree}
                      </Text>
                      {edu.field_of_study && (
                        <Text size="sm" c="dimmed">
                          {edu.field_of_study}
                        </Text>
                      )}
                      <Group gap="md" mt="xs">
                        {edu.gpa &&
                          typeof edu.gpa === "number" &&
                          edu.gpa > 0 && (
                            <Badge color="blue" variant="light">
                              GPA: {edu.gpa.toFixed(2)}
                            </Badge>
                          )}
                        <Badge
                          color={edu.is_current ? "green" : "gray"}
                          variant="light"
                        >
                          {edu.is_current ? "Current" : "Completed"}
                        </Badge>
                      </Group>
                      {edu.description && (
                        <Text size="sm" mt="xs">
                          {edu.description}
                        </Text>
                      )}
                    </Timeline.Item>
                  ))
                : null}
            </Timeline>
          </Stack>
        </Card>

        {/* Work Experience */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Work Experience
            </Title>
            {workExperience && Array.isArray(workExperience) ? (
              workExperience.map((exp: any) => (
                <Paper key={exp.id} p="md" withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Title order={4}>{exp.position}</Title>
                      <Badge
                        color={exp.is_current ? "green" : "blue"}
                        variant="light"
                      >
                        {exp.is_current ? "Current" : "Previous"}
                      </Badge>
                    </Group>
                    <Text fw={500} c="crimson">
                      {exp.company}
                    </Text>
                    {exp.location && (
                      <Group gap="xs">
                        <IconMapPin size={14} color="gray" />
                        <Text size="sm" c="dimmed">
                          {exp.location}
                        </Text>
                      </Group>
                    )}
                    {exp.description && (
                      <Text size="sm" style={{ lineHeight: 1.5 }}>
                        {exp.description}
                      </Text>
                    )}
                    {Array.isArray(exp.technologies) &&
                      exp.technologies.length > 0 && (
                        <Group gap="xs" mt="sm">
                          <Text size="sm" fw={500}>
                            Technologies:
                          </Text>
                          {exp.technologies.map(
                            (tech: string, index: number) => (
                              <Badge key={index} size="sm" variant="outline">
                                {tech}
                              </Badge>
                            )
                          )}
                        </Group>
                      )}
                  </Stack>
                </Paper>
              ))
            ) : (
              <Text c="dimmed">No work experience recorded yet.</Text>
            )}
          </Stack>
        </Card>

        {/* Projects Overview */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={2} c="crimson">
                Featured Projects
              </Title>
              <Button variant="outline" component="a" href="/projects">
                View All Projects
              </Button>
            </Group>
            <Text size="md" c="dimmed">
              A selection of my most impactful projects showcasing my technical
              skills and problem-solving abilities.
            </Text>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {projects?.items?.slice(0, 4).map((project: any) => (
                <Paper key={project.id} p="md" withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Title order={4}>{project.title}</Title>
                      <Badge
                        color={
                          project.status === "completed"
                            ? "green"
                            : project.status === "in_progress"
                            ? "blue"
                            : "orange"
                        }
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
                            <Badge key={index} size="sm" variant="outline">
                              {tech}
                            </Badge>
                          ))}
                    </Group>
                    <Group gap="xs" mt="sm">
                      {project.github_url && (
                        <Button
                          size="sm"
                          variant="light"
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
                          size="sm"
                          variant="light"
                          leftSection={<IconTarget size={16} />}
                          component="a"
                          href={project.live_url}
                          target="_blank"
                        >
                          Demo
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Personal Interests */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Personal Interests
            </Title>
            <Text size="md" c="dimmed">
              What I'm passionate about outside of work and academics.
            </Text>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
              {interests && Array.isArray(interests)
                ? interests.map((interest: any) => (
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

        {/* Career Goals */}
        <Card withBorder p="xl">
          <Stack gap="md">
            <Title order={2} c="crimson">
              Career Goals & Aspirations
            </Title>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Group>
                    <ThemeIcon color="blue" variant="light" size="lg">
                      <IconTarget size={20} />
                    </ThemeIcon>
                    <Title order={4}>Short-term Goals</Title>
                  </Group>
                  <Text size="sm">
                    • Complete my MIS degree with strong academic performance
                    <br />
                    • Gain hands-on experience through internships and projects
                    <br />
                    • Build a robust portfolio showcasing my technical skills
                    <br />• Develop expertise in data analysis and business
                    intelligence tools
                  </Text>
                </Stack>
              </Paper>
              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Group>
                    <ThemeIcon color="green" variant="light" size="lg">
                      <IconTrophy size={20} />
                    </ThemeIcon>
                    <Title order={4}>Long-term Aspirations</Title>
                  </Group>
                  <Text size="sm">
                    • Become a senior data analyst or business intelligence
                    specialist
                    <br />
                    • Lead data-driven initiatives that drive business growth
                    <br />
                    • Mentor junior developers and analysts
                    <br />• Contribute to open-source projects and the tech
                    community
                  </Text>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Contact CTA */}
        <Card
          withBorder
          p="xl"
          style={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          }}
        >
          <Stack gap="md" align="center" ta="center">
            <Title order={2} c="crimson">
              Let's Connect
            </Title>
            <Text size="lg" c="dimmed" maw={600}>
              I'm always interested in new opportunities, collaborations, and
              conversations about technology. Whether you have a project in mind
              or just want to chat about data analysis and software development,
              feel free to reach out!
            </Text>
            <Group gap="md" mt="md">
              <Button
                size="lg"
                leftSection={<IconDownload size={20} />}
                className="hover-lift"
              >
                Download Resume
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
  );
};

export default AboutPage;
