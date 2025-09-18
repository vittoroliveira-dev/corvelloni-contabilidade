// /assets/js/app.js
import "/assets/js/modules/navigation.js";
import "/assets/js/modules/cookie-consent.js";

const onReady = (fn) =>
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn, { once: true })
    : fn();

const idle = (cb) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(cb, { timeout: 1500 })
    : setTimeout(cb, 0);

function boot(module, prefer) {
  if (typeof module?.[prefer] === "function") return module[prefer]();
  if (typeof module?.default === "function") return module.default();
  const fallbacks = ["bootCalculators", "initCltPjCalculator", "initCustoCnpjCalculator"];
  for (const fn of fallbacks) if (typeof module?.[fn] === "function") return module[fn]();
}

/* Patch A11Y dropdown: garante hidden/aria-expanded e fecha ao clicar fora/Escape */
function initDropdownA11yPatch() {
  if (document.body.dataset.dropdownPatched) return;
  document.body.dataset.dropdownPatched = "1";

  const btn = document.getElementById("btn-calculadoras");
  const menu = document.getElementById("submenu-calculadoras");
  if (!btn || !menu) return;

  const close = () => {
    btn.setAttribute("aria-expanded", "false");
    menu.setAttribute("hidden", "");
  };
  const open = () => {
    btn.setAttribute("aria-expanded", "true");
    menu.removeAttribute("hidden");
  };

  // estado inicial fechado
  close();

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      close();
    }
  });
}

onReady(() => {
  // patch de dropdown acessível - DISABLED: conflicts with navigation.js
  // initDropdownA11yPatch();

  // patch novo: modal de ajuda (dialog) sob demanda
  if (document.querySelector("[data-help-open]")) {
    idle(() =>
      import("/assets/js/modules/help-dialog.js")
        .then((m) => m.initHelpDialogs?.())
        .catch((e) => console.error("Falha ao carregar help-dialog.js", e))
    );
  }

  // calculadoras sob demanda
  const needCLT = document.querySelector('[data-calc="clt-pj"]');
  const needCusto = document.querySelector(
    '[data-calc="custo-cnpj"],[data-calc="custo-pj"],[data-calc="custo-abertura"],[data-calc="custo-abertura-pj"]'
  );

  if (needCLT) {
    idle(() =>
      import("/assets/js/modules/clt-vs-pj.js")
        .then((m) => boot(m, "initCltPjCalculator"))
        .catch((e) => console.error("Falha ao carregar clt-vs-pj.js", e))
    );
  }

  if (needCusto) {
    idle(() =>
      import("/assets/js/modules/custos-abertura-pj.js")
        .then((m) => boot(m, "initCustoCnpjCalculator"))
        .catch((e) => console.error("Falha ao carregar custos-abertura-pj.js", e))
    );
  }
});
