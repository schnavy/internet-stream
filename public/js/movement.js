const body = document.querySelector("body");
const wrapper = document.querySelector(".wrapper");

let mouseX = 400;
let mouseY = 400;
let prevMouseX = mouseX;
let prevMouseY = mouseY;
let radius = 0;
const circle = document.createElement("div")
const circle2 = document.createElement("div")
circle.id = "circle"
circle2.id = "circle2"
wrapper.appendChild(circle)
wrapper.appendChild(circle2)

if (kinect) {

    let kinectron = new Kinectron("172.20.10.4");
    kinectron.setKinectType("windows");
    kinectron.makeConnection();

    kinectron.startTrackedBodies(action);




    function action(body) {
        console.log(body.joints[0].cameraZ);
        let depth = body.joints[0].cameraZ;
        let X = body.joints[0].cameraX
        mouseY = Math.floor(map(depth, 0, 5, 0, window.innerHeight))
        mouseX = Math.floor(map(X, -1, 1, 0, window.innerWidth))

        console.log(mouseY, mouseX);
    }

}

window.addEventListener("mousemove", (e) => {
    if (!kinect) {
        if (Math.abs(prevMouseX - mouseX) > 10 || Math.abs(prevMouseY - mouseY) > 10) {
            prevMouseY = mouseY
            prevMouseX = mouseX
        }

        mouseX = e.x;
        mouseY = e.y;
    }
    let cY = Math.floor(
        map(mouseY, 100, document.documentElement.clientHeight, 120, 80)
    );
    let cX = Math.floor(
        map(mouseX, 0, document.documentElement.clientWidth, -3, 3)
    );
    let r = cY - cX;
    let g = cY;
    let b = cY + cX;
    body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    changeCircles()


});


