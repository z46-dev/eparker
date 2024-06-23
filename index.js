import Background from "./lib/Background.js";
new Background().begin();

const tooltip = document.createElement("span");
tooltip.classList.add("tooltip");
document.body.appendChild(tooltip);

let spin = true,
    spinRads = 0;

const allIcons = document.querySelectorAll(".icon");
for (let i = 0; i < allIcons.length; i++) {
    const icon = allIcons.item(i);

    console.log(icon.dataset);
    if (icon.dataset.skilldescription) {
        icon.addEventListener("click", () => changeSkill(icon.id));
        icon.addEventListener("touchstart", () => changeSkill(icon.id));
    }

    const img = new Image();
    img.src = "./icons/" + icon.id + ".svg";
    icon.appendChild(img);

    icon.addEventListener("mouseenter", () => {
        tooltip.textContent = icon.dataset.hover;
        tooltip.classList.add("active");

        spin = false;
    });

    icon.addEventListener("mouseleave", () => {
        tooltip.classList.remove("active");

        spin = true;
    });

    icon.addEventListener("touchstart", () => {
        icon.click();
    });
}

document.body.addEventListener("touchstart", () => {
    const event = new MouseEvent("mouseleave", {
        bubbles: true,
        cancelable: true
    });

    for (let i = 0; i < allIcons.length; i++) {
        allIcons.item(i).dispatchEvent(event);
    }
});

const distance = 27;
let icons = [];
function updateIcons() {
    requestAnimationFrame(updateIcons);

    if (!spin) {
        return;
    }

    for (let i = 0; i < icons.length; i++) {
        const angle = i / icons.length * Math.PI * 2 + spinRads;
        const icon = icons.item(i);
        icon.style.top = `calc(50% + ${Math.sin(angle) * distance}vmin)`;
        icon.style.left = `calc(50% + ${Math.cos(angle) * distance}vmin)`;
    }

    spinRads += .001;
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

function changeSkill(id) {
    const menu = document.getElementById("skillsMenu");
    const icon = document.querySelector(".icon#" + id);

    menu.querySelector("img").src = "./icons/" + id + ".svg";
    menu.querySelector("span").textContent = icon.dataset.hover;
    menu.querySelector("p").textContent = icon.dataset.skilldescription;

    changeMenu("skillsMenu");
}