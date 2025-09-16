// assets/js/app.js
import "./modules/navigation.js";
import "./modules/cookie-consent.js";

if (document.querySelector("[data-calc]")) {
  import("./modules/app-calculadoras.js").catch(e =>
    console.error("Erro ao carregar app-calculadoras.js", e)
  );
}
