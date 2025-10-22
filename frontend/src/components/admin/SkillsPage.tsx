// Skills Management Component for Wheeler Knight Portfolio Admin
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
  NumberInput,
  Textarea,
  Switch,
  Stack,
  Grid,
  Pagination,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconCode,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  useSkills,
  useSkillCategories,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from "../../hooks/useApi";

interface SkillFormData {
  name: string;
  category: string;
  proficiency_level: number;
  description: string;
  icon: string;
  display_order: number;
  is_featured: boolean;
}

const SkillsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const {
    data: skillsData,
    isLoading: skillsLoading,
    refetch: refetchSkills,
  } = useSkills({
    category: selectedCategory || undefined,
    page: currentPage,
    per_page: 10,
  });

  const { data: categories } = useSkillCategories();
  const createSkillMutation = useCreateSkill();
  const updateSkillMutation = useUpdateSkill();
  const deleteSkillMutation = useDeleteSkill();

  // Form setup
  const form = useForm<SkillFormData>({
    initialValues: {
      name: "",
      category: "technical",
      proficiency_level: 3,
      description: "",
      icon: "",
      display_order: 0,
      is_featured: false,
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      category: (value) => (!value ? "Category is required" : null),
      proficiency_level: (value) =>
        value < 1 || value > 5 ? "Proficiency must be between 1 and 5" : null,
    },
  });

  // Filter skills based on search term
  const filteredSkills =
    skillsData?.items?.filter(
      (skill: any) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreate = async (values: SkillFormData) => {
    try {
      await createSkillMutation.mutateAsync(values);
      notifications.show({
        title: "Success",
        message: "Skill created successfully",
        color: "green",
      });
      setOpened(false);
      form.reset();
      refetchSkills();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create skill",
        color: "red",
      });
    }
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    form.setValues({
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.proficiency_level,
      description: skill.description || "",
      icon: skill.icon || "",
      display_order: skill.display_order || 0,
      is_featured: skill.is_featured || false,
    });
    setOpened(true);
  };

  const handleUpdate = async (values: SkillFormData) => {
    if (!editingSkill) return;

    try {
      await updateSkillMutation.mutateAsync({
        id: editingSkill.id,
        data: values,
      });
      notifications.show({
        title: "Success",
        message: "Skill updated successfully",
        color: "green",
      });
      setOpened(false);
      setEditingSkill(null);
      form.reset();
      refetchSkills();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update skill",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      await deleteSkillMutation.mutateAsync(deleteModal.id);
      notifications.show({
        title: "Success",
        message: "Skill deleted successfully",
        color: "green",
      });
      setDeleteModal(null);
      refetchSkills();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete skill",
        color: "red",
      });
    }
  };

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

  const getProficiencyColor = (level: number) => {
    if (level >= 4) return "green";
    if (level >= 3) return "yellow";
    return "red";
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} c="crimson">
              Skills Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage your technical and soft skills
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingSkill(null);
              form.reset();
              setOpened(true);
            }}
          >
            Add Skill
          </Button>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search skills..."
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

        {/* Skills Table */}
        <Card withBorder>
          <LoadingOverlay visible={skillsLoading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Proficiency</Table.Th>
                <Table.Th>Featured</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredSkills.map((skill: any) => (
                <Table.Tr key={skill.id}>
                  <Table.Td>
                    <Group gap="sm">
                      {skill.icon && <Text size="sm">{skill.icon}</Text>}
                      <Text fw={500}>{skill.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getCategoryColor(skill.category)}
                      variant="light"
                    >
                      {skill.category}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getProficiencyColor(skill.proficiency_level)}
                      variant="light"
                    >
                      {skill.proficiency_level}/5
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {skill.is_featured ? (
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
                    <Text size="sm" lineClamp={2}>
                      {skill.description || "No description"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(skill)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeleteModal(skill)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {skillsData?.pagination && (
            <Group justify="center" mt="md">
              <Pagination
                total={skillsData.pagination.total_pages}
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
            setEditingSkill(null);
            form.reset();
          }}
          title={editingSkill ? "Edit Skill" : "Add New Skill"}
          size="lg"
        >
          <form
            onSubmit={form.onSubmit(editingSkill ? handleUpdate : handleCreate)}
          >
            <Stack gap="md">
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Skill Name"
                    placeholder="e.g., Python, React, Communication"
                    required
                    {...form.getInputProps("name")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Category"
                    placeholder="Select category"
                    required
                    data={[
                      { value: "technical", label: "Technical" },
                      { value: "soft", label: "Soft Skills" },
                      { value: "language", label: "Language" },
                      { value: "certification", label: "Certification" },
                    ]}
                    {...form.getInputProps("category")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Proficiency Level"
                    placeholder="1-5"
                    min={1}
                    max={5}
                    required
                    {...form.getInputProps("proficiency_level")}
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

              <TextInput
                label="Icon (Optional)"
                placeholder="e.g., 🐍, ⚛️, 💬"
                {...form.getInputProps("icon")}
              />

              <Textarea
                label="Description"
                placeholder="Describe this skill..."
                rows={3}
                {...form.getInputProps("description")}
              />

              <Switch
                label="Featured Skill"
                description="Show this skill prominently on the portfolio"
                {...form.getInputProps("is_featured", { type: "checkbox" })}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpened(false);
                    setEditingSkill(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    createSkillMutation.isPending ||
                    updateSkillMutation.isPending
                  }
                >
                  {editingSkill ? "Update Skill" : "Create Skill"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Skill"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete "{deleteModal?.name}"? This action
              cannot be undone.
            </Alert>
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setDeleteModal(null)}>
                Cancel
              </Button>
              <Button
                color="red"
                loading={deleteSkillMutation.isPending}
                onClick={handleDelete}
              >
                Delete Skill
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default SkillsPage;
