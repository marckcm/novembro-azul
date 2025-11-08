// js/constants.js
/**
 * Constantes da aplicação
 * Centraliza valores reutilizáveis para facilitar manutenção
 */

// Durações e Intervalos
export const ANIMATION_DURATION = 300;
export const CAROUSEL_INTERVAL = 5000;
export const SKELETON_DELAY = 1500;
export const DEBOUNCE_DELAY = 100;
export const ANNOUNCEMENT_TIMEOUT = 1000;

// Cores dos Procedimentos
export const COLORS = {
  "Consultas Especializadas": "#0066cc",
  "Exames de PSA": "#0080ff",
  "Biópsias de Próstata": "#27ae60",
};

// Atalhos de Teclado
export const KEYBOARD_SHORTCUTS = {
  INCREASE_FONT: "Alt+1",
  DECREASE_FONT: "Alt+2",
  TOGGLE_CONTRAST: "Alt+3",
  RESET_ALL: "Alt+0",
};

// Thresholds
export const SWIPE_THRESHOLD = 50;
export const SCROLL_THRESHOLD = 100;
export const BACK_TO_TOP_THRESHOLD = 300;

// Configurações de Acessibilidade
export const FONT_SIZE = {
  MIN: 80,
  MAX: 150,
  DEFAULT: 100,
  STEP: 10,
};

// Modo Debug
export const DEBUG = false; // Mudar para true em desenvolvimento

/**
 * Função de log condicional baseada no modo DEBUG
 */
export function log(...args) {
  if (DEBUG) console.log("[APP]", ...args);
}
