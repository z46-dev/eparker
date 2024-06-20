export class Color {
    x = Math.random() * window.innerWidth * window.devicePixelRatio;
    y = Math.random() * window.innerHeight * window.devicePixelRatio;
    size = 64 + Math.random() * 256;
    actualSize = this.size;
    hue = 0;

    speed = Math.random() * .5 + .5;
    direction = Math.random() * Math.PI * 2;
}

export default class Background {
    constructor() {
        /** @type {Color[]} */
        this.colors = [];

        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d", {
            alpha: navigator.userAgent.includes("CrOS") || navigator.userAgent.includes("Android"),
            desynchronized: !(navigator.userAgent.includes("CrOS") || navigator.userAgent.includes("Android"))
        });
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        for (let i = 0; i < 100; i++) {
            this.addColor((i + Date.now()) % 360);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
    }

    addColor(colorCode) {
        const color = new Color();
        color.hue = colorCode;

        this.colors.push(color);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));

        this.ctx.fillStyle = "rgba(0, 0, 0, .1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.colors.length; i++) {
            const color = this.colors[i];

            color.x += Math.cos(color.direction) * color.speed;
            color.y += Math.sin(color.direction) * color.speed;
            color.actualSize = color.size + Math.sin(performance.now() / 1000 + i) * 64;
            color.hue = (Math.sin(performance.now() / 5000 + i * .1) * .5 + .5) * 360;

            if (color.x < 0 || color.x > this.canvas.width) {
                color.direction = Math.atan2(Math.sin(color.direction), Math.cos(color.direction) * -1);
            }

            if (color.y < 0 || color.y > this.canvas.height) {
                color.direction = Math.atan2(Math.sin(color.direction) * -1, Math.cos(color.direction));
            }

            this.ctx.shadowBlur = color.actualSize + Math.sin(performance.now() / 1000 + i) * 16;
            this.ctx.shadowColor = `hsl(${color.hue}, 50%, 50%)`;
            this.ctx.fillStyle = `hsl(${color.hue}, 50%, 50%)`;

            this.ctx.beginPath();
            this.ctx.arc(color.x, color.y, color.actualSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    begin() {
        this.render();
    }
}