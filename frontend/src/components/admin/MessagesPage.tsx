// Messages Management Component for Wheeler Knight Portfolio Admin
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
  Select,
  Stack,
  Grid,
  Pagination,
  Alert,
  LoadingOverlay,
  Divider,
  Paper,
} from '@mantine/core';
import {
  IconMail,
  IconEye,
  IconTrash,
  IconSearch,
  IconFilter,
  IconMessageReply,
  IconCheck,
  IconClock,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  useMessages,
  useMessage,
  useUpdateMessage,
  useDeleteMessage,
  useReplyToMessage,
} from '../../hooks/useApi';

interface ReplyFormData {
  reply_content: string;
}

const MessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyModal, setReplyModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);

  // API hooks
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useMessages({
    status: selectedStatus || undefined,
    page: currentPage,
    per_page: 10,
  });

  const { data: messageDetails } = useMessage(selectedMessage?.id || 0);
  const updateMessageMutation = useUpdateMessage();
  const deleteMessageMutation = useDeleteMessage();
  const replyMessageMutation = useReplyToMessage();

  // Form setup
  const replyForm = useForm<ReplyFormData>({
    initialValues: {
      reply_content: '',
    },
    validate: {
      reply_content: (value) => (!value ? 'Reply content is required' : null),
    },
  });

  // Filter messages based on search term
  const filteredMessages = messagesData?.items?.filter((message: any) =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleStatusChange = async (messageId: number, newStatus: string) => {
    try {
      await updateMessageMutation.mutateAsync({
        id: messageId,
        data: { status: newStatus },
      });
      notifications.show({
        title: 'Success',
        message: 'Message status updated',
        color: 'green',
      });
      refetchMessages();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update message status',
        color: 'red',
      });
    }
  };

  const handleReply = async (values: ReplyFormData) => {
    if (!replyModal) return;
    
    try {
      await replyMessageMutation.mutateAsync({
        id: replyModal.id,
        data: values,
      });
      notifications.show({
        title: 'Success',
        message: 'Reply sent successfully',
        color: 'green',
      });
      setReplyModal(null);
      replyForm.reset();
      refetchMessages();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send reply',
        color: 'red',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      await deleteMessageMutation.mutateAsync(deleteModal.id);
      notifications.show({
        title: 'Success',
        message: 'Message deleted successfully',
        color: 'green',
      });
      setDeleteModal(null);
      refetchMessages();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete message',
        color: 'red',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'red';
      case 'read': return 'blue';
      case 'replied': return 'green';
      case 'archived': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <IconClock size={16} />;
      case 'read': return <IconEye size={16} />;
      case 'replied': return <IconCheck size={16} />;
      case 'archived': return <IconTrash size={16} />;
      default: return <IconMail size={16} />;
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
              Messages Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage contact form submissions and inquiries
            </Text>
          </div>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search messages..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                placeholder="Filter by status"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'new', label: 'New' },
                  { value: 'read', label: 'Read' },
                  { value: 'replied', label: 'Replied' },
                  { value: 'archived', label: 'Archived' },
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Card>

        <Grid>
          {/* Messages Table */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card withBorder>
              <LoadingOverlay visible={messagesLoading} />
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Subject</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredMessages.map((message: any) => (
                    <Table.Tr key={message.id}>
                      <Table.Td>
                        <div>
                          <Text fw={500}>{message.name}</Text>
                          <Text size="sm" c="dimmed">{message.email}</Text>
                          {message.company && (
                            <Text size="xs" c="dimmed">{message.company}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>
                          {message.subject || 'No subject'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getStatusColor(message.status)} 
                          variant="light"
                          leftSection={getStatusIcon(message.status)}
                        >
                          {message.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {formatDate(message.created_at)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="green"
                            onClick={() => setReplyModal(message)}
                          >
                            <IconMessageReply size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => setDeleteModal(message)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {messagesData?.pagination && (
                <Group justify="center" mt="md">
                  <Pagination
                    total={messagesData.pagination.total_pages}
                    value={currentPage}
                    onChange={setCurrentPage}
                  />
                </Group>
              )}
            </Card>
          </Grid.Col>

          {/* Message Details */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            {selectedMessage ? (
              <Card withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={4}>Message Details</Title>
                    <ActionIcon
                      variant="light"
                      color="gray"
                      onClick={() => setSelectedMessage(null)}
                    >
                      ×
                    </ActionIcon>
                  </Group>

                  <div>
                    <Text fw={500} size="lg">{selectedMessage.name}</Text>
                    <Text size="sm" c="dimmed">{selectedMessage.email}</Text>
                    {selectedMessage.company && (
                      <Text size="sm" c="dimmed">{selectedMessage.company}</Text>
                    )}
                    {selectedMessage.phone && (
                      <Text size="sm" c="dimmed">{selectedMessage.phone}</Text>
                    )}
                  </div>

                  <Divider />

                  <div>
                    <Text fw={500}>Subject</Text>
                    <Text size="sm">{selectedMessage.subject || 'No subject'}</Text>
                  </div>

                  <div>
                    <Text fw={500}>Message</Text>
                    <Paper p="sm" withBorder>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedMessage.message}
                      </Text>
                    </Paper>
                  </div>

                  <div>
                    <Text fw={500}>Status</Text>
                    <Group gap="xs" mt="xs">
                      <Select
                        value={selectedMessage.status}
                        onChange={(value) => value && handleStatusChange(selectedMessage.id, value)}
                        data={[
                          { value: 'new', label: 'New' },
                          { value: 'read', label: 'Read' },
                          { value: 'replied', label: 'Replied' },
                          { value: 'archived', label: 'Archived' },
                        ]}
                        size="sm"
                      />
                    </Group>
                  </div>

                  <div>
                    <Text fw={500}>Received</Text>
                    <Text size="sm">{formatDate(selectedMessage.created_at)}</Text>
                  </div>
                </Stack>
              </Card>
            ) : (
              <Card withBorder>
                <Stack gap="md" align="center" py="xl">
                  <IconMail size={48} color="gray" />
                  <Text c="dimmed" ta="center">
                    Select a message to view details
                  </Text>
                </Stack>
              </Card>
            )}
          </Grid.Col>
        </Grid>

        {/* Reply Modal */}
        <Modal
          opened={!!replyModal}
          onClose={() => {
            setReplyModal(null);
            replyForm.reset();
          }}
          title="Reply to Message"
          size="lg"
        >
          <form onSubmit={replyForm.onSubmit(handleReply)}>
            <Stack gap="md">
              {replyModal && (
                <div>
                  <Text fw={500}>Replying to: {replyModal.name}</Text>
                  <Text size="sm" c="dimmed">{replyModal.email}</Text>
                </div>
              )}

              <Textarea
                label="Reply Content"
                placeholder="Type your reply here..."
                rows={8}
                required
                {...replyForm.getInputProps('reply_content')}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplyModal(null);
                    replyForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={replyMessageMutation.isPending}
                >
                  Send Reply
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Delete Message"
          size="sm"
        >
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              Are you sure you want to delete this message from "{deleteModal?.name}"? This action cannot be undone.
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
                loading={deleteMessageMutation.isPending}
                onClick={handleDelete}
              >
                Delete Message
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default MessagesPage;
