class BlurCirc {

    constructor() {

        this.radius = 0;

        this.circle = document.createElement("div")
        this.circle2 = document.createElement("div")
        this.circle.classList.add('blurrycircle')
        this.circle2.classList.add('blurrycircle')
        this.circle.id = "circle"
        this.circle2.id = "circle2"
        this.circle.style.display = "none"
        this.circle2.style.display = "none"
        this.wrapper = document.querySelector(".wrapper")
        this.wrapper.appendChild(this.circle)
        this.wrapper.appendChild(this.circle2)

    }
    show(){
        this.circle.style.display = "block"
        this.circle2.style.display = "block"
    }
    hide(){
        this.circle.style.display = "none"
        this.circle2.style.display = "none"
    }

    move() {
        if (!streamIsActive || streamIsPaused) return
        this.circle.style.top = mouseY + "px"
        this.circle.style.left = mouseX + "px"
        this.circle2.style.top = prevMouseY + "px"
        this.circle2.style.left = prevMouseX + "px"
        if (this.radius % 10 == 0) {

            // circle.style.transform = "translate(-50%, -50%) rotate(" + (radius + 100) + "deg)";
            this.circle2.style.transform = "translate(-50%, -50%) rotate(" + (-this.radius) + "deg)";
        }
        this.radius += 5
        if (this.radius == 360) {
            this.radius = 0
        }
    }
    change() {
        if (!streamIsActive || streamIsPaused) return

        this.r = this.wrapper.clientHeight - 4

        for (let i = 0; i < circles.length; i++) {
            this.elem = circles[i];
            this.elem.style.height = this.r + "px"
            this.w = this.r / (i + 1);
            this.elem.style.width = this.w + "px"
            this.elem.style.left = map(mouseX, 0, document.documentElement.clientWidth, 0, this.wrapper.clientWidth - this.w) + "px"

            // elem.style.left = Math.floor(getRandomOf(document.documentElement.clientWidth-w )) + "px";
            this.elem.style.top = "0px"
        }
    }
}