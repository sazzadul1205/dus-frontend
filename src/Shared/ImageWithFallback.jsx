// src/Shared/ImageWithFallback.jsx

import { useState, useMemo, useEffect } from 'react';
import { getFallbackUrl, isValidImageUrl } from './imageConstants';

/**
 * Internal image renderer with state reset on src change
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
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(initialFallbackFailed);

  // Reset error state when src changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasError(false);
    setFallbackFailed(false);
  }, [src, fallback]);

  const imageSrc = hasError ? fallback : src || fallback;

  const handleError = (e) => {
    // If we're already showing fallback and it fails, mark as failed
    if (hasError) {
      setFallbackFailed(true);
      console.warn(`Fallback image failed to load: ${fallback}`);
      onError?.(e);
      return;
    }

    setHasError(true);
    onError?.(e);

    // Dispatch global event for monitoring
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

  const handleLoad = (e) => {
    onLoad?.(e);
  };

  // If both original and fallback fail, show placeholder
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
 * Image component with automatic fallback handling
 * 
 * @param {string} src - Primary image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} fallbackType - Type of fallback image (from FALLBACK_IMAGES keys)
 * @param {string} fallbackSrc - Custom fallback image URL (overrides fallbackType)
 * @param {string} className - CSS classes for the image
 * @param {object} imgProps - Additional props for the img element
 * @param {function} onError - Error callback
 * @param {function} onLoad - Load callback
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
  // Memoize fallback to prevent unnecessary recalculations
  const fallback = useMemo(() => {
    if (fallbackSrc) return fallbackSrc;
    return getFallbackUrl(fallbackType);
  }, [fallbackSrc, fallbackType]);

  // Determine if we should use the fallback immediately
  const shouldUseFallback = !src || !isValidImageUrl(src);

  // Create a unique key to reset state when src or fallback changes
  const key = useMemo(() => {
    return `${src || 'empty'}-${fallbackType}-${fallbackSrc || 'default'}`;
  }, [src, fallbackType, fallbackSrc]);

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