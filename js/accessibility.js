let accessibilityToggle;
let accessibilityMenu;

// Configuracoes de acessibilidade
let fontSize = 100; // Percentual base

function changeFontSize(action) {
  const html = document.documentElement;

  if (action === "increase") {
    fontSize = Math.min(fontSize + 10, 150);
  } else if (action === "decrease") {
    fontSize = Math.max(fontSize - 10, 80);
  } else if (action === "reset") {
    fontSize = 100;
  }

  html.style.fontSize = fontSize + "%";
  saveAccessibilitySettings();

  // Anunciar mudanças para leitores de tela
  announceToScreenReader(`Tamanho da fonte alterado para ${fontSize}%`);
}

function toggleContrast() {
  const body = document.body;
  const btn = document.getElementById("contrastBtn");
  const isActive = body.classList.toggle("high-contrast");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();
  announceToScreenReader(
    isActive ? "Alto contraste ativado" : "Alto contraste desativado"
  );
}

function toggleSpacing() {
  const body = document.body;
  const btn = document.getElementById("spacingBtn");
  const isActive = body.classList.toggle("increased-spacing");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();
  announceToScreenReader(
    isActive
      ? "Espaçamento aumentado ativado"
      : "Espaçamento normal restaurado"
  );
}

function toggleReadableFont() {
  const body = document.body;
  const btn = document.getElementById("fontBtn");
  const isActive = body.classList.toggle("readable-font");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();
  announceToScreenReader(
    isActive ? "Fonte legível ativada" : "Fonte padrão restaurada"
  );
}

function toggleUnderlineLinks() {
  const body = document.body;
  const btn = document.getElementById("underlineBtn");
  const isActive = body.classList.toggle("underline-links");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();
  announceToScreenReader(
    isActive ? "Links sublinhados" : "Sublinhado removido"
  );
}

function toggleBigCursor() {
  const body = document.body;
  const btn = document.getElementById("cursorBtn");
  const isActive = body.classList.toggle("big-cursor");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();
  announceToScreenReader(
    isActive ? "Cursor grande ativado" : "Cursor normal restaurado"
  );
}

function toggleFocusMode() {
  const body = document.body;
  const btn = document.getElementById("focusBtn");
  const isActive = body.classList.toggle("focus-mode");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();

  if (isActive) {
    // Adicionar estilo de foco intenso
    const style = document.createElement("style");
    style.id = "focus-mode-style";
    style.textContent = `
            body.focus-mode *:focus {
                outline: 4px solid #ffeb3b !important;
                outline-offset: 2px !important;
            }
        `;
    document.head.appendChild(style);
    announceToScreenReader(
      "Modo de foco ativado - elementos focados terão destaque amarelo"
    );
  } else {
    const style = document.getElementById("focus-mode-style");
    if (style) style.remove();
    announceToScreenReader("Modo de foco desativado");
  }
}

function toggleAnimations() {
  const body = document.body;
  const btn = document.getElementById("animationsBtn");
  const isActive = body.classList.toggle("no-animations");

  btn.setAttribute("aria-pressed", isActive);
  saveAccessibilitySettings();

  if (isActive) {
    // Desativar todas as animacoes
    const style = document.createElement("style");
    style.id = "no-animations-style";
    style.textContent = `
            body.no-animations *,
            body.no-animations *::before,
            body.no-animations *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
    document.head.appendChild(style);

    // Dispara um evento customizado para notificar outros módulos (ex: carrossel)
    document.dispatchEvent(new CustomEvent('animations-toggled', { detail: { enabled: false } }));

    announceToScreenReader("Animações desativadas");
  } else {
    const style = document.getElementById("no-animations-style");
    if (style) style.remove();
    
    // Dispara um evento customizado para notificar outros módulos (ex: carrossel)
    document.dispatchEvent(new CustomEvent('animations-toggled', { detail: { enabled: true } }));

    announceToScreenReader("Animações ativadas");
  }
}

function resetAccessibility() {
  const body = document.body;
  const html = document.documentElement;

  // Resetar todas as classes
  body.classList.remove(
    "high-contrast", "increased-spacing", "readable-font",
    "underline-links", "big-cursor", "focus-mode", "no-animations"
  );

  // Remover estilos customizados
  const focusStyle = document.getElementById("focus-mode-style");
  const animStyle = document.getElementById("no-animations-style");
  if (focusStyle) focusStyle.remove();
  if (animStyle) animStyle.remove();

  // Resetar tamanho da fonte
  fontSize = 100;
  html.style.fontSize = "100%";

  // Resetar estados dos botoes
  document.querySelectorAll(".accessibility-controls button[aria-pressed]")
    .forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
    });

  // Limpar localStorage
  localStorage.removeItem("accessibilitySettings");

  announceToScreenReader("Todas as configurações de acessibilidade foram resetadas");
}

// Salvar configuracoes no localStorage
function saveAccessibilitySettings() {
  if (localStorage.getItem("accessibilityStorageEnabled") === "false") {
    return;
  }

  const settings = {
    fontSize: fontSize,
    highContrast: document.body.classList.contains("high-contrast"),
    increasedSpacing: document.body.classList.contains("increased-spacing"),
    readableFont: document.body.classList.contains("readable-font"),
    underlineLinks: document.body.classList.contains("underline-links"),
    bigCursor: document.body.classList.contains("big-cursor"),
    focusMode: document.body.classList.contains("focus-mode"),
    noAnimations: document.body.classList.contains("no-animations"),
  };

  localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
}

// Carregar configuracoes salvas
function loadAccessibilitySettings() {
  if (localStorage.getItem("accessibilityStorageEnabled") === "false") {
    return;
  }

  const saved = localStorage.getItem("accessibilitySettings");
  if (!saved) return;

  try {
    const settings = JSON.parse(saved);
    const body = document.body;
    const html = document.documentElement;

    if (settings.fontSize) {
      fontSize = settings.fontSize;
      html.style.fontSize = fontSize + "%";
    }
    if (settings.highContrast) { body.classList.add("high-contrast"); document.getElementById("contrastBtn").setAttribute("aria-pressed", "true"); }
    if (settings.increasedSpacing) { body.classList.add("increased-spacing"); document.getElementById("spacingBtn").setAttribute("aria-pressed", "true"); }
    if (settings.readableFont) { body.classList.add("readable-font"); document.getElementById("fontBtn").setAttribute("aria-pressed", "true"); }
    if (settings.underlineLinks) { body.classList.add("underline-links"); document.getElementById("underlineBtn").setAttribute("aria-pressed", "true"); }
    if (settings.bigCursor) { body.classList.add("big-cursor"); document.getElementById("cursorBtn").setAttribute("aria-pressed", "true"); }
    if (settings.focusMode) { body.classList.add("focus-mode"); document.getElementById("focusBtn").setAttribute("aria-pressed", "true"); toggleFocusMode(); }
    if (settings.noAnimations) { body.classList.add("no-animations"); document.getElementById("animationsBtn").setAttribute("aria-pressed", "true"); toggleAnimations(); }
  } catch (e) {
    console.error("Erro ao carregar configurações de acessibilidade:", e);
  }
}

// Anunciar mensagens para leitores de tela
export function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => { document.body.removeChild(announcement); }, 1000);
}

export function initAccessibility() {
  // Event Listeners
  document.getElementById('decreaseFontBtn')?.addEventListener('click', () => changeFontSize('decrease'));
  document.getElementById('resetFontBtn')?.addEventListener('click', () => changeFontSize('reset'));
  document.getElementById('increaseFontBtn')?.addEventListener('click', () => changeFontSize('increase'));
  document.getElementById('contrastBtn')?.addEventListener('click', toggleContrast);
  document.getElementById('spacingBtn')?.addEventListener('click', toggleSpacing);
  document.getElementById('fontBtn')?.addEventListener('click', toggleReadableFont);
  document.getElementById('underlineBtn')?.addEventListener('click', toggleUnderlineLinks);
  document.getElementById('cursorBtn')?.addEventListener('click', toggleBigCursor);
  document.getElementById('focusBtn')?.addEventListener('click', toggleFocusMode);
  document.getElementById('animationsBtn')?.addEventListener('click', toggleAnimations);
  document.getElementById('resetAccessibilityBtn')?.addEventListener('click', resetAccessibility);

  // Menu Toggle
  accessibilityToggle = document.getElementById("accessibilityToggle");
  accessibilityMenu = document.getElementById("accessibilityMenu");

  if (accessibilityToggle && accessibilityMenu) {
    accessibilityToggle.addEventListener("click", () => {
      const isExpanded = accessibilityToggle.getAttribute("aria-expanded") === "true";
      accessibilityToggle.setAttribute("aria-expanded", !isExpanded);
      accessibilityMenu.setAttribute("aria-hidden", isExpanded);
      accessibilityMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!accessibilityToggle.contains(e.target) && !accessibilityMenu.contains(e.target)) {
        accessibilityMenu.classList.remove("active");
        accessibilityToggle.setAttribute("aria-expanded", "false");
        accessibilityMenu.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key === "1") { e.preventDefault(); changeFontSize("increase"); }
    if (e.altKey && e.key === "2") { e.preventDefault(); changeFontSize("decrease"); }
    if (e.altKey && e.key === "3") { e.preventDefault(); toggleContrast(); }
    if (e.altKey && e.key === "0") { e.preventDefault(); resetAccessibility(); }
  });

  // Load saved settings on init
  loadAccessibilitySettings();
}