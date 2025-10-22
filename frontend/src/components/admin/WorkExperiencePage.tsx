// Work Experience Management Component for Wheeler Knight Portfolio Admin
import React, { useState } from 'react';
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
  Textarea,
  Switch,
  Stack,
  Grid,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBriefcase,
  IconCalendar,
  IconMapPin,
  IconCode,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  useWorkExperience,
  useCreateWorkExperience,
  useUpdateWorkExperience,
} from '../../hooks/useApi';

interface WorkExperienceFormData {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  display_order: number;
}

const WorkExperiencePage: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const { data: experienceData, isLoading: experienceLoading, refetch: refetchExperience } = useWorkExperience();
  const createExperienceMutation = useCreateWorkExperience();
  const updateExperienceMutation = useUpdateWorkExperience();

  // Form setup
  const form = useForm<WorkExperienceFormData>({
    initialValues: {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: [],
      technologies: [],
      display_order: 0,
    },
    validate: {
      company: (value) => (!value ? 'Company is required' : null),
      position: (value) => (!value ? 'Position is required' : null),
      start_date: (value) => (!value ? 'Start date is required' : null),
    },
  });

  const handleCreate = async (values: WorkExperienceFormData) => {
    try {
      await createExperienceMutation.mutateAsync(values);
      notifications.show({
        title: 'Success',
        message: 'Work experience created successfully',
        color: 'green',
      });
      setOpened(false);
      form.reset();
      refetchExperience();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create work experience',
        color: 'red',
      });
    }
  };

  const handleEdit = (experience: any) => {
    setEditingExperience(experience);
    form.setValues({
      company: experience.company,
      position: experience.position,
      location: experience.location || '',
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      is_current: experience.is_current || false,
      description: experience.description || '',
      achievements: experience.achievements || [],
      technologies: experience.technologies || [],
      display_order: experience.display_order || 0,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: WorkExperienceFormData) => {
    if (!editingExperience) return;
    
    try {
      await updateExperienceMutation.mutateAsync({
        id: editingExperience.id,
        data: values,
      });
      notifications.show({
        title: 'Success',
        message: 'Work experience updated successfully',
        color: 'green',
      });
      setOpened(false);
      setEditingExperience(null);
      form.reset();
      refetchExperience();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update work experience',
        color: 'red',
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} c="crimson">
              Work Experience Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your professional work history
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingExperience(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Experience
          </Button>
        </Group>

        {/* Work Experience Table */}
        <Card withBorder>
          <LoadingOverlay visible={experienceLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Company</Table.Th>
                <Table.Th>Position</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Technologies</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {experienceData?.map((experience: any) => (
                <Table.Tr key={experience.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <IconBriefcase size={20} color="blue" />
                      <Text fw={500}>{experience.company}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text>{experience.position}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconMapPin size={16} color="gray" />
                      <Text>{experience.location || 'N/A'}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconCalendar size={16} color="gray" />
                      <div>
                        <Text size="sm">{formatDate(experience.start_date)}</Text>
                        <Text size="xs" c="dimmed">
                          {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {experience.is_current ? (
                      <Badge color="green" variant="light">Current</Badge>
                    ) : (
                      <Badge color="blue" variant="light">Previous</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {Array.isArray(experience.technologies) && experience.technologies.slice(0, 3).map((tech: string, index: number) => (
                        <Badge key={index} size="sm" variant="outline">
                          {tech}
                        </Badge>
                      ))}
                      {Array.isArray(experience.technologies) && experience.technologies.length > 3 && (
                        <Badge size="sm" variant="outline">
                          +{experience.technologies.length - 3}
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(experience)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(experience)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {experienceData?.length === 0 && (
            <Stack gap="md" align="center" py="xl">
              <IconBriefcase size={48} color="gray" />
              <Text c="dimmed" ta="center">
                No work experience records found. Add your first work experience to get started.
              </Text>
            </Stack>
          )}
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          opened={opened}
          onClose={() => {
            setOpened(false);
            setEditingExperience(null);
            form.reset();
          }}
          title={editingExperience ? 'Edit Work Experience' : 'Add New Work Experience'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(editingExperience ? handleUpdate : handleCreate)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Company"
                    placeholder="e.g., University of Alabama IT Department"
                    required
                    {...form.getInputProps('company')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Display Order"
                    placeholder="0"
                    {...form.getInputProps('display_order')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Position"
                    placeholder="e.g., IT Assistant"
                    required
                    {...form.getInputProps('position')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Location"
                    placeholder="e.g., Tuscaloosa, AL"
                    {...form.getInputProps('location')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Start Date"
                    type="date"
                    required
                    {...form.getInputProps('start_date')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="End Date"
                    type="date"
                    disabled={form.values.is_current}
                    {...form.getInputProps('end_date')}
                  />
                </Grid.Col>
              </Grid>

              <Switch
                label="Currently Working Here"
                description="Check if you're currently employed at this company"
                {...form.getInputProps('is_current', { type: 'checkbox' })}
              />

              <Textarea
                label="Job Description"
                placeholder="Describe your role and responsibilities..."
                rows={3}
                {...form.getInputProps('description')}
              />

              <TextInput
                label="Achievements (comma-separated)"
                placeholder="Improved ticket resolution time by 15%, Developed automated deployment script"
                {...form.getInputProps('achievements')}
              />

              <TextInput
                label="Technologies Used (comma-separated)"
                placeholder="Windows Server, Active Directory, Python Scripting, Troubleshooting"
                {...form.getInputProps('technologies')}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingExperience(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createExperienceMutation.isPending || updateExperienceMutation.isPending}
                >
                  {editingExperience ? 'Update Experience' : 'Create Experience'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Work Experience"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete "{deleteModal?.position}" at "{deleteModal?.company}"? This action cannot be undone.
            </Alert>
            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => {
                  // Note: Delete functionality would need to be implemented in the API
                  notifications.show({
                    title: 'Info',
                    message: 'Delete functionality not yet implemented',
                    color: 'blue',
                  });
                  setDeleteModal(null);
                }}
              >
                Delete Experience
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default WorkExperiencePage;
