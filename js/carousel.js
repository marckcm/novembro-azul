﻿import { announceToScreenReader } from "./accessibility.js";

let carouselIndex = 0;
let carouselAutoplay = true;
let carouselInterval;
let carouselSlides;
let carouselTrack;
let carouselIndicatorsContainer;

function updateCarousel() {
  if (
    !carouselTrack ||
    !carouselIndicatorsContainer ||
    !carouselSlides ||
    !carouselSlides.length
  ) {
    return;
  }

  carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;

  const indicators = carouselIndicatorsContainer.querySelectorAll(
    ".carousel-indicator"
  );
  indicators.forEach((indicator, index) => {
    if (index === carouselIndex) {
      indicator.classList.add("active");
      indicator.setAttribute("aria-selected", "true");
    } else {
      indicator.classList.remove("active");
      indicator.setAttribute("aria-selected", "false");
    }
  });

  const currentSlide = carouselSlides[carouselIndex];
  if (currentSlide) {
    const titleElement = currentSlide.querySelector(".carousel-title");
    if (titleElement) {
      const title = titleElement.textContent;
      announceToScreenReader(
        `Slide ${carouselIndex + 1} de ${carouselSlides.length}: ${title}`
      );
    }
  }
}

function carouselNext() {
  if (!carouselSlides || !carouselSlides.length) return;
  carouselIndex = (carouselIndex + 1) % carouselSlides.length;
  updateCarousel();
  resetAutoplay();
}

function carouselPrev() {
  if (!carouselSlides || !carouselSlides.length) return;
  carouselIndex =
    (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
  updateCarousel();
  resetAutoplay();
}

function goToSlide(index) {
  if (!carouselSlides || !carouselSlides.length) return;
  if (index < 0 || index >= carouselSlides.length) return;
  carouselIndex = index;
  updateCarousel();
  resetAutoplay();
}

function startAutoplay() {
  if (!carouselAutoplay || document.body.classList.contains("no-animations"))
    return;
  carouselInterval = setInterval(() => {
    carouselNext();
  }, 5000);
}

function pauseCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
}

function resetAutoplay() {
  pauseCarousel();
  if (carouselAutoplay) {
    startAutoplay();
  }
}

function toggleAutoplay() {
  const pauseBtn = document.getElementById("carouselPause");
  const pauseIcon = document.getElementById("pauseIcon");
  const pauseText = document.getElementById("pauseText");

  carouselAutoplay = !carouselAutoplay;

  if (carouselAutoplay) {
    pauseIcon.className = "fas fa-pause";
    pauseText.textContent = "Pausar";
    pauseBtn.setAttribute("aria-label", "Pausar carrossel automático");
    startAutoplay();
    announceToScreenReader("Carrossel retomado");
  } else {
    pauseIcon.className = "fas fa-play";
    pauseText.textContent = "Reproduzir";
    pauseBtn.setAttribute("aria-label", "Reproduzir carrossel automático");
    pauseCarousel();
    announceToScreenReader("Carrossel pausado");
  }
}

export function initCarousel() {
  carouselSlides = document.querySelectorAll(".carousel-slide");
  carouselTrack = document.getElementById("carouselTrack");
  carouselIndicatorsContainer = document.getElementById("carouselIndicators");

  if (
    !carouselSlides.length ||
    !carouselTrack ||
    !carouselIndicatorsContainer
  ) {
    console.warn("Elementos do carrossel não encontrados");
    return;
  }

  carouselSlides.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.className = "carousel-indicator";
    indicator.setAttribute("aria-label", `Ir para slide ${index + 1}`);
    indicator.setAttribute("role", "tab");
    indicator.addEventListener("click", () => goToSlide(index));
    carouselIndicatorsContainer.appendChild(indicator);
  });

  updateCarousel();
  startAutoplay();

  // Event Listeners
  document
    .getElementById("carouselPrevBtn")
    ?.addEventListener("click", carouselPrev);
  document
    .getElementById("carouselNextBtn")
    ?.addEventListener("click", carouselNext);
  document
    .getElementById("carouselPause")
    ?.addEventListener("click", toggleAutoplay);

  document
    .querySelector(".carousel-section")
    ?.addEventListener("mouseenter", () => {
      if (carouselAutoplay) pauseCarousel();
    });

  document
    .querySelector(".carousel-section")
    ?.addEventListener("mouseleave", () => {
      if (carouselAutoplay) startAutoplay();
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") carouselPrev();
    else if (e.key === "ArrowRight") carouselNext();
  });

  // Swipe support
  let touchStartX = 0;
  if (carouselTrack) {
    carouselTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    carouselTrack.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) carouselNext();
      if (touchEndX > touchStartX + 50) carouselPrev();
    });
  }

  // Listen for animation toggle events
  document.addEventListener("animations-toggled", (e) => {
    if (e.detail.enabled) {
      resetAutoplay();
    } else {
      pauseCarousel();
    }
  });
}
