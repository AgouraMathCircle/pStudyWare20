/**
 * Image utility functions for optimization
 */

/**
 * Generate responsive image srcset
 * @param {string} baseSrc - Base image source
 * @param {number[]} widths - Array of widths for srcset
 * @returns {string} - srcset string
 */
export const generateSrcSet = (baseSrc, widths = [400, 800, 1200, 1600]) => {
  // For now, return the base src as Vite handles optimization
  // In production, you could integrate with an image CDN or service
  return baseSrc;
};

/**
 * Get optimized image URL (placeholder for future CDN integration)
 * @param {string} src - Original image source
 * @param {object} options - Optimization options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {number} options.quality - Quality (1-100)
 * @param {string} options.format - Image format (webp, jpg, png)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (src, options = {}) => {
  // For now, return the original src
  // In production, integrate with image optimization service/CDN
  // Example: return `${CDN_BASE_URL}${src}?w=${width}&h=${height}&q=${quality}&f=${format}`;
  return src;
};

/**
 * Check if image is above the fold (critical)
 * @param {HTMLElement} element - Image element
 * @returns {boolean}
 */
export const isAboveTheFold = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

/**
 * Lazy load image with intersection observer
 * @param {HTMLElement} imgElement - Image element
 * @param {string} src - Image source
 * @param {Function} onLoad - Callback when loaded
 */
export const lazyLoadImage = (imgElement, src, onLoad) => {
  if (!imgElement || !src) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          if (onLoad) {
            img.onload = onLoad;
          }
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  observer.observe(imgElement);
};

/**
 * Get image dimensions
 * @param {string} src - Image source
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

