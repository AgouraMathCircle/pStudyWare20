import React, { useState, useRef, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";

/**
 * OptimizedImage Component
 * Provides lazy loading, placeholder, and error handling for images
 *
 * @param {string} src - Image source (imported image or URL)
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {object} sx - Material-UI sx prop for styling
 * @param {boolean} lazy - Enable lazy loading (default: true)
 * @param {string} placeholder - Placeholder image URL (optional)
 * @param {string} loading - Loading strategy: 'lazy' | 'eager' (default: 'lazy')
 * @param {number} width - Image width (for aspect ratio)
 * @param {number} height - Image height (for aspect ratio)
 * @param {string} objectFit - CSS object-fit property (default: 'cover')
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 */
const OptimizedImage = ({
  src,
  alt = "",
  className = "",
  sx = {},
  lazy = true,
  placeholder,
  loading = "lazy",
  width,
  height,
  objectFit = "cover",
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [lazy, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true); // Hide skeleton even on error
    if (onError) {
      onError(e);
    }
  };

  // Calculate aspect ratio for skeleton
  const aspectRatio = width && height ? height / width : undefined;
  const paddingBottom = aspectRatio ? `${aspectRatio * 100}%` : undefined;

  return (
    <Box
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      sx={{
        position: "relative",
        width: width || "100%",
        height: height || "auto",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        ...sx,
      }}
      {...props}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height || "100%"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#e0e0e0",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.5,
              },
            },
          }}
        />
      )}

      {/* Placeholder Image (blur-up technique) */}
      {placeholder && !isLoaded && (
        <Box
          component="img"
          src={placeholder}
          alt=""
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(10px)",
            transform: "scale(1.1)",
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Image */}
      {isInView && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          sx={{
            width: "100%",
            height: height || "auto",
            objectFit: objectFit,
            display: "block",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            ...(hasError && {
              display: "none", // Hide broken images
            }),
          }}
        />
      )}

      {/* Error Fallback */}
      {hasError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#999",
            fontSize: "0.875rem",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          Image not available
        </Box>
      )}
    </Box>
  );
};

export default OptimizedImage;
