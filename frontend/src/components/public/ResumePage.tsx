// Public Resume Page for Wheeler Knight Portfolio
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
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconCode,
  IconBriefcase,
  IconSchool,
  IconMapPin,
  IconCalendar,
  IconMail,
  IconPhone,
  IconBrandGithub,
  IconBrandLinkedin,
  IconDownload,
  IconPrinter,
  IconHeart,
  IconTrophy,
  IconUsers,
  IconBook,
} from "@tabler/icons-react";
import {
  useSkills,
  useEducation,
  useWorkExperience,
  useProjects,
} from "../../hooks/useApi";

const ResumePage: React.FC = () => {
  // Fetch data for the resume page
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: workExperience, isLoading: experienceLoading } =
    useWorkExperience();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const isLoading =
    skillsLoading || educationLoading || experienceLoading || projectsLoading;

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert("PDF download functionality coming soon!");
  };

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading resume...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-break {
              page-break-before: always;
            }
            .resume-container {
              max-width: none !important;
              padding: 0 !important;
            }
            .resume-paper {
              box-shadow: none !important;
              border: none !important;
            }
          }
          
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <Container size="xl" py="md" className="resume-container">
        <Stack gap="xl">
          {/* Print/Download Controls */}
          <Group justify="center" className="no-print">
            <Button
              leftSection={<IconPrinter size={20} />}
              onClick={handlePrint}
              className="hover-lift"
            >
              Print Resume
            </Button>
            <Button
              variant="outline"
              leftSection={<IconDownload size={20} />}
              onClick={handleDownloadPDF}
              className="hover-lift"
            >
              Download PDF
            </Button>
          </Group>

          {/* Resume Content */}
          <Paper withBorder p="xl" className="resume-paper">
            <Stack gap="xl">
              {/* Header */}
              <Box ta="center">
                <Title order={1} c="crimson" size="2.5rem" mb="sm">
                  Wheeler Knight
                </Title>
                <Text size="lg" c="dimmed" mb="md">
                  Management Information Systems Student | Computer Science
                  Minor
                </Text>
                <Group justify="center" gap="xl">
                  <Group gap="xs">
                    <IconMail size={16} color="gray" />
                    <Anchor href="mailto:wheeler@wheelerknight.com" size="sm">
                      wheeler@wheelerknight.com
                    </Anchor>
                  </Group>
                  <Group gap="xs">
                    <IconPhone size={16} color="gray" />
                    <Text size="sm">(256) 555-0123</Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size={16} color="gray" />
                    <Text size="sm">Moulton, Alabama</Text>
                  </Group>
                </Group>
                <Group justify="center" gap="md" mt="md">
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
                  <Anchor
                    href="https://wheelerknight.com"
                    target="_blank"
                    size="sm"
                  >
                    Portfolio
                  </Anchor>
                </Group>
              </Box>

              <Divider />

              {/* Professional Summary */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  Professional Summary
                </Title>
                <Text size="md" style={{ lineHeight: 1.6 }}>
                  Senior Management Information Systems student with Computer
                  Science minor at the University of Alabama. Passionate about
                  data analysis, business intelligence, and software
                  development. Seeking opportunities in data analysis, business
                  intelligence, software development, and consulting roles.
                  Strong foundation in both technical and business concepts with
                  hands-on experience in various programming languages and data
                  analysis tools.
                </Text>
              </Box>

              {/* Education */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  Education
                </Title>
                {education && Array.isArray(education) ? (
                  education.map((edu: any) => (
                    <Box key={edu.id} mb="md">
                      <Group justify="space-between" mb="xs">
                        <Title order={3}>{edu.institution}</Title>
                        <Text size="sm" c="dimmed">
                          {edu.start_date && edu.end_date
                            ? `${new Date(edu.start_date).getFullYear()} - ${
                                edu.end_date
                                  ? new Date(edu.end_date).getFullYear()
                                  : "Present"
                              }`
                            : "Expected Graduation: May 2026"}
                        </Text>
                      </Group>
                      <Text fw={500} mb="xs">
                        {edu.degree}
                      </Text>
                      {edu.field_of_study && (
                        <Text size="sm" c="dimmed" mb="xs">
                          {edu.field_of_study}
                        </Text>
                      )}
                      {edu.gpa &&
                        typeof edu.gpa === "number" &&
                        edu.gpa > 0 && (
                          <Text size="sm">GPA: {edu.gpa.toFixed(2)}/4.0</Text>
                        )}
                    </Box>
                  ))
                ) : (
                  <Box mb="md">
                    <Group justify="space-between" mb="xs">
                      <Title order={3}>University of Alabama</Title>
                      <Text size="sm" c="dimmed">
                        2022 - 2026
                      </Text>
                    </Group>
                    <Text fw={500} mb="xs">
                      Bachelor of Science in Management Information Systems
                    </Text>
                    <Text size="sm" c="dimmed" mb="xs">
                      Minor in Computer Science
                    </Text>
                    <Text size="sm">GPA: 3.2/4.0</Text>
                  </Box>
                )}
              </Box>

              {/* Technical Skills */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  Technical Skills
                </Title>
                {skills?.items && (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {/* Technical Skills */}
                    <Box>
                      <Title order={3} mb="sm">
                        Programming & Development
                      </Title>
                      <Group gap="xs" wrap="wrap">
                        {skills.items
                          .filter(
                            (skill: any) => skill.category === "technical"
                          )
                          .map((skill: any) => (
                            <Badge
                              key={skill.id}
                              color={getCategoryColor(skill.category)}
                              variant="light"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                      </Group>
                    </Box>

                    {/* Soft Skills */}
                    <Box>
                      <Title order={3} mb="sm">
                        Soft Skills
                      </Title>
                      <Group gap="xs" wrap="wrap">
                        {skills.items
                          .filter((skill: any) => skill.category === "soft")
                          .map((skill: any) => (
                            <Badge
                              key={skill.id}
                              color={getCategoryColor(skill.category)}
                              variant="light"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                      </Group>
                    </Box>
                  </SimpleGrid>
                )}
              </Box>

              {/* Work Experience */}
              <Box className="print-break">
                <Title order={2} c="crimson" mb="md">
                  Work Experience
                </Title>
                {workExperience &&
                Array.isArray(workExperience) &&
                workExperience.length > 0 ? (
                  workExperience.map((exp: any) => (
                    <Box key={exp.id} mb="md">
                      <Group justify="space-between" mb="xs">
                        <Title order={3}>{exp.position}</Title>
                        <Text size="sm" c="dimmed">
                          {exp.start_date && exp.end_date
                            ? `${new Date(exp.start_date).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )} - ${
                                exp.end_date
                                  ? new Date(exp.end_date).toLocaleDateString(
                                      "en-US",
                                      { month: "short", year: "numeric" }
                                    )
                                  : "Present"
                              }`
                            : "Dates TBD"}
                        </Text>
                      </Group>
                      <Text fw={500} c="crimson" mb="xs">
                        {exp.company}
                      </Text>
                      {exp.location && (
                        <Text size="sm" c="dimmed" mb="xs">
                          {exp.location}
                        </Text>
                      )}
                      {exp.description && (
                        <Text size="sm" style={{ lineHeight: 1.5 }} mb="xs">
                          {exp.description}
                        </Text>
                      )}
                      {Array.isArray(exp.technologies) &&
                        exp.technologies.length > 0 && (
                          <Group gap="xs" wrap="wrap">
                            {exp.technologies.map(
                              (tech: string, index: number) => (
                                <Badge key={index} size="sm" variant="outline">
                                  {tech}
                                </Badge>
                              )
                            )}
                          </Group>
                        )}
                    </Box>
                  ))
                ) : (
                  <Text c="dimmed">
                    Work experience will be added as opportunities arise.
                  </Text>
                )}
              </Box>

              {/* Projects */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  Key Projects
                </Title>
                {projects?.items?.slice(0, 3).map((project: any) => (
                  <Box key={project.id} mb="md">
                    <Group justify="space-between" mb="xs">
                      <Title order={3}>{project.title}</Title>
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
                    <Text size="sm" style={{ lineHeight: 1.5 }} mb="xs">
                      {project.description}
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {Array.isArray(project.technologies) &&
                        project.technologies.map(
                          (tech: string, index: number) => (
                            <Badge key={index} size="sm" variant="outline">
                              {tech}
                            </Badge>
                          )
                        )}
                    </Group>
                    <Group gap="md" mt="xs">
                      {project.github_url && (
                        <Anchor
                          href={project.github_url}
                          target="_blank"
                          size="sm"
                        >
                          GitHub Repository
                        </Anchor>
                      )}
                      {project.live_url && (
                        <Anchor
                          href={project.live_url}
                          target="_blank"
                          size="sm"
                        >
                          Live Demo
                        </Anchor>
                      )}
                    </Group>
                  </Box>
                ))}
              </Box>

              {/* Additional Information */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  Additional Information
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <Box>
                    <Title order={3} mb="sm">
                      Languages
                    </Title>
                    <Text size="sm">• English (Native)</Text>
                    <Text size="sm">• Spanish (Conversational)</Text>
                  </Box>
                  <Box>
                    <Title order={3} mb="sm">
                      Interests
                    </Title>
                    <Text size="sm">• Data Analysis & Visualization</Text>
                    <Text size="sm">• Software Development</Text>
                    <Text size="sm">• Business Intelligence</Text>
                    <Text size="sm">• Alabama Crimson Tide Football</Text>
                    <Text size="sm">• Golf</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* References */}
              <Box>
                <Title order={2} c="crimson" mb="md">
                  References
                </Title>
                <Text size="sm" c="dimmed">
                  References available upon request.
                </Text>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default ResumePage;
