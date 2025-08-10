// Home Component JavaScript Functions

// Carousel/Slider functionality
export const initCarousel = () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  };

  // Auto-advance carousel
  const autoAdvance = () => {
    nextSlide();
  };

  // Start auto-advance
  const interval = setInterval(autoAdvance, 5000);

  // Pause on hover
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(interval);
    });

    carouselContainer.addEventListener("mouseleave", () => {
      setInterval(autoAdvance, 5000);
    });
  }

  return {
    showSlide,
    nextSlide,
    prevSlide,
    currentSlide: () => currentSlide,
  };
};

// Smooth scrolling for anchor links
export const initSmoothScrolling = () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
};

// Animated counters
export const initCounters = () => {
  const counters = document.querySelectorAll(".counter");

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  // Intersection Observer for counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
};

// Newsletter form handling
export const initNewsletterForm = () => {
  const form = document.querySelector(".newsletter-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = form.querySelector('input[type="email"]').value;

      // Simulate API call
      console.log("Newsletter subscription:", email);

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "newsletter-success";
      successMessage.textContent = "Thank you for subscribing!";
      successMessage.style.cssText = `
        color: #53b50a;
        font-weight: 600;
        margin-top: 10px;
        text-align: center;
      `;

      form.appendChild(successMessage);

      // Clear form
      form.reset();

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    });
  }
};

// YouTube video lazy loading
export const initVideoLazyLoading = () => {
  const videoContainers = document.querySelectorAll(".video-container");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const iframe = entry.target.querySelector("iframe");
        if (iframe && !iframe.src) {
          const videoId = iframe.getAttribute("data-video-id");
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
        }
        observer.unobserve(entry.target);
      }
    });
  });

  videoContainers.forEach((container) => {
    observer.observe(container);
  });
};

// Parallax effect for banner
export const initParallax = () => {
  const banner = document.querySelector(".sc-banner");

  if (banner) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      banner.style.transform = `translateY(${rate}px)`;
    });
  }
};

// Animated arrows
export const initAnimatedArrows = () => {
  const arrows = document.querySelectorAll(".animated-arrow");

  arrows.forEach((arrow, index) => {
    const delay = index * 0.5;
    arrow.style.animationDelay = `${delay}s`;
  });
};

// Mobile menu toggle
export const initMobileMenu = () => {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }
};

// Initialize all functions when DOM is loaded
export const initHomePage = () => {
  document.addEventListener("DOMContentLoaded", () => {
    initCarousel();
    initSmoothScrolling();
    initCounters();
    initNewsletterForm();
    initVideoLazyLoading();
    initParallax();
    initAnimatedArrows();
    initMobileMenu();
  });
};

// Export for use in React components
export default {
  initCarousel,
  initSmoothScrolling,
  initCounters,
  initNewsletterForm,
  initVideoLazyLoading,
  initParallax,
  initAnimatedArrows,
  initMobileMenu,
  initHomePage,
};
