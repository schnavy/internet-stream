const body = document.querySelector("body");
const wrapper = document.querySelector(".wrapper");
const container = document.querySelector(".container");
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight;
let mouseX = 400;
let mouseY = 400;
let prevMouseX = mouseX;
let prevMouseY = mouseY;
let userActive = false
let test = false

if (kinect) {

    let testpunkte = []
    let personen = []
    let blurrycircles = []


    for (let i = 0; i < 6; i++) {
        if (test) {

            testpunkte[i] = document.createElement("div")
            testpunkte[i].classList.add("testpunkt")
            container.appendChild(testpunkte[i])
        }
        blurrycircles[i] = new BlurCirc();

    }
    let kinectron = new Kinectron("172.20.10.4");
    kinectron.setKinectType("windows");
    kinectron.makeConnection();

    kinectron.startBodies(action);


    function action(body) {
        console.log(body);
        personenCounter = 0
        body.bodies.forEach(person => {
            if (person.tracked) {
                personenCounter++
                // console.log({"person" : person.bodyIndex, "depth": person.joints[0].cameraZ, "X:": person.joints[0].cameraX});

                let depth = person.joints[0].cameraZ;
                let X = person.joints[0].cameraX;

                mouseY = Math.floor(map(depth, 1, 5, 0, window.innerHeight))
                mouseX = Math.floor(map(X, -3, 3, 0, window.innerWidth))
                if (Math.abs(prevMouseX - mouseX) > 10 || Math.abs(prevMouseY - mouseY) > 10) {
                    prevMouseY = mouseY
                    prevMouseX = mouseX
                }
                if (test) {

                    testpunkte[person.bodyIndex].style.display = "block"
                    testpunkte[person.bodyIndex].style.top = (mouseY - 50) + "px"
                    testpunkte[person.bodyIndex].style.left = (mouseX - 50) + "px"
                }
                blurrycircles[person.bodyIndex].show()
                blurrycircles[person.bodyIndex].change()
                blurrycircles[person.bodyIndex].move()

            } else {
                if (test) {
                    testpunkte[person.bodyIndex].style.display = "none";
                }
                blurrycircles[person.bodyIndex].hide()
            }


        })
    };

}


window.addEventListener("mousemove", (e) => {

    if (Math.abs(prevMouseX - mouseX) > 10 || Math.abs(prevMouseY - mouseY) > 10) {
        prevMouseY = mouseY
        prevMouseX = mouseX
    }

    mouseX = e.x;
    mouseY = e.y;
});


function changeSound() {
    if (!streamIsActive || streamIsPaused) return

    sound.basis[0].volume = mapPostoVol(width / 2, height / 2, true, 0.6)
    sound.basis[1].volume = mapPostoVol(width / 6, height / 2, true, 0.6)
    sound.basis[2].volume = mapPostoVol(width / 6 * 5, height / 2, true, 0.5)

    sound.extra[0].volume = mapPostoVol([width / 3, height / 6 * 5], height / 4, false, 1)
    sound.extra[1].volume = mapPostoVol([width / 3 * 2, height / 3], height / 4, false, 0.9)
    sound.extra[2].volume = mapPostoVol([width / 2, height / 6], height / 2, false, 0.7)
    sound.basis.forEach(elem => {
        elem.volume *= map(mouseY, 0, height, 0.2, 1)
    })
}


function map(value, x1, y1, x2, y2) {
    return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
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

function mapPostoVol(zentrum, radius, invert = false, max) {
    let dist;
    let vol;
    if (typeof (zentrum) == "number") {
        dist = getDistance1d(mouseX, zentrum)
    } else {
        dist = getDistance2d(mouseX, mouseY, zentrum[0], zentrum[1])
    }
    if (dist > radius) dist = radius
    if (invert) {
        vol = map(dist, 0, radius, 0, max)
    } else {
        vol = map(dist, 0, radius, max, 0)
    }
    return Math.round(vol * 1000) / 1000
}