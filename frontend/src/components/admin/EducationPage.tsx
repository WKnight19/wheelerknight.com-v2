// Education Management Component for Wheeler Knight Portfolio Admin
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
  NumberInput,
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
  IconSchool,
  IconCalendar,
  IconAward,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  useEducation,
  useCreateEducation,
  useUpdateEducation,
} from '../../hooks/useApi';

interface EducationFormData {
  institution: string;
  degree: string;
  field_of_study: string;
  gpa: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  display_order: number;
}

const EducationPage: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const { data: educationData, isLoading: educationLoading, refetch: refetchEducation } = useEducation();
  const createEducationMutation = useCreateEducation();
  const updateEducationMutation = useUpdateEducation();

  // Form setup
  const form = useForm<EducationFormData>({
    initialValues: {
      institution: '',
      degree: '',
      field_of_study: '',
      gpa: 0,
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: [],
      display_order: 0,
    },
    validate: {
      institution: (value) => (!value ? 'Institution is required' : null),
      degree: (value) => (!value ? 'Degree is required' : null),
      start_date: (value) => (!value ? 'Start date is required' : null),
    },
  });

  const handleCreate = async (values: EducationFormData) => {
    try {
      await createEducationMutation.mutateAsync(values);
      notifications.show({
        title: 'Success',
        message: 'Education record created successfully',
        color: 'green',
      });
      setOpened(false);
      form.reset();
      refetchEducation();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create education record',
        color: 'red',
      });
    }
  };

  const handleEdit = (education: any) => {
    setEditingEducation(education);
    form.setValues({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study || '',
      gpa: education.gpa || 0,
      start_date: education.start_date || '',
      end_date: education.end_date || '',
      is_current: education.is_current || false,
      description: education.description || '',
      achievements: education.achievements || [],
      display_order: education.display_order || 0,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: EducationFormData) => {
    if (!editingEducation) return;
    
    try {
      await updateEducationMutation.mutateAsync({
        id: editingEducation.id,
        data: values,
      });
      notifications.show({
        title: 'Success',
        message: 'Education record updated successfully',
        color: 'green',
      });
      setOpened(false);
      setEditingEducation(null);
      form.reset();
      refetchEducation();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update education record',
        color: 'red',
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatGPA = (gpa: number) => {
    if (!gpa || gpa === 0 || typeof gpa !== 'number') return 'N/A';
    return gpa.toFixed(2);
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} c="crimson">
              Education Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your educational background
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingEducation(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Education
          </Button>
        </Group>

        {/* Education Table */}
        <Card withBorder>
          <LoadingOverlay visible={educationLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Institution</Table.Th>
                <Table.Th>Degree</Table.Th>
                <Table.Th>Field of Study</Table.Th>
                <Table.Th>GPA</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {educationData?.map((education: any) => (
                <Table.Tr key={education.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <IconSchool size={20} color="blue" />
                      <Text fw={500}>{education.institution}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text>{education.degree}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text>{education.field_of_study || 'N/A'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconAward size={16} color="gold" />
                      <Text>{formatGPA(education.gpa)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconCalendar size={16} color="gray" />
                      <div>
                        <Text size="sm">{formatDate(education.start_date)}</Text>
                        <Text size="xs" c="dimmed">
                          {education.is_current ? 'Present' : formatDate(education.end_date)}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {education.is_current ? (
                      <Badge color="green" variant="light">Current</Badge>
                    ) : (
                      <Badge color="blue" variant="light">Completed</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(education)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(education)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {educationData?.length === 0 && (
            <Stack gap="md" align="center" py="xl">
              <IconSchool size={48} color="gray" />
              <Text c="dimmed" ta="center">
                No education records found. Add your first education record to get started.
              </Text>
            </Stack>
          )}
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          opened={opened}
          onClose={() => {
            setOpened(false);
            setEditingEducation(null);
            form.reset();
          }}
          title={editingEducation ? 'Edit Education' : 'Add New Education'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(editingEducation ? handleUpdate : handleCreate)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Institution"
                    placeholder="e.g., The University of Alabama"
                    required
                    {...form.getInputProps('institution')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Display Order"
                    placeholder="0"
                    min={0}
                    {...form.getInputProps('display_order')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Degree"
                    placeholder="e.g., Bachelor of Science"
                    required
                    {...form.getInputProps('degree')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Field of Study"
                    placeholder="e.g., Management Information Systems"
                    {...form.getInputProps('field_of_study')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="GPA"
                    placeholder="3.2"
                    min={0}
                    max={4}
                    step={0.1}
                    decimalScale={2}
                    {...form.getInputProps('gpa')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Switch
                    label="Currently Enrolled"
                    description="Check if you're currently studying here"
                    {...form.getInputProps('is_current', { type: 'checkbox' })}
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

              <Textarea
                label="Description"
                placeholder="Additional details about your education..."
                rows={3}
                {...form.getInputProps('description')}
              />

              <TextInput
                label="Achievements (comma-separated)"
                placeholder="Dean's List, Presidential Scholarship, Honor Society"
                {...form.getInputProps('achievements')}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingEducation(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createEducationMutation.isPending || updateEducationMutation.isPending}
                >
                  {editingEducation ? 'Update Education' : 'Create Education'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Education Record"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete "{deleteModal?.institution}"? This action cannot be undone.
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
                Delete Education
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default EducationPage;
