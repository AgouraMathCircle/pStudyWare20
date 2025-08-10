// Counter Animation Function
export function initCounterAnimation() {
  const counters = document.querySelectorAll(".sc-count");

  const animateCounter = (counter) => {
    const target = parseInt(
      counter.getAttribute("data-target") || counter.textContent
    );
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (!counter.classList.contains("animated")) {
          counter.classList.add("animated");
          animateCounter(counter);
        }
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    // Store the original value as data attribute
    const originalValue = counter.textContent;
    counter.setAttribute("data-target", originalValue);
    counter.textContent = "0";

    observer.observe(counter);
  });
}

// Initialize counter animation when DOM is loaded
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCounterAnimation);
  } else {
    initCounterAnimation();
  }
}
