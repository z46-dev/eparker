import Background from "./lib/Background.js";
new Background().begin();

const tooltip = document.createElement("span");
tooltip.classList.add("tooltip");
document.body.appendChild(tooltip);

const allIcons = document.querySelectorAll(".icon");
for (let i = 0; i < allIcons.length; i++) {
    const icon = allIcons.item(i);

    const img = new Image();
    img.src = "./icons/" + icon.id + ".svg";
    icon.appendChild(img);

    icon.addEventListener("mouseenter", () => {
        tooltip.textContent = icon.dataset.hover;
        tooltip.classList.add("active");
    });

    icon.addEventListener("mouseleave", () => {
        tooltip.classList.remove("active");
    });
}

const distance = 25;
let icons = [];
function updateIcons() {
    requestAnimationFrame(updateIcons);
    for (let i = 0; i < icons.length; i++) {
        const angle = i / icons.length * Math.PI * 2 + performance.now() / 7500;
        const icon = icons.item(i);
        icon.style.top = `calc(50% + ${Math.sin(angle) * distance}vmin)`;
        icon.style.left = `calc(50% + ${Math.cos(angle) * distance}vmin)`;
    }
}

updateIcons();

function changeMenu(id) {
    document.querySelectorAll(".container").forEach(container => {
        container.classList[container.id === id ? "add" : "remove"]("active");

        if (container.id === id) {
            icons = container.querySelectorAll(".icon");
        }
    });
}

window.changeMenu = changeMenu;
changeMenu("mainMenu");