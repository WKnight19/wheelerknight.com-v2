// Admin Navigation Component for Wheeler Knight Portfolio
import React from "react";
import {
  AppShell,
  Text,
  Group,
  NavLink,
  Stack,
  Divider,
  Avatar,
  Menu,
  UnstyledButton,
  Box,
  rem,
} from "@mantine/core";
import {
  IconDashboard,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconUsers,
  IconCode,
  IconArticle,
  IconMail,
  IconSchool,
  IconBriefcase,
  IconHeart,
} from "@tabler/icons-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SkillsPage from "./SkillsPage";
import ProjectsPage from "./ProjectsPage";
import BlogPage from "./BlogPage";
import MessagesPage from "./MessagesPage";
import EducationPage from "./EducationPage";
import WorkExperiencePage from "./WorkExperiencePage";
import InterestsPage from "./InterestsPage";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: IconDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Skills",
      icon: IconCode,
      path: "/admin/skills",
    },
    {
      label: "Projects",
      icon: IconBriefcase,
      path: "/admin/projects",
    },
    {
      label: "Blog Posts",
      icon: IconArticle,
      path: "/admin/blog",
    },
    {
      label: "Messages",
      icon: IconMail,
      path: "/admin/messages",
    },
    {
      label: "Education",
      icon: IconSchool,
      path: "/admin/education",
    },
    {
      label: "Work Experience",
      icon: IconBriefcase,
      path: "/admin/experience",
    },
    {
      label: "Interests",
      icon: IconHeart,
      path: "/admin/interests",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return children;
      case "/admin/skills":
        return <SkillsPage />;
      case "/admin/projects":
        return <ProjectsPage />;
      case "/admin/blog":
        return <BlogPage />;
      case "/admin/messages":
        return <MessagesPage />;
      case "/admin/education":
        return <EducationPage />;
      case "/admin/experience":
        return <WorkExperiencePage />;
      case "/admin/interests":
        return <InterestsPage />;
      default:
        return children;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Text size="lg" fw={700} c="crimson">
              Wheeler Suite
            </Text>
            <Text size="sm" c="dimmed">
              Admin Dashboard
            </Text>
          </Group>

          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="sm">
                    <Avatar size="sm" color="crimson">
                      {user?.first_name?.[0] || user?.username?.[0] || "A"}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.full_name || user?.username}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user?.role?.replace("_", " ").toUpperCase()}
                      </Text>
                    </Box>
                    <IconChevronDown size={rem(12)} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate("/admin/profile")}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate("/admin/settings")}
                >
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                href={item.path}
                label={item.label}
                leftSection={<Icon size={16} />}
                active={isActive(item.path)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                variant="light"
              />
            );
          })}

          <Divider my="sm" />

          <NavLink
            href="/"
            label="View Portfolio"
            leftSection={<IconUsers size={16} />}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            variant="subtle"
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{renderContent()}</AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
