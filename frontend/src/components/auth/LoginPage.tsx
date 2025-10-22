// Login Component for Wheeler Knight Portfolio Admin
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  Group,
  Text,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconLogin } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login(values);
      navigate('/admin/dashboard');
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack gap="md">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} c="crimson">
              Wheeler Knight Portfolio
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              Admin Login
            </Text>
          </div>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Login Failed"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                required
                {...form.getInputProps('username')}
                disabled={isSubmitting}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...form.getInputProps('password')}
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                fullWidth
                mt="md"
                leftSection={<IconLogin size={16} />}
                loading={isSubmitting}
                disabled={isLoading}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Group justify="center" mt="md">
            <Text size="sm" c="dimmed">
              Demo Credentials:
            </Text>
            <Text size="sm" c="dimmed">
              Username: <Text span fw={500}>wheeler</Text>
            </Text>
            <Text size="sm" c="dimmed">
              Password: <Text span fw={500}>admin123</Text>
            </Text>
          </Group>

          <Group justify="center" mt="md">
            <Anchor
              href="/"
              size="sm"
              c="dimmed"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              ← Back to Portfolio
            </Anchor>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
