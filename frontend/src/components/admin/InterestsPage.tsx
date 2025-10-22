// Interests Management Component for Wheeler Knight Portfolio Admin
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
  Select,
  Textarea,
  Switch,
  Stack,
  Grid,
  Pagination,
  Alert,
  LoadingOverlay,
  Image,
  NumberInput,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconHeart,
  IconExternalLink,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  useInterests,
  useInterestCategories,
  useCreateInterest,
  useUpdateInterest,
} from '../../hooks/useApi';

interface InterestFormData {
  title: string;
  category: string;
  description: string;
  image_url: string;
  external_url: string;
  display_order: number;
  is_featured: boolean;
}

const InterestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [editingInterest, setEditingInterest] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const { data: interestsData, isLoading: interestsLoading, refetch: refetchInterests } = useInterests({
    category: selectedCategory || undefined,
  });

  const { data: categories } = useInterestCategories();
  const createInterestMutation = useCreateInterest();
  const updateInterestMutation = useUpdateInterest();

  // Form setup
  const form = useForm<InterestFormData>({
    initialValues: {
      title: '',
      category: 'hobby',
      description: '',
      image_url: '',
      external_url: '',
      display_order: 0,
      is_featured: false,
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      category: (value) => (!value ? 'Category is required' : null),
    },
  });

  // Filter interests based on search term
  const filteredInterests = interestsData?.filter((interest: any) =>
    interest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interest.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async (values: InterestFormData) => {
    try {
      await createInterestMutation.mutateAsync(values);
      notifications.show({
        title: 'Success',
        message: 'Interest created successfully',
        color: 'green',
      });
      setOpened(false);
      form.reset();
      refetchInterests();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create interest',
        color: 'red',
      });
    }
  };

  const handleEdit = (interest: any) => {
    setEditingInterest(interest);
    form.setValues({
      title: interest.title,
      category: interest.category,
      description: interest.description || '',
      image_url: interest.image_url || '',
      external_url: interest.external_url || '',
      display_order: interest.display_order || 0,
      is_featured: interest.is_featured || false,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: InterestFormData) => {
    if (!editingInterest) return;
    
    try {
      await updateInterestMutation.mutateAsync({
        id: editingInterest.id,
        data: values,
      });
      notifications.show({
        title: 'Success',
        message: 'Interest updated successfully',
        color: 'green',
      });
      setOpened(false);
      setEditingInterest(null);
      form.reset();
      refetchInterests();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update interest',
        color: 'red',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movie': return 'purple';
      case 'tv_show': return 'blue';
      case 'music': return 'pink';
      case 'book': return 'green';
      case 'sport': return 'red';
      case 'hobby': return 'orange';
      case 'other': return 'gray';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movie': return '🎬';
      case 'tv_show': return '📺';
      case 'music': return '🎵';
      case 'book': return '📚';
      case 'sport': return '⚽';
      case 'hobby': return '🎨';
      case 'other': return '⭐';
      default: return '⭐';
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} c="crimson">
              Interests Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your personal interests and hobbies
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingInterest(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Interest
          </Button>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search interests..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                placeholder="Filter by category"
                leftSection={<IconFilter size={16} />}
                 data={categories || []}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Interests Table */}
        <Card withBorder>
          <LoadingOverlay visible={interestsLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Interest</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Featured</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Links</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredInterests.map((interest: any) => (
                <Table.Tr key={interest.id}>
                  <Table.Td>
                    <Group gap="sm">
                      {interest.image_url && (
                        <Image
                          src={interest.image_url}
                          alt={interest.title}
                          width={40}
                          height={40}
                          radius="sm"
                        />
                      )}
                      <div>
                        <Text fw={500}>{interest.title}</Text>
                        <Text size="xs" c="dimmed">
                          {getCategoryIcon(interest.category)} {interest.category.replace('_', ' ')}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getCategoryColor(interest.category)} variant="light">
                      {interest.category.replace('_', ' ')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {interest.is_featured ? (
                      <Badge color="green" variant="light">Featured</Badge>
                    ) : (
                      <Badge color="gray" variant="light">Regular</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>
                      {interest.description || 'No description'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {interest.external_url && (
                      <ActionIcon
                        variant="light"
                        color="blue"
                        component="a"
                        href={interest.external_url}
                        target="_blank"
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(interest)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(interest)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {interestsData?.length === 0 && (
            <Stack gap="md" align="center" py="xl">
              <IconHeart size={48} color="gray" />
              <Text c="dimmed" ta="center">
                No interests found. Add your first interest to get started.
              </Text>
            </Stack>
          )}
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          opened={opened}
          onClose={() => {
            setOpened(false);
            setEditingInterest(null);
            form.reset();
          }}
          title={editingInterest ? 'Edit Interest' : 'Add New Interest'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(editingInterest ? handleUpdate : handleCreate)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Interest Title"
                    placeholder="e.g., Alabama Crimson Tide, Cooking, Golf"
                    required
                    {...form.getInputProps('title')}
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

              <Select
                label="Category"
                placeholder="Select category"
                required
                data={[
                  { value: 'movie', label: 'Movie' },
                  { value: 'tv_show', label: 'TV Show' },
                  { value: 'music', label: 'Music' },
                  { value: 'book', label: 'Book' },
                  { value: 'sport', label: 'Sport' },
                  { value: 'hobby', label: 'Hobby' },
                  { value: 'other', label: 'Other' },
                ]}
                {...form.getInputProps('category')}
              />

              <TextInput
                label="Image URL (Optional)"
                placeholder="https://example.com/image.jpg"
                {...form.getInputProps('image_url')}
              />

              <TextInput
                label="External URL (Optional)"
                placeholder="https://example.com"
                {...form.getInputProps('external_url')}
              />

              <Textarea
                label="Description"
                placeholder="Describe this interest..."
                rows={3}
                {...form.getInputProps('description')}
              />

              <Switch
                label="Featured Interest"
                description="Show this interest prominently on the portfolio"
                {...form.getInputProps('is_featured', { type: 'checkbox' })}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingInterest(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createInterestMutation.isPending || updateInterestMutation.isPending}
                >
                  {editingInterest ? 'Update Interest' : 'Create Interest'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Interest"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete "{deleteModal?.title}"? This action cannot be undone.
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
                Delete Interest
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default InterestsPage;
