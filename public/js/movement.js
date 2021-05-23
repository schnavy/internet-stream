const body = document.querySelector("body");
const wrapper = document.querySelector(".wrapper");
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;
let mouseX = 400;
let mouseY = 400;
let prevMouseX = mouseX;
let prevMouseY = mouseY;
let radius = 0;
const circle = document.createElement("div")
const circle2 = document.createElement("div")
circle.classList.add('blurrycircle')
circle2.classList.add('blurrycircle')
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



        console.log("depth: " + body.joints[0].cameraZ);
        console.log("X: " + body.joints[0].cameraX);

        let depth = body.joints[0].cameraZ;
        let X = body.joints[0].cameraX

        mouseY = Math.floor(map(depth, 1, 5, 0, window.innerHeight))
        mouseX = Math.floor(map(X, -3, 3, 0, window.innerWidth))
        const testpunkt = document.querySelector(".testpunkt")
        testpunkt.style.top = (mouseY - 50) + "px"
        testpunkt.style.left = (mouseX - 50) + "px"

    }

}



window.addEventListener("mousemove", (e) => {

    if (Math.abs(prevMouseX - mouseX) > 10 || Math.abs(prevMouseY - mouseY) > 10) {
        prevMouseY = mouseY
        prevMouseX = mouseX
    }

    mouseX = e.x;
    mouseY = e.y;

    let cY = Math.floor(
        map(mouseY, 100, width, 120, 80)
    );
    let cX = Math.floor(
        map(mouseX, 0, height, -3, 3)
    );
    let r = cY - cX;
    let g = cY;
    let b = cY + cX;
    body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    changeCircles()

    changeSound()

});


function changeSound() {
    if (!streamIsActive || streamIsPaused) return

    sound.basis[0].volume = mapPostoVol(width / 2, height / 2, true)
    sound.basis[1].volume = mapPostoVol(width / 6, height / 2, true) * 1.2
    sound.basis[2].volume = mapPostoVol(width / 6 * 5, height / 2, true)

    sound.extra[0].volume = mapPostoVol([width / 2, height / 6 * 5], height / 4)
    sound.extra[1].volume = mapPostoVol([width / 3 / 2, height / 3], height / 4) * 1.4
    sound.extra[2].volume = mapPostoVol([width / 3, height / 6], height / 2) * 1.2

}

function getDistance1d(x1, x2) {
    return Math.floor(Math.abs(x1 - x2))
}

function getDistance2d(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.floor(Math.abs(Math.sqrt(a * a + b * b)))
}


// setInterval(() => {
//     console.log({

//         0: sound.basis[0].volume,
//         1: sound.basis[1].volume,
//         2: sound.basis[2].volume,
//     });
// }, 400)

// setInterval(() => {
//     console.log(mouseX, mouseY);
// }, 400)


// zentrum entweder nur number dann nur X achse oder Array mit 2 numbers
// Invert ist boolean, wenn true inverts volume
function mapPostoVol(zentrum, radius, invert = false) {
    let dist;
    let vol;
    if (typeof (zentrum) == "number") {
        dist = getDistance1d(mouseX, zentrum)
    } else {
        dist = getDistance2d(mouseX, mouseY, zentrum[0], zentrum[1])
    }
    if (dist > radius) dist = radius
    if (invert) {
        vol = map(dist, 0, radius, 0, 1)
    } else {
        vol = map(dist, 0, radius, 1, 0)
    }
    return Math.round(vol * 1000) / 1000
}