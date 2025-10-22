import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./providers/QueryProvider";
import LoginPage from "./components/auth/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./components/admin/DashboardPage";
import SkillsPage from "./components/admin/SkillsPage";
import ProjectsPage from "./components/admin/ProjectsPage";
import BlogPage from "./components/admin/BlogPage";
import MessagesPage from "./components/admin/MessagesPage";
import EducationPage from "./components/admin/EducationPage";
import WorkExperiencePage from "./components/admin/WorkExperiencePage";
import InterestsPage from "./components/admin/InterestsPage";
import PublicLayout from "./components/public/PublicLayout";
import HomePage from "./components/public/HomePage";
import PublicProjectsPage from "./components/public/ProjectsPage";
import PublicBlogPage from "./components/public/BlogPage";
import AboutPage from "./components/public/AboutPage";
import ResumePage from "./components/public/ResumePage";
import BlogPostPage from "./components/public/BlogPostPage";
import ContactPage from "./components/public/ContactPage";
import NotFoundPage from "./components/public/NotFoundPage";
import { withAuth } from "./contexts/AuthContext";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Protected Admin Components
const ProtectedDashboard = withAuth(() => (
  <AdminLayout>
    <DashboardPage />
  </AdminLayout>
));

const ProtectedSkills = withAuth(() => (
  <AdminLayout>
    <SkillsPage />
  </AdminLayout>
));

const ProtectedProjects = withAuth(() => (
  <AdminLayout>
    <ProjectsPage />
  </AdminLayout>
));

const ProtectedBlog = withAuth(() => (
  <AdminLayout>
    <BlogPage />
  </AdminLayout>
));

const ProtectedMessages = withAuth(() => (
  <AdminLayout>
    <MessagesPage />
  </AdminLayout>
));

const ProtectedEducation = withAuth(() => (
  <AdminLayout>
    <EducationPage />
  </AdminLayout>
));

const ProtectedWorkExperience = withAuth(() => (
  <AdminLayout>
    <WorkExperiencePage />
  </AdminLayout>
));

const ProtectedInterests = withAuth(() => (
  <AdminLayout>
    <InterestsPage />
  </AdminLayout>
));

function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <QueryProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="resume" element={<ResumePage />} />
                  <Route path="projects" element={<PublicProjectsPage />} />
                  <Route path="blog" element={<PublicBlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedDashboard />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                </Route>
                <Route path="/admin/skills" element={<ProtectedSkills />} />
                <Route path="/admin/projects" element={<ProtectedProjects />} />
                <Route path="/admin/blog" element={<ProtectedBlog />} />
                <Route path="/admin/messages" element={<ProtectedMessages />} />
                <Route
                  path="/admin/education"
                  element={<ProtectedEducation />}
                />
                <Route
                  path="/admin/experience"
                  element={<ProtectedWorkExperience />}
                />
                <Route
                  path="/admin/interests"
                  element={<ProtectedInterests />}
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
