// Public Contact Page for Wheeler Knight Portfolio
import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Stack,
  Grid,
  TextInput,
  Textarea,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Alert,
  Anchor,
} from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconSend,
  IconCheck,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    initialValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      email: (value) => (!/^\S+@\S+$/.test(value) ? 'Invalid email' : null),
      subject: (value) => (!value ? 'Subject is required' : null),
      message: (value) => (!value ? 'Message is required' : null),
    },
  });

  const handleSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      notifications.show({
        title: 'Message Sent!',
        message: 'Thank you for reaching out. I\'ll get back to you soon!',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send message. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="md" align="center" ta="center">
          <Title order={1} c="crimson" size="3rem">
            Get In Touch
          </Title>
          <Text size="lg" c="dimmed" maw={600}>
            I'm always interested in new opportunities, collaborations, and conversations about technology.
          </Text>
        </Stack>

        <Grid>
          {/* Contact Form */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder p="xl">
              <Stack gap="md">
                <Title order={2} c="crimson">
                  Send Me a Message
                </Title>
                <Text c="dimmed">
                  Have a project in mind? Want to collaborate? Or just want to chat about technology? 
                  I'd love to hear from you!
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="md">
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Name"
                          placeholder="Your full name"
                          required
                          {...form.getInputProps('name')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Email"
                          placeholder="your.email@example.com"
                          required
                          {...form.getInputProps('email')}
                        />
                      </Grid.Col>
                    </Grid>

                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Company (Optional)"
                          placeholder="Your company name"
                          {...form.getInputProps('company')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Phone (Optional)"
                          placeholder="Your phone number"
                          {...form.getInputProps('phone')}
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Subject"
                      placeholder="What's this about?"
                      required
                      {...form.getInputProps('subject')}
                    />

                    <Textarea
                      label="Message"
                      placeholder="Tell me about your project, idea, or just say hello!"
                      rows={6}
                      required
                      {...form.getInputProps('message')}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      loading={isSubmitting}
                      leftSection={<IconSend size={20} />}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Contact Information */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Card withBorder p="xl">
                <Stack gap="md">
                  <Title order={3} c="crimson">
                    Contact Information
                  </Title>
                  
                  <Group gap="md">
                    <ThemeIcon color="crimson" variant="light" size="lg">
                      <IconMail size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>Email</Text>
                      <Anchor href="mailto:wheeler@example.com" size="sm">
                        wheeler@example.com
                      </Anchor>
                    </div>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon color="crimson" variant="light" size="lg">
                      <IconPhone size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>Phone</Text>
                      <Text size="sm" c="dimmed">
                        (256) 555-0123
                      </Text>
                    </div>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon color="crimson" variant="light" size="lg">
                      <IconMapPin size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>Location</Text>
                      <Text size="sm" c="dimmed">
                        Moulton, Alabama
                      </Text>
                    </div>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder p="xl">
                <Stack gap="md">
                  <Title order={3} c="crimson">
                    Connect With Me
                  </Title>
                  
                  <Group gap="md">
                    <ThemeIcon color="blue" variant="light" size="lg">
                      <IconBrandLinkedin size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>LinkedIn</Text>
                      <Anchor href="https://linkedin.com/in/wheelerknight" target="_blank" size="sm">
                        linkedin.com/in/wheelerknight
                      </Anchor>
                    </div>
                  </Group>

                  <Group gap="md">
                    <ThemeIcon color="gray" variant="light" size="lg">
                      <IconBrandGithub size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>GitHub</Text>
                      <Anchor href="https://github.com/wheelerknight" target="_blank" size="sm">
                        github.com/wheelerknight
                      </Anchor>
                    </div>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder p="xl">
                <Stack gap="md">
                  <Title order={3} c="crimson">
                    Quick Facts
                  </Title>
                  
                  <SimpleGrid cols={1} spacing="sm">
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500}>University</Text>
                      <Text size="sm" c="dimmed">University of Alabama</Text>
                    </Paper>
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500}>Major</Text>
                      <Text size="sm" c="dimmed">Management Information Systems</Text>
                    </Paper>
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500}>Minor</Text>
                      <Text size="sm" c="dimmed">Computer Science</Text>
                    </Paper>
                    <Paper p="sm" withBorder>
                      <Text size="sm" fw={500}>Graduation</Text>
                      <Text size="sm" c="dimmed">May 2026</Text>
                    </Paper>
                  </SimpleGrid>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Response Time */}
        <Alert color="blue" icon={<IconMail size={16} />}>
          <Text size="sm">
            <strong>Response Time:</strong> I typically respond to messages within 24 hours. 
            For urgent matters, feel free to call or text me directly.
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
};

export default ContactPage;
