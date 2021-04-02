const body = document.querySelector("body");
const currImg = document.querySelector("#curr-img");
const otherImg = document.querySelector("#other-img");
const currText = document.querySelector("#pMain");
const clickInfo = document.querySelector("#clickInfo");
const title = document.querySelector(".innerTitle");
const titleh2 = document.querySelector(".innerTitle h2 span");
const wrapper = document.querySelector(".wrapper");
const speedLog = document.querySelector("#speed-log");
const audio = new Audio("../audio/click.mp3");
audio.volume = 0.4;

let speed;
let imgR;
let textR;
let scale;
let streamIsActive = false;
let streamIsPaused = false;
let imgswitcher = false;
let imgArray = [];
let newsImgs = [];
let ugImgs = [];
let anzahl = 2000;
let mouseX = 0;
let mouseY = 0;
let imgsource;
let sourceObjs;

imgdata.splice(0, imgdata.length - anzahl);
txtdata.splice(0, txtdata.length - anzahl);

// txtdata = txtdata.filter((x) => x.category == "News");
newsImgData = imgdata.filter((x) => x.category == "News");
ugImgData = imgdata.filter((x) => x.category == "user generated");

console.log(isDownloader);

console.log(imgdata);
console.log(txtdata);

//Preloader
for (i = 0; i < newsImgData.length; i++) {
  // imgArray[i] = new Image();
  // imgArray[i] = imgdata[i].url;
  newsImgs[i] = new Image();
  newsImgs[i] = newsImgData[i].url;
}
for (i = 0; i < ugImgData.length; i++) {
  ugImgs[i] = new Image();
  ugImgs[i] = ugImgData[i].url;
}

console.log("Preloader fertig!");

// let colors = ["black", "#e2e2e2", "#c30000", "#1a29b6", "#e1f36b", "#c41bc2"];

if (isDownloader) {
  toggleStream();
  setInterval(() => {
    changeImg();
    changeText();
  }, 500);
  wrapper.classList.add("downloadMode");
} else {
  changeImg();
  changeImg();
  changeText();
  streamDesktop();
}

titleh2.addEventListener("mouseenter", (e) => {
  let titlechanger = setInterval((e) => {
    let tempR = getRandomOf(7);
    titleh2.className = "";
    titleh2.classList.add("hStyle" + tempR);
    titleh2.style.color = "blue";
    titleh2.style.fontSize = "1em";
    titleh2.style.transform = "scale(1)";
  }, 200);
});

titleh2.addEventListener("mouseleave", (e) => {
  clearInterval(titlechanger);
  titleh2.style.color = "blue";
  titleh2.className = "";
});

document.addEventListener(
  "keydown",
  (e) => {
    if (e.code === "Space") {
      streamIsPaused = !streamIsPaused;
    } else if (e.code === "Escape") {
      toggleStream();
    }
  },
  false
);

window.addEventListener("mousemove", (e) => {
  mouseX = e.x;
  mouseY = e.y;
  let cY = Math.floor(
    map(mouseY, 100, document.documentElement.clientHeight, 80, 170)
  );
  let cX = Math.floor(
    map(mouseX, 0, document.documentElement.clientWidth, -5, 5)
  );
  let r = cY - cX;
  let g = cY;
  let b = cY + cX;
  body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
  // clickInfo.style.left = mouseX-50 +"px"
  // clickInfo.style.top = mouseY-50 +"px"
});

if (isMobileDevice() == false) {
  window.addEventListener("click", (e) => {
    toggleStream();
    streamIsPaused = false;
  });
} else {
  window.addEventListener("touchend", (e) => {
    changeImg();
    changeText();
    toggleStream();

    audio.volume = 0.4;
    audio.play();
  });
}

function changeImg() {
  if (mouseX > document.documentElement.clientWidth / 2) {
    sourceObjs = newsImgData;
    imgsource = newsImgs;
  } else {
    sourceObjs = ugImgData;
    imgsource = ugImgs;
  }

  imgR = getRandomOf(imgsource.length);
  scale = getScaleFromMouse();

  if (imgswitcher) {
    otherImg.style.display = "none";
    currImg.style.display = "block";
    otherImg.src = imgsource[imgR];
    currImg.style.transform = "scale(" + scale + ")";
  } else {
    otherImg.style.display = "block";
    currImg.style.display = "none";
    currImg.src = imgsource[imgR];
    otherImg.style.transform = "scale(" + scale + ")";
  }
  imgswitcher = !imgswitcher;
}

function changeText() {
  textR = getRandomOf(txtdata.length);
  currText.textContent = txtdata[textR].text;
  if (txtdata[textR].type == "p" || txtdata[textR].text.length > 300) {
    let tempR = getRandomOf(6);
    currText.className = "mainText";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = getRandomOf(8);
    currText.className = "mainText";
    currText.classList.add("hStyle" + tempR);
  }
}

function toggleStream() {
  if (streamIsActive) {
    clearInterval(logStream);
    body.classList.remove("crosshair");
    title.style.display = "block";
    wrapper.style.display = "none";
  } else {
    body.classList.add("crosshair");
    wrapper.style.display = "flex";
    logStream = setInterval(logParameters, 10);
    title.style.display = "none";
  }
  streamIsActive = !streamIsActive;
}

function streamDesktop() {
  if (streamIsActive && !streamIsPaused) {
    speed = getSpeedFromMouseY();
    changeImg();
    changeText();
    audio.play();
  }
  setTimeout(streamDesktop, speed);
}

function logParameters() {
  if (typeof sourceObjs != "undefined") {
    speedLog.innerHTML =
      "Speed: " +
      Math.floor(speed) +
      " ms </br> Image Origin: " +
      sourceObjs[imgR].origin +
      "</br> Text Origin: " +
      txtdata[textR].origin +
      "</br> Skalierung: " +
      scale +
      "x</br> Kategorie: " +
      sourceObjs[imgR].category;
  }
}

function isMobileDevice() {
  if (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  ) {
    return true;
  } else {
    return false;
  }
}

function map(value, x1, y1, x2, y2) {
  return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
}

function getScaleFromMouse() {
  return Math.max(
    map(mouseY, 0, document.documentElement.clientHeight - 300, 9, 1),
    1
  );
}

function getSpeedFromMouseY() {
  return map(mouseY, 200, document.documentElement.clientHeight, 200, 1800);
}

function getRandomOf(x) {
  return Math.floor(Math.random() * x);
}
