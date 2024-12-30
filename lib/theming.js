const themes = [{
    name: "Pastel",
    emoji: "🎨",
    colors: {
        "primary-color": "#f28b82",
        "secondary-color": "#fbbc05",
        "accent-color": "#333333",
        "light-color": "#eeeeee",
        "dark-color": "#555555"
    }
}, {
    name: "Light",
    emoji: "☀️",
    colors: {
        "primary-color": "#B5B8B9",
        "secondary-color": "#d1d1d1",
        "accent-color": "#ff8c42",
        "light-color": "#fafafa",
        "dark-color": "#404040"
    }
}, {
    name: "Dark",
    emoji: "🌙",
    colors: {
        "primary-color": "#212121",
        "secondary-color": "#424242",
        "accent-color": "#64ffda",
        "light-color": "#555555",
        "dark-color": "#e0e0e0"
    }
}];

const button = document.getElementById("theme-toggle");
const defaultTheme = "Light";

export default function setTheme() {
    const root = document.querySelector(":root");

    const theme = localStorage.getItem("theme") || defaultTheme;
    const themeObject = themes.find(t => t.name === theme) || themes[0];

    if (themeObject === undefined) {
        console.error(`Theme "${theme}" not found`);
        return;
    }

    for (const [key, value] of Object.entries(themeObject.colors)) {
        root.style.setProperty(`--${key}`, value);
    }

    button.textContent = themeObject.emoji;
}

function changeThemeID() {
    const theme = localStorage.getItem("theme") || defaultTheme;
    const themeIndex = themes.findIndex(t => t.name === theme);

    const nextTheme = themes[(themeIndex + 1) % themes.length];
    localStorage.setItem("theme", nextTheme.name);

    setTheme();
}

button.addEventListener("click", changeThemeID);