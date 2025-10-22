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
import PublicLayout from "./components/public/PublicLayout";
import HomePage from "./components/public/HomePage";
import ProjectsPage from "./components/public/ProjectsPage";
import BlogPage from "./components/public/BlogPage";
import ContactPage from "./components/public/ContactPage";
import NotFoundPage from "./components/public/NotFoundPage";
import { withAuth } from "./contexts/AuthContext";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Protected Dashboard Component
const ProtectedDashboard = withAuth(() => (
  <AdminLayout>
    <DashboardPage />
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
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedDashboard />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="skills" element={<DashboardPage />} />
                  <Route path="projects" element={<DashboardPage />} />
                  <Route path="blog" element={<DashboardPage />} />
                  <Route path="messages" element={<DashboardPage />} />
                  <Route path="education" element={<DashboardPage />} />
                  <Route path="experience" element={<DashboardPage />} />
                  <Route path="interests" element={<DashboardPage />} />
                </Route>

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
