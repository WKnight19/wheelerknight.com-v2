// Caching Utilities for Wheeler Knight Portfolio
import { QueryClient } from '@tanstack/react-query';

// Cache configuration
export const CACHE_CONFIG = {
  // Default cache times (in milliseconds)
  TIMES: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
    VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // Stale times (in milliseconds)
  STALE_TIMES: {
    SHORT: 2 * 60 * 1000, // 2 minutes
    MEDIUM: 10 * 60 * 1000, // 10 minutes
    LONG: 60 * 60 * 1000, // 1 hour
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Local storage cache utility
export class LocalStorageCache {
  private static instance: LocalStorageCache;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): LocalStorageCache {
    if (!LocalStorageCache.instance) {
      LocalStorageCache.instance = new LocalStorageCache();
    }
    return LocalStorageCache.instance;
  }

  set(key: string, data: any, ttl: number = CACHE_CONFIG.TIMES.MEDIUM): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    this.cache.set(key, item);
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  get(key: string): any | null {
    // Check memory cache first
    const memoryItem = this.cache.get(key);
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const item = JSON.parse(stored);
        if (this.isValid(item)) {
          this.cache.set(key, item);
          return item.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }

    return null;
  }

  private isValid(item: { timestamp: number; ttl: number }): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  delete(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(`cache_${key}`);
  }

  clear(): void {
    this.cache.clear();
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }

  // Get cache statistics
  getStats(): { memorySize: number; localStorageSize: number } {
    const memorySize = this.cache.size;
    const localStorageSize = Object.keys(localStorage)
      .filter(key => key.startsWith('cache_')).length;
    
    return { memorySize, localStorageSize };
  }
}

// Memory cache utility
export class MemoryCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: any, ttl: number = CACHE_CONFIG.TIMES.SHORT): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (item && this.isValid(item)) {
      return item.data;
    }
    
    if (item) {
      this.cache.delete(key);
    }
    
    return null;
  }

  private isValid(item: { timestamp: number; ttl: number }): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Query client configuration for optimal caching
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes by default
        staleTime: CACHE_CONFIG.STALE_TIMES.MEDIUM,
        gcTime: CACHE_CONFIG.TIMES.MEDIUM,
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        
        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
};

// Cache key generators
export const CACHE_KEYS = {
  // Skills
  SKILLS: 'skills',
  SKILLS_STATS: 'skills_stats',
  SKILL: (id: number) => `skill_${id}`,
  
  // Projects
  PROJECTS: 'projects',
  PROJECTS_STATS: 'projects_stats',
  PROJECT: (id: number) => `project_${id}`,
  
  // Blog
  BLOG_POSTS: 'blog_posts',
  BLOG_POST: (slug: string) => `blog_post_${slug}`,
  BLOG_STATS: 'blog_stats',
  
  // Contact
  CONTACT_STATS: 'contact_stats',
  
  // Portfolio
  PORTFOLIO_SUMMARY: 'portfolio_summary',
  EDUCATION: 'education',
  WORK_EXPERIENCE: 'work_experience',
  INTERESTS: 'interests',
  CONTACT_INFO: 'contact_info',
  
  // Uploads
  UPLOADED_FILES: 'uploaded_files',
};

// Cache invalidation utilities
export const invalidateCache = (queryClient: QueryClient, keys: string[]) => {
  keys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};

// Prefetch utilities
export const prefetchData = async (
  queryClient: QueryClient,
  key: string,
  fetcher: () => Promise<any>,
  options?: { staleTime?: number; gcTime?: number }
) => {
  await queryClient.prefetchQuery({
    queryKey: [key],
    queryFn: fetcher,
    staleTime: options?.staleTime || CACHE_CONFIG.STALE_TIMES.MEDIUM,
    gcTime: options?.gcTime || CACHE_CONFIG.TIMES.MEDIUM,
  });
};

// Cache warming for critical data
export const warmCache = async (queryClient: QueryClient) => {
  const criticalKeys = [
    CACHE_KEYS.SKILLS,
    CACHE_KEYS.PROJECTS,
    CACHE_KEYS.BLOG_POSTS,
    CACHE_KEYS.PORTFOLIO_SUMMARY,
  ];

  // Prefetch critical data in background
  criticalKeys.forEach(key => {
    queryClient.prefetchQuery({
      queryKey: [key],
      queryFn: () => Promise.resolve(null), // Will be handled by actual queries
      staleTime: CACHE_CONFIG.STALE_TIMES.LONG,
    });
  });
};

// Service worker cache utilities
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Cache cleanup utility
export const cleanupCache = (queryClient: QueryClient) => {
  // Clear old cache entries
  queryClient.getQueryCache().clear();
  
  // Clear localStorage cache
  const localStorageCache = LocalStorageCache.getInstance();
  localStorageCache.clear();
  
  console.log('Cache cleaned up');
};
