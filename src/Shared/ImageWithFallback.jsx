// src/Shared/ImageWithFallback.jsx

/**
 * ============================================
 * IMAGE WITH FALLBACK - Smart Image Component
 * ============================================
 * 
 * PURPOSE:
 * - Renders an image with automatic fallback handling
 * - Shows a placeholder if the main image fails to load
 * - Handles both image and fallback failures gracefully
 * - Supports lazy loading for performance
 * 
 * FEATURES:
 * 1. Automatic fallback on image load error
 * 2. State reset when src changes
 * 3. Fallback failure handling (shows "Image unavailable")
 * 4. Lazy loading (performance optimization)
 * 5. Global error event dispatching for monitoring
 * 
 * USAGE:
 * <ImageWithFallback
 *   src={imageUrl}
 *   alt="Description"
 *   fallbackType="banner"
 *   className="w-full h-full object-cover"
 * />
 * 
 * FALLBACK TYPES:
 * - default: Generic placeholder
 * - banner: Large banner placeholder
 * - blog: Blog post placeholder
 * - program: Program image placeholder
 * - story: Story image placeholder
 * - ... see imageConstants.js for all types
 * 
 * ============================================
 */

// React
import { useState, useMemo } from 'react';

// Shared
import { getFallbackUrl, isValidImageUrl } from './imageConstants';

/**
 * Internal image renderer with state reset on src change
 * 
 * This component handles the actual image rendering with error states.
 * It's separate from the main component to allow for key-based state reset.
 */
function ImageRenderer({
  src,
  fallback,
  alt,
  className,
  imgProps,
  onError,
  onLoad,
  fallbackType,
  originalSrc,
  fallbackFailed: initialFallbackFailed = false,
  ...rest
}) {
  // ============================================
  // STATE
  // ============================================
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(initialFallbackFailed);

  // ============================================
  // DETERMINE IMAGE SOURCE
  // ============================================
  // If there's an error, use the fallback
  // Otherwise use the src (or fallback if src is null)
  const imageSrc = hasError ? fallback : src || fallback;

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Handle image load error
   * 
   * 1. If already showing fallback and it fails → mark as failed
   * 2. Otherwise → show fallback
   * 3. Dispatch global event for monitoring
   */
  const handleError = (e) => {
    // If we're already showing fallback and it fails, mark as failed
    if (hasError) {
      setFallbackFailed(true);
      console.warn(`Fallback image failed to load: ${fallback}`);
      onError?.(e);
      return;
    }

    // Show fallback
    setHasError(true);
    onError?.(e);

    // Dispatch global event for monitoring (e.g., Sentry, analytics)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('imageError', {
          detail: {
            src: originalSrc || src,
            alt,
            fallbackType,
          },
        })
      );
    }
  };

  /**
   * Handle image load success
   */
  const handleLoad = (e) => {
    onLoad?.(e);
  };

  // ============================================
  // RENDER - Fallback Failure State
  // ============================================
  // If both original and fallback fail, show a placeholder div
  if (fallbackFailed) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100px',
          backgroundColor: '#f5f5f5',
          color: '#999',
          fontSize: '14px',
          ...(rest.style || {}),
        }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <span>Image unavailable</span>
      </div>
    );
  }

  // ============================================
  // RENDER - Image
  // ============================================
  return (
    <img
      src={imageSrc}
      alt={alt || 'Image'}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      {...imgProps}
      {...rest}
    />
  );
}

/**
 * ImageWithFallback Component - Main Export
 * 
 * @param {string} src - Primary image source URL
 * @param {string} alt - Alt text for accessibility (default: 'Image')
 * @param {string} fallbackType - Type of fallback image from FALLBACK_IMAGES (default: 'default')
 * @param {string} fallbackSrc - Custom fallback image URL (overrides fallbackType)
 * @param {string} className - CSS classes for the image
 * @param {object} imgProps - Additional props for the img element
 * @param {function} onError - Error callback
 * @param {function} onLoad - Load callback
 * 
 * @returns {JSX.Element} Rendered image with fallback
 */
const ImageWithFallback = ({
  src,
  alt = 'Image',
  fallbackType = 'default',
  fallbackSrc = null,
  className = '',
  imgProps = {},
  onError,
  onLoad,
  ...rest
}) => {
  // ============================================
  // MEMOIZE FALLBACK URL
  // ============================================
  // Prevents unnecessary recalculations
  const fallback = useMemo(() => {
    if (fallbackSrc) return fallbackSrc;
    return getFallbackUrl(fallbackType);
  }, [fallbackSrc, fallbackType]);

  // ============================================
  // DETERMINE IF FALLBACK SHOULD BE USED IMMEDIATELY
  // ============================================
  const shouldUseFallback = !src || !isValidImageUrl(src);

  // ============================================
  // CREATE UNIQUE KEY FOR STATE RESET
  // ============================================
  // When src or fallback changes, the component re-mounts
  // This ensures error states are reset properly
  const key = useMemo(() => {
    return `${src || 'empty'}-${fallbackType}-${fallbackSrc || 'default'}`;
  }, [src, fallbackType, fallbackSrc]);

  // ============================================
  // RENDER
  // ============================================

  // If src is invalid, render fallback directly with error state
  if (shouldUseFallback) {
    return (
      <ImageRenderer
        key={`fallback-${key}`}
        src={null}
        fallback={fallback}
        alt={alt}
        className={className}
        imgProps={imgProps}
        onError={onError}
        onLoad={onLoad}
        fallbackType={fallbackType}
        originalSrc={src}
        fallbackFailed={false}
        {...rest}
      />
    );
  }

  // Normal render with potential fallback on error
  return (
    <ImageRenderer
      key={key}
      src={src}
      fallback={fallback}
      alt={alt}
      className={className}
      imgProps={imgProps}
      onError={onError}
      onLoad={onLoad}
      fallbackType={fallbackType}
      originalSrc={src}
      {...rest}
    />
  );
};

export default ImageWithFallback;