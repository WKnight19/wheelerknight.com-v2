// Custom Hooks for Wheeler Knight Portfolio API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SkillsService, 
  ProjectsService, 
  BlogService, 
  ContactService, 
  PortfolioService,
  AuthService 
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Skills Hooks
export const useSkills = (params?: {
  category?: string;
  featured?: boolean;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => SkillsService.getSkills(params),
    select: (data) => data.data,
  });
};

export const useSkill = (id: number) => {
  return useQuery({
    queryKey: ['skill', id],
    queryFn: () => SkillsService.getSkill(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useSkillCategories = () => {
  return useQuery({
    queryKey: ['skill-categories'],
    queryFn: () => SkillsService.getSkillCategories(),
    select: (data) => data.data,
  });
};

export const useSkillsStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['skills-stats'],
    queryFn: () => SkillsService.getSkillsStats(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SkillsService.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-stats'] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      SkillsService.updateSkill(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skill', id] });
      queryClient.invalidateQueries({ queryKey: ['skills-stats'] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SkillsService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-stats'] });
    },
  });
};

// Projects Hooks
export const useProjects = (params?: {
  status?: string;
  featured?: boolean;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => ProjectsService.getProjects(params),
    select: (data) => data.data,
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => ProjectsService.getProject(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useProjectStatuses = () => {
  return useQuery({
    queryKey: ['project-statuses'],
    queryFn: () => ProjectsService.getProjectStatuses(),
    select: (data) => data.data,
  });
};

export const useProjectsStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['projects-stats'],
    queryFn: () => ProjectsService.getProjectsStats(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProjectsService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      ProjectsService.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProjectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
    },
  });
};

// Blog Hooks
export const useBlogPosts = (params?: {
  status?: string;
  featured?: boolean;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: () => BlogService.getBlogPosts(params),
    select: (data) => data.data,
  });
};

export const useBlogPost = (id: number) => {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => BlogService.getBlogPost(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => BlogService.getBlogPostBySlug(slug),
    select: (data) => data.data,
    enabled: !!slug,
  });
};

export const usePostStatuses = () => {
  return useQuery({
    queryKey: ['post-statuses'],
    queryFn: () => BlogService.getPostStatuses(),
    select: (data) => data.data,
  });
};

export const useBlogStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['blog-stats'],
    queryFn: () => BlogService.getBlogStats(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BlogService.createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      BlogService.updateBlogPost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', id] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BlogService.deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-stats'] });
    },
  });
};

export const useLikeBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BlogService.likeBlogPost,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', id] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Contact Hooks
export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: () => ContactService.getContactInfo(),
    select: (data) => data.data,
  });
};

export const useSubmitMessage = () => {
  return useMutation({
    mutationFn: ContactService.submitMessage,
  });
};

export const useMessages = (params?: {
  status?: string;
  page?: number;
  per_page?: number;
}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => ContactService.getMessages(params),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

export const useMessage = (id: number) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => ContactService.getMessage(id),
    select: (data) => data.data,
    enabled: isAuthenticated && !!id,
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      ContactService.updateMessage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message', id] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ContactService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
    },
  });
};

export const useReplyToMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      ContactService.replyToMessage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message', id] });
    },
  });
};

export const useContactStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['contact-stats'],
    queryFn: () => ContactService.getContactStats(),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

// Portfolio Hooks
export const useEducation = () => {
  return useQuery({
    queryKey: ['education'],
    queryFn: () => PortfolioService.getEducation(),
    select: (data) => data.data,
  });
};

export const useWorkExperience = () => {
  return useQuery({
    queryKey: ['work-experience'],
    queryFn: () => PortfolioService.getWorkExperience(),
    select: (data) => data.data,
  });
};

export const useInterests = (params?: {
  category?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ['interests', params],
    queryFn: () => PortfolioService.getInterests(params),
    select: (data) => data.data,
  });
};

export const useInterestCategories = () => {
  return useQuery({
    queryKey: ['interest-categories'],
    queryFn: () => PortfolioService.getInterestCategories(),
    select: (data) => data.data,
  });
};

export const usePortfolioSummary = () => {
  return useQuery({
    queryKey: ['portfolio-summary'],
    queryFn: () => PortfolioService.getPortfolioSummary(),
    select: (data) => data.data,
  });
};

// Admin Portfolio Hooks
export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PortfolioService.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      PortfolioService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};

export const useCreateWorkExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PortfolioService.createWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-experience'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      PortfolioService.updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-experience'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PortfolioService.createInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      PortfolioService.updateInterest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
    },
  });
};
