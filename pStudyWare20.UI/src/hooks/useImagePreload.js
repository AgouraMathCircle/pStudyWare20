import { useEffect, useState } from "react";

/**
 * Hook to preload images for faster rendering
 * @param {string[]} imageSources - Array of image sources to preload
 * @returns {boolean} - True when all images are loaded
 */
export const useImagePreload = (imageSources = []) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!imageSources || imageSources.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let isMounted = true;
    let loaded = 0;
    const total = imageSources.length;

    const preloadImages = () => {
      imageSources.forEach((src) => {
        if (!src) return;

        const img = new Image();
        img.onload = () => {
          if (isMounted) {
            loaded++;
            setLoadedCount(loaded);
            if (loaded === total) {
              setImagesLoaded(true);
            }
          }
        };
        img.onerror = () => {
          if (isMounted) {
            loaded++;
            setLoadedCount(loaded);
            if (loaded === total) {
              setImagesLoaded(true);
            }
          }
        };
        img.src = src;
      });
    };

    preloadImages();

    return () => {
      isMounted = false;
    };
  }, [imageSources]);

  return { imagesLoaded, loadedCount, total: imageSources.length };
};

/**
 * Preload a single image
 * @param {string} src - Image source to preload
 * @returns {Promise<void>}
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preload multiple images
 * @param {string[]} sources - Array of image sources
 * @returns {Promise<void[]>}
 */
export const preloadImages = (sources = []) => {
  return Promise.all(sources.map((src) => preloadImage(src)));
};

