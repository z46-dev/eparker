import setTheme from "./lib/theming.js";
import updateTimely from "./lib/timely.js";

function updateActivePage() {
    const page = location.hash.slice(1).split("-")[0];

    document.querySelectorAll("div.content").forEach(div => {
        div.classList[div.id === page ? "add" : "remove"]("active");
    });

    if (document.querySelector("div.content.active") == null) {
        document.querySelector("div.content").classList.add("active");
        location.hash = document.querySelector("div.content").id;
    }
}

window.addEventListener("hashchange", updateActivePage);
window.addEventListener("load", function load() {
    updateActivePage();
    updateTimely();
    setTheme();
});