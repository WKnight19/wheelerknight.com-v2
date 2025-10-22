// Image Optimization Utilities for Wheeler Knight Portfolio
import React from 'react';

// Image optimization configuration
export const IMAGE_CONFIG = {
  // Quality settings for different image types
  QUALITY: {
    HIGH: 90,
    MEDIUM: 75,
    LOW: 60,
  },
  
  // Sizes for responsive images
  SIZES: {
    THUMBNAIL: 150,
    SMALL: 300,
    MEDIUM: 600,
    LARGE: 1200,
    XLARGE: 1920,
  },
  
  // Formats supported
  FORMATS: ['webp', 'avif', 'jpg', 'png'],
};

// Generate responsive image srcset
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [300, 600, 900, 1200, 1920]
): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
    .join(', ');
};

// Generate responsive image sizes attribute
export const generateSizes = (): string => {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
};

// Optimize image URL with parameters
export const optimizeImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}
): string => {
  if (!url) return '';
  
  // If it's already an optimized URL (contains query params), return as is
  if (url.includes('?')) return url;
  
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);
  if (options.fit) params.set('fit', options.fit);
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Lazy loading image component
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = IMAGE_CONFIG.QUALITY.MEDIUM,
  format = 'webp',
  fit = 'cover',
  className,
  style,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const optimizedSrc = optimizeImageUrl(src, {
    width,
    height,
    quality,
    format,
    fit,
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        backgroundColor: '#f5f5f5',
        ...style,
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px',
          }}
        >
          {placeholder || 'Loading...'}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '14px',
          }}
        >
          Failed to load
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
};

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = generateSizes(),
  className,
  style,
  quality = IMAGE_CONFIG.QUALITY.MEDIUM,
  format = 'webp',
  fit = 'cover',
}) => {
  const srcSet = generateSrcSet(src);
  const optimizedSrc = optimizeImageUrl(src, { quality, format, fit });

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: fit,
        ...style,
      }}
      loading="lazy"
    />
  );
};

// Image compression utility
export const compressImage = (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, format = 'jpeg' } = options;
      
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
