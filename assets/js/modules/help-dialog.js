export function initHelpDialogs() {
    const supportsDialog = typeof HTMLDialogElement === "function";
    if (!supportsDialog) document.documentElement.classList.add("no-dialog"); // <-- aqui

    document.querySelectorAll("[data-help-open]").forEach((btn) => {
        const sel = btn.getAttribute("data-help-open");
        const dlg = document.querySelector(sel);
        if (!dlg) return;
        let lastFocus = null;

        const open = () => {
            lastFocus = document.activeElement;
            supportsDialog ? dlg.showModal() : dlg.removeAttribute("hidden");
            dlg.querySelector(".c-help-dialog__close")?.focus();
        };
        const close = () => {
            supportsDialog ? dlg.close() : dlg.setAttribute("hidden", "");
            lastFocus?.focus?.();
        };

        btn.addEventListener("click", open);
        dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
        dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });

        // Escape no fallback (sem <dialog>)
        if (!supportsDialog) {
            dlg.setAttribute("role", "dialog");
            dlg.setAttribute("aria-modal", "true");

            const escapeHandler = (e) => { if (e.key === "Escape") close(); };
            const focusTrap = (e) => {
                if (e.key === "Tab") {
                    const focusables = dlg.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];

                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };

            document.addEventListener("keydown", escapeHandler);
            dlg.addEventListener("keydown", focusTrap);

            // Cleanup when dialog closes
            const originalClose = close;
            close = () => {
                document.removeEventListener("keydown", escapeHandler);
                dlg.removeEventListener("keydown", focusTrap);
                originalClose();
            };
        }

        dlg.querySelectorAll("[data-help-close]").forEach((b) => b.addEventListener("click", close));
    });
}
