// Lazy Loading Utilities for Wheeler Knight Portfolio
import { lazy, Suspense, ComponentType } from 'react';
import { Loader, Center, Stack, Text } from '@mantine/core';

// Loading fallback component
const LoadingFallback = () => (
  <Center style={{ height: '50vh' }}>
    <Stack align="center" gap="md">
      <Loader size="lg" />
      <Text c="dimmed">Loading...</Text>
    </Stack>
  </Center>
);

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <Suspense fallback={fallback ? <fallback /> : <LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load admin components
export const LazySkillsPage = lazy(() => import('../components/admin/SkillsPage'));
export const LazyProjectsPage = lazy(() => import('../components/admin/ProjectsPage'));
export const LazyBlogPage = lazy(() => import('../components/admin/BlogPage'));
export const LazyMessagesPage = lazy(() => import('../components/admin/MessagesPage'));
export const LazyEducationPage = lazy(() => import('../components/admin/EducationPage'));
export const LazyWorkExperiencePage = lazy(() => import('../components/admin/WorkExperiencePage'));
export const LazyInterestsPage = lazy(() => import('../components/admin/InterestsPage'));

// Lazy load public components
export const LazyAboutPage = lazy(() => import('../components/public/AboutPage'));
export const LazyResumePage = lazy(() => import('../components/public/ResumePage'));
export const LazyBlogPostPage = lazy(() => import('../components/public/BlogPostPage'));
export const LazyProjectsPagePublic = lazy(() => import('../components/public/ProjectsPage'));
export const LazyBlogPagePublic = lazy(() => import('../components/public/BlogPage'));
export const LazyContactPage = lazy(() => import('../components/public/ContactPage'));

// Lazy load UI components
export const LazyFileUpload = lazy(() => import('../components/ui/FileUpload'));

// Utility function to preload components
export const preloadComponent = (importFunction: () => Promise<any>) => {
  return () => {
    importFunction();
    return null;
  };
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload admin components when user is authenticated
  if (localStorage.getItem('token')) {
    import('../components/admin/SkillsPage');
    import('../components/admin/ProjectsPage');
    import('../components/admin/BlogPage');
  }
  
  // Preload public components
  import('../components/public/AboutPage');
  import('../components/public/ResumePage');
};

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };
    
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};
