const banner = document.querySelector("[data-cookie-banner]");
const acceptButton = document.querySelector("[data-cookie-accept]");
const rejectButton = document.querySelector("[data-cookie-reject]");
const STORAGE_KEY = "corvelloni-cookie-consent";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hideBanner = () => {
  if (banner) {
    banner.classList.remove("is-visible");
  }
};

if (banner && acceptButton && rejectButton) {
  const storedConsent = localStorage.getItem(STORAGE_KEY);

  if (!storedConsent) {
    banner.classList.add("is-visible");
    if (!prefersReducedMotion) {
      banner.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: "ease-out",
      });
    }
  }

  acceptButton.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    hideBanner();
  });

  rejectButton.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    hideBanner();
  });
}
