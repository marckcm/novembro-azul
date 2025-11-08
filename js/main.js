﻿import { initAccessibility } from "./accessibility.js";
import { initCarousel } from "./carousel.js";
import { initChartModule } from "./chart.js";
import { initLgpd } from "./lgpd.js";

// Menu mobile
let hamburger;
let navLinks;
let overlay;

function toggleMenu() {
  if (!hamburger || !navLinks || !overlay) return;

  const isMenuOpen = hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  overlay.classList.toggle("active");
  hamburger.setAttribute("aria-expanded", isMenuOpen);

  if (isMenuOpen) {
    document.body.classList.add("body-no-scroll");
    document.addEventListener("keydown", handleFocusTrap);
  } else {
    document.body.classList.remove("body-no-scroll");
    document.removeEventListener("keydown", handleFocusTrap);
  }
}

function handleFocusTrap(e) {
  if (e.key !== "Tab") return;

  const focusableElements = navLinks.querySelectorAll(
    "a[href]:not([disabled])"
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

/**
 * Cria uma versão "debounced" de uma função que atrasa sua execução.
 * @param {Function} func A função a ser debounced.
 * @param {number} wait O tempo de espera em milissegundos.
 * @returns {Function} A nova função debounced.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // --- INICIALIZAÇÃO DOS MÓDULOS ---
  hamburger = document.getElementById("hamburger");
  navLinks = document.getElementById("navLinks");
  overlay = document.getElementById("overlay");

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
    // Suporte a teclado para hamburguer
    hamburger.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", toggleMenu);
  }

  // Fechar menu com a tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      toggleMenu();
    }
  });

  // Fechar menu ao clicar em link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // Navegacao suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Efeito de scroll no nav
  const nav = document.querySelector("nav");
  if (nav) {
    const backToTopBtn = document.getElementById("backToTopBtn");

    const handleScroll = () => {
      // Lógica da barra de navegação
      if (window.pageYOffset > 100) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      // Lógica do botão "Voltar ao Topo"
      if (backToTopBtn) {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      }
    };

    window.addEventListener("scroll", debounce(handleScroll, 100));
    backToTopBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Inicializa os módulos importados
  initAccessibility();
  initLgpd();
  initCarousel();
  initChartModule();
});
