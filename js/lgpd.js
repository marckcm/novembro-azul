import { announceToScreenReader } from './accessibility.js';

let accessibilityStorageEnabled = true;

function acceptLGPD() {
  localStorage.setItem("lgpdConsent", "accepted");
  localStorage.setItem("lgpdTimestamp", new Date().toISOString());
  document.getElementById("lgpdPopup").classList.remove("show");
  announceToScreenReader("Preferências de privacidade aceitas");
}

function openLGPDSettings() {
  document.getElementById("lgpdModal").classList.add("show");
  document.getElementById("lgpdPopup").classList.remove("show");

  const storageEnabled = localStorage.getItem("accessibilityStorageEnabled") !== "false";
  document.getElementById("accessibility-storage").checked = storageEnabled;
}

function closeLGPDSettings() {
  document.getElementById("lgpdModal").classList.remove("show");
}

function toggleAccessibilityStorage() {
  const isEnabled = document.getElementById("accessibility-storage").checked;
  accessibilityStorageEnabled = isEnabled;
  localStorage.setItem("accessibilityStorageEnabled", isEnabled);

  if (!isEnabled) {
    localStorage.removeItem("accessibilitySettings");
    announceToScreenReader("Armazenamento de preferências de acessibilidade desativado");
  } else {
    announceToScreenReader("Armazenamento de preferências de acessibilidade ativado");
  }
}

function saveLGPDSettings() {
  acceptLGPD();
  closeLGPDSettings();
  announceToScreenReader("Configurações de privacidade salvas com sucesso");
}

function checkLGPDConsent() {
  const consent = localStorage.getItem("lgpdConsent");
  if (!consent) {
    setTimeout(() => {
      document.getElementById("lgpdPopup").classList.add("show");
      announceToScreenReader("Aviso de privacidade e proteção de dados");
    }, 1000);
  }
}

export function initLgpd() {
    // Event Listeners
    document.getElementById('acceptLGPD')?.addEventListener('click', acceptLGPD);
    document.getElementById('openLGPDSettings')?.addEventListener('click', openLGPDSettings);
    document.getElementById('closeLGPDSettings')?.addEventListener('click', closeLGPDSettings);
    document.getElementById('cancelLGPDSettings')?.addEventListener('click', closeLGPDSettings);
    document.getElementById('saveLGPDSettings')?.addEventListener('click', saveLGPDSettings);
    document.getElementById('accessibility-storage')?.addEventListener('change', toggleAccessibilityStorage);

    // Modal Listeners
    const lgpdModal = document.getElementById("lgpdModal");
    if (lgpdModal) {
        lgpdModal.addEventListener("click", (e) => {
            if (e.target.id === "lgpdModal") {
                closeLGPDSettings();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLGPDSettings();
            // Also close accessibility menu if open
            const accessibilityMenu = document.getElementById("accessibilityMenu");
            if (accessibilityMenu?.classList.contains("active")) {
                accessibilityMenu.classList.remove("active");
                document.getElementById("accessibilityToggle")?.setAttribute("aria-expanded", "false");
                accessibilityMenu.setAttribute("aria-hidden", "true");
            }
        }
    });

    checkLGPDConsent();
}