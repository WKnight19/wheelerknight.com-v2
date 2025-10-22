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
} from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const PublicLayout: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: IconHome },
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
    </AppShell>
  );
};

export default PublicLayout;
