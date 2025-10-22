// API Client for Wheeler Knight Portfolio
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service Classes
export class AuthService {
  static async login(credentials: { username: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  static async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  static async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  static async validateToken() {
    const response = await apiClient.get('/auth/validate-token');
    return response.data;
  }

  static async changePassword(data: { current_password: string; new_password: string }) {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  }
}

export class SkillsService {
  static async getSkills(params?: {
    category?: string;
    featured?: boolean;
    page?: number;
    per_page?: number;
  }) {
    const response = await apiClient.get('/skills/', { params });
    return response.data;
  }

  static async getSkill(id: number) {
    const response = await apiClient.get(`/skills/${id}`);
    return response.data;
  }

  static async getSkillCategories() {
    const response = await apiClient.get('/skills/categories');
    return response.data;
  }

  static async getSkillsStats() {
    const response = await apiClient.get('/skills/stats');
    return response.data;
  }

  static async createSkill(data: {
    name: string;
    category: string;
    proficiency_level?: number;
    description?: string;
    icon?: string;
    display_order?: number;
    is_featured?: boolean;
  }) {
    const response = await apiClient.post('/skills/', data);
    return response.data;
  }

  static async updateSkill(id: number, data: any) {
    const response = await apiClient.put(`/skills/${id}`, data);
    return response.data;
  }

  static async deleteSkill(id: number) {
    const response = await apiClient.delete(`/skills/${id}`);
    return response.data;
  }
}

export class ProjectsService {
  static async getProjects(params?: {
    status?: string;
    featured?: boolean;
    page?: number;
    per_page?: number;
  }) {
    const response = await apiClient.get('/projects/', { params });
    return response.data;
  }

  static async getProject(id: number) {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }

  static async getProjectStatuses() {
    const response = await apiClient.get('/projects/statuses');
    return response.data;
  }

  static async getProjectsStats() {
    const response = await apiClient.get('/projects/stats');
    return response.data;
  }

  static async createProject(data: {
    title: string;
    description: string;
    long_description?: string;
    technologies?: string[];
    github_url?: string;
    live_url?: string;
    featured_image?: string;
    images?: string[];
    status?: string;
    start_date?: string;
    end_date?: string;
    display_order?: number;
    is_featured?: boolean;
  }) {
    const response = await apiClient.post('/projects/', data);
    return response.data;
  }

  static async updateProject(id: number, data: any) {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  }

  static async deleteProject(id: number) {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }
}

export class BlogService {
  static async getBlogPosts(params?: {
    status?: string;
    featured?: boolean;
    page?: number;
    per_page?: number;
  }) {
    const response = await apiClient.get('/blog/', { params });
    return response.data;
  }

  static async getBlogPost(id: number) {
    const response = await apiClient.get(`/blog/${id}`);
    return response.data;
  }

  static async getBlogPostBySlug(slug: string) {
    const response = await apiClient.get(`/blog/slug/${slug}`);
    return response.data;
  }

  static async getPostStatuses() {
    const response = await apiClient.get('/blog/statuses');
    return response.data;
  }

  static async getBlogStats() {
    const response = await apiClient.get('/blog/stats');
    return response.data;
  }

  static async createBlogPost(data: {
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    featured_image?: string;
    status?: string;
  }) {
    const response = await apiClient.post('/blog/', data);
    return response.data;
  }

  static async updateBlogPost(id: number, data: any) {
    const response = await apiClient.put(`/blog/${id}`, data);
    return response.data;
  }

  static async deleteBlogPost(id: number) {
    const response = await apiClient.delete(`/blog/${id}`);
    return response.data;
  }

  static async likeBlogPost(id: number) {
    const response = await apiClient.post(`/blog/${id}/like`);
    return response.data;
  }
}

export class ContactService {
  static async getContactInfo() {
    const response = await apiClient.get('/contact/info');
    return response.data;
  }

  static async submitMessage(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
    company?: string;
  }) {
    const response = await apiClient.post('/contact/messages', data);
    return response.data;
  }

  static async getMessages(params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }) {
    const response = await apiClient.get('/contact/messages', { params });
    return response.data;
  }

  static async getMessage(id: number) {
    const response = await apiClient.get(`/contact/messages/${id}`);
    return response.data;
  }

  static async updateMessage(id: number, data: { status: string }) {
    const response = await apiClient.put(`/contact/messages/${id}`, data);
    return response.data;
  }

  static async deleteMessage(id: number) {
    const response = await apiClient.delete(`/contact/messages/${id}`);
    return response.data;
  }

  static async replyToMessage(id: number, data: { reply_content: string }) {
    const response = await apiClient.post(`/contact/messages/${id}/reply`, data);
    return response.data;
  }

  static async getContactStats() {
    const response = await apiClient.get('/contact/stats');
    return response.data;
  }
}

export class PortfolioService {
  static async getEducation() {
    const response = await apiClient.get('/portfolio/education');
    return response.data;
  }

  static async getWorkExperience() {
    const response = await apiClient.get('/portfolio/experience');
    return response.data;
  }

  static async getInterests(params?: {
    category?: string;
    featured?: boolean;
  }) {
    const response = await apiClient.get('/portfolio/interests', { params });
    return response.data;
  }

  static async getInterestCategories() {
    const response = await apiClient.get('/portfolio/interests/categories');
    return response.data;
  }

  static async getPortfolioSummary() {
    const response = await apiClient.get('/portfolio/summary');
    return response.data;
  }

  // Admin-only methods
  static async createEducation(data: {
    institution: string;
    degree: string;
    field_of_study?: string;
    gpa?: number;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    description?: string;
    achievements?: string[];
    display_order?: number;
  }) {
    const response = await apiClient.post('/portfolio/education', data);
    return response.data;
  }

  static async updateEducation(id: number, data: any) {
    const response = await apiClient.put(`/portfolio/education/${id}`, data);
    return response.data;
  }

  static async createWorkExperience(data: {
    company: string;
    position: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    description?: string;
    achievements?: string[];
    technologies?: string[];
    display_order?: number;
  }) {
    const response = await apiClient.post('/portfolio/experience', data);
    return response.data;
  }

  static async updateWorkExperience(id: number, data: any) {
    const response = await apiClient.put(`/portfolio/experience/${id}`, data);
    return response.data;
  }

  static async createInterest(data: {
    title: string;
    category: string;
    description?: string;
    image_url?: string;
    external_url?: string;
    display_order?: number;
    is_featured?: boolean;
  }) {
    const response = await apiClient.post('/portfolio/interests', data);
    return response.data;
  }

  static async updateInterest(id: number, data: any) {
    const response = await apiClient.put(`/portfolio/interests/${id}`, data);
    return response.data;
  }
}

export default apiClient;
