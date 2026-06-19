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
 * - Handles Laravel /asset/ paths
 * 
 * ============================================
 */

import { useState, useMemo } from 'react';
import { getFallbackUrl, isValidImageUrl, getImageUrl } from './imageConstants';

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
  // ============================================
  // STATE
  // ============================================
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(initialFallbackFailed);

  // ============================================
  // DETERMINE IMAGE SOURCE
  // ============================================
  const imageSrc = hasError ? fallback : src || fallback;

  // ============================================
  // HANDLERS
  // ============================================
  const handleError = (e) => {
    if (hasError) {
      setFallbackFailed(true);
      console.warn(`Fallback image failed to load: ${fallback}`);
      onError?.(e);
      return;
    }

    setHasError(true);
    onError?.(e);

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

  // ============================================
  // RENDER - Fallback Failure State
  // ============================================
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
  assetUrl,  // ← Accept assetUrl instead of storageUrl
  ...rest
}) => {
  // Use provided assetUrl or default from env
  const resolvedAssetUrl = assetUrl || import.meta.env.VITE_ASSET_URL || 'http://localhost:8000/asset/';

  // ============================================
  // MEMOIZE FALLBACK URL
  // ============================================
  const fallback = useMemo(() => {
    if (fallbackSrc) return fallbackSrc;
    return getFallbackUrl(fallbackType);
  }, [fallbackSrc, fallbackType]);

  // ============================================
  // RESOLVE IMAGE URL - Using asset URL
  // ============================================
  const resolvedSrc = useMemo(() => {
    return getImageUrl(src, fallbackType, resolvedAssetUrl);
  }, [src, fallbackType, resolvedAssetUrl]);

  // ============================================
  // DETERMINE IF FALLBACK SHOULD BE USED IMMEDIATELY
  // ============================================
  const shouldUseFallback = !resolvedSrc || !isValidImageUrl(resolvedSrc);

  // ============================================
  // CREATE UNIQUE KEY FOR STATE RESET
  // ============================================
  const key = useMemo(() => {
    return `${resolvedSrc || 'empty'}-${fallbackType}-${fallbackSrc || 'default'}`;
  }, [resolvedSrc, fallbackType, fallbackSrc]);

  // ============================================
  // RENDER
  // ============================================
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
      src={resolvedSrc}
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