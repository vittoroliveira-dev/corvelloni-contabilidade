const header = document.querySelector(".c-header");
const nav = document.querySelector(".c-nav");
const navToggle = document.querySelector("[data-nav-toggle]");

if (header && nav && navToggle) {
    const updateHeaderState = () => {
        if (window.scrollY > 24) {
            header.classList.add("is-solid");
        } else {
            header.classList.remove("is-solid");
        }
    };

    const closeNav = () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
    };

    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.classList.toggle("is-active", isOpen);
    });

    nav.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
        }
    });

    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
            nav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    updateHeaderState();
}
