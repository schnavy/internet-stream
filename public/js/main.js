//Preloader
const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
let imgArray = [];
let anzahl = 1000;
let mouseX = 0;
let mouseY = 0;
let pdatda = [];
let h3datda = [];

imgdata.splice(0, imgdata.length - anzahl);
txtdata.splice(0, txtdata.length - anzahl);

txtdata.forEach((e) => {
  if (e.type == "p") {
    pdatda.push(e.text);
  } else if (e.type == "h3") {
    h3datda.push(e.text);
  }
});

// txtdata = txtdata.map((x) => x.text);
// imgdata = imgdata.map((x) => x.url);

console.log(imgdata);
console.log(txtdata);

for (i = 0; i < imgdata.length; i++) {
  imgArray[i] = new Image();
  imgArray[i] = imgdata[i].url;
}

const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
let currText = document.querySelector("#pMain");
let clickInfo = document.querySelector("#clickInfo");
let title = document.querySelector(".innerTitle");
let wrapper = document.querySelector(".wrapper");
let speed;
let speedLog = document.querySelector("#speed-log");
let imgR;
let textR;
let scale;
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let stream = null;
let num = imgArray.length - 1;

function changeImg() {
  imgR = Math.floor(Math.random() * imgArray.length);
  currImg.src = imgArray[imgR];
  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
  }
  if (num > 1) {
    num--;
  }
  scale = Math.max(
    map(mouseY, 0, document.documentElement.clientHeight - 500, 5, 1),
    1
  );
  currImg.style.transform = "scale(" + scale + ")";
}

function changeText() {
  textR = Math.floor(Math.random() * txtdata.length);
  currText.textContent = txtdata[textR].text;
  if (txtdata[textR].type == "p" || txtdata[textR].text.length > 100) {
    let tempR = Math.floor(Math.random() * 3);
    currText.className = "";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = Math.floor(Math.random() * 4);
    currText.className = "";
    currText.classList.add("hStyle" + tempR);
  }

  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
  }
  if (num > 1) {
    num--;
  }
}

function changeBoth() {
  changeImg();
  changeImg();
}
changeImg();
changeText();

function toggleStream(e) {
  // currImg.style.display = "block";
  if (streamIsActive) {
    clearInterval(logStream);
    currImg.classList.remove("fullscreen");
    title.style.display = "block";
    clickInfo.style.display = "block";
    // wrapper.style.display = "none";
  } else {
    currImg.classList.add("fullscreen");
    wrapper.style.display = "flex";

    logStream = setInterval(logParameters, 10);
    clickInfo.style.display = "none";
    title.style.display = "none";
  }
  streamIsActive = !streamIsActive;
}
imageStream();
textStream();

function imageStream() {
  if (streamIsActive) {
    changeImg();
  }
  setTimeout(imageStream, speed);
}
function textStream() {
  speed = map(mouseY, 100, document.documentElement.clientHeight, 200, 3000);

  if (streamIsActive) {
    changeText();
  }
  setTimeout(textStream, speed);
}

window.addEventListener("click", (e) => {
  toggleStream(e);
});
window.addEventListener("touchend", (e) => {
  toggleStream(e);
});

window.addEventListener("wheel", (e) => {
  // currImg.style.display = "block";
  if (scrollCounter % 2 == 0) {
    changeImg();
    changeText();
  }
  scrollCounter++;
});

window.addEventListener("mousemove", (e) => {
  mouseX = e.x;
  mouseY = e.y;
  let c = map(mouseY, 100, document.documentElement.clientHeight, 80, 170);

  body.style.backgroundColor = "rgb(" +c + "," + c+ ","+c+")" 
});

function logParameters() {
  speedLog.innerHTML =
    "Speed: " +
    Math.floor(speed) +
    " ms </br> Image Origin: " +
    imgdata[imgR].origin +
    "</br> Text Origin: " +
    txtdata[textR].origin +
    "</br> Skalierung: " +
    scale +
    "x";
}
