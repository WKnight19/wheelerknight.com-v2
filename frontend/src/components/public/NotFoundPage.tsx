// 404 Not Found Page for Wheeler Knight Portfolio
import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Center,
  ThemeIcon,
} from '@mantine/core';
import { IconHome, IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl">
      <Center>
        <Stack gap="xl" align="center" ta="center">
          <ThemeIcon size={120} radius="md" color="crimson" variant="light">
            <IconSearch size={60} />
          </ThemeIcon>
          
          <Stack gap="md">
            <Title order={1} c="crimson" size="4rem">
              404
            </Title>
            <Title order={2} size="2rem">
              Page Not Found
            </Title>
            <Text size="lg" c="dimmed" maw={400}>
              Oops! The page you're looking for doesn't exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </Text>
          </Stack>

          <Group gap="md">
            <Button
              size="lg"
              leftSection={<IconHome size={20} />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftSection={<IconArrowLeft size={20} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Group>

          <Stack gap="sm" mt="xl">
            <Text fw={500}>Popular Pages:</Text>
            <Group gap="sm">
              <Button variant="subtle" onClick={() => navigate('/projects')}>
                Projects
              </Button>
              <Button variant="subtle" onClick={() => navigate('/blog')}>
                Blog
              </Button>
              <Button variant="subtle" onClick={() => navigate('/contact')}>
                Contact
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
};

export default NotFoundPage;
