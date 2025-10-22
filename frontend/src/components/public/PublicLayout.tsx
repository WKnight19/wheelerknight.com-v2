// Public Layout Component for Wheeler Knight Portfolio
import React, { useState } from "react";
import {
  AppShell,
  Group,
  Button,
  Text,
  Burger,
  Drawer,
  Stack,
  Anchor,
  Avatar,
  Menu,
  UnstyledButton,
  Box,
  rem,
  Container,
  SimpleGrid,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconCode,
  IconArticle,
  IconMail,
  IconSun,
  IconMoon,
  IconUser,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMapPin,
  IconPhone,
  IconFileText,
} from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const PublicLayout: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: IconHome },
    { label: "About", path: "/about", icon: IconUser },
    { label: "Resume", path: "/resume", icon: IconFileText },
    { label: "Projects", path: "/projects", icon: IconCode },
    { label: "Blog", path: "/blog", icon: IconArticle },
    { label: "Contact", path: "/contact", icon: IconMail },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implement actual dark mode functionality
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            {/* Logo */}
            <Group gap="sm">
              <Avatar
                src="https://api.dicebear.com/7.x/initials/svg?seed=WK&backgroundColor=dc143c&textColor=ffffff"
                size="md"
                radius="sm"
              />
              <div>
                <Text fw={700} size="lg" c="crimson">
                  Wheeler Knight
                </Text>
                <Text size="xs" c="dimmed">
                  Portfolio
                </Text>
              </div>
            </Group>

            {/* Desktop Navigation */}
            <Group gap="md" visibleFrom="sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "filled" : "subtle"}
                    color={isActive(item.path) ? "crimson" : "gray"}
                    leftSection={<Icon size={16} />}
                    onClick={() => {
                      navigate(item.path);
                      close();
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Group>

            {/* Right Side Actions */}
            <Group gap="sm">
              <Button
                variant="subtle"
                color="gray"
                onClick={toggleDarkMode}
                leftSection={
                  darkMode ? <IconSun size={16} /> : <IconMoon size={16} />
                }
              >
                {darkMode ? "Light" : "Dark"}
              </Button>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "var(--mantine-spacing-xs)",
                      borderRadius: "var(--mantine-radius-sm)",
                      color: "var(--mantine-color-text)",
                      "&:hover": {
                        backgroundColor: "var(--mantine-color-gray-light)",
                      },
                    }}
                  >
                    <Group>
                      <Avatar
                        src="https://api.dicebear.com/7.x/initials/svg?seed=WK&backgroundColor=dc143c&textColor=ffffff"
                        radius="xl"
                        size="sm"
                      />
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          Admin
                        </Text>
                        <Text c="dimmed" size="xs">
                          Access
                        </Text>
                      </Box>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Admin Access</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconUser
                        style={{ width: rem(14), height: rem(14) }}
                        stroke={1.5}
                      />
                    }
                    onClick={() => navigate("/login")}
                  >
                    Admin Login
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* Mobile Menu Button */}
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title={
          <Group gap="sm">
            <Avatar
              src="https://api.dicebear.com/7.x/initials/svg?seed=WK&backgroundColor=dc143c&textColor=ffffff"
              size="md"
              radius="sm"
            />
            <div>
              <Text fw={700} size="lg" c="crimson">
                Wheeler Knight
              </Text>
              <Text size="xs" c="dimmed">
                Portfolio
              </Text>
            </div>
          </Group>
        }
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="md">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "filled" : "subtle"}
                color={isActive(item.path) ? "crimson" : "gray"}
                leftSection={<Icon size={16} />}
                fullWidth
                justify="flex-start"
                onClick={() => {
                  navigate(item.path);
                  close();
                }}
              >
                {item.label}
              </Button>
            );
          })}

          <Button
            variant="outline"
            color="crimson"
            leftSection={<IconUser size={16} />}
            fullWidth
            onClick={() => {
              navigate("/login");
              close();
            }}
          >
            Admin Login
          </Button>
        </Stack>
      </Drawer>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      {/* Footer */}
      <AppShell.Footer p="md">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {/* Brand */}
            <Box>
              <Group gap="sm" mb="sm">
                <Avatar
                  src="https://api.dicebear.com/7.x/initials/svg?seed=WK&backgroundColor=dc143c&textColor=ffffff"
                  size="sm"
                  radius="sm"
                />
                <Text fw={700} c="crimson">
                  Wheeler Knight
                </Text>
              </Group>
              <Text size="sm" c="dimmed" mb="sm">
                Management Information Systems Student | Computer Science Minor
              </Text>
              <Text size="sm" c="dimmed">
                University of Alabama | Class of 2026
              </Text>
            </Box>

            {/* Quick Links */}
            <Box>
              <Text fw={500} mb="sm">
                Quick Links
              </Text>
              <Stack gap="xs">
                <Anchor href="/about" size="sm">
                  About Me
                </Anchor>
                <Anchor href="/resume" size="sm">
                  Resume
                </Anchor>
                <Anchor href="/projects" size="sm">
                  Projects
                </Anchor>
                <Anchor href="/blog" size="sm">
                  Blog
                </Anchor>
                <Anchor href="/contact" size="sm">
                  Contact
                </Anchor>
              </Stack>
            </Box>

            {/* Contact Info */}
            <Box>
              <Text fw={500} mb="sm">
                Get In Touch
              </Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <IconMail size={14} color="gray" />
                  <Anchor href="mailto:wheeler@wheelerknight.com" size="sm">
                    wheeler@wheelerknight.com
                  </Anchor>
                </Group>
                <Group gap="xs">
                  <IconPhone size={14} color="gray" />
                  <Text size="sm">(256) 555-0123</Text>
                </Group>
                <Group gap="xs">
                  <IconMapPin size={14} color="gray" />
                  <Text size="sm">Moulton, Alabama</Text>
                </Group>
                <Group gap="md" mt="sm">
                  <Anchor
                    href="https://linkedin.com/in/wheelerknight"
                    target="_blank"
                  >
                    <ThemeIcon color="blue" variant="light" size="sm">
                      <IconBrandLinkedin size={16} />
                    </ThemeIcon>
                  </Anchor>
                  <Anchor
                    href="https://github.com/wheelerknight"
                    target="_blank"
                  >
                    <ThemeIcon color="gray" variant="light" size="sm">
                      <IconBrandGithub size={16} />
                    </ThemeIcon>
                  </Anchor>
                </Group>
              </Stack>
            </Box>
          </SimpleGrid>

          <Divider my="md" />

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              © 2024 Wheeler Knight. All rights reserved.
            </Text>
            <Text size="sm" c="dimmed">
              Built with React & Mantine UI
            </Text>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
};

export default PublicLayout;
