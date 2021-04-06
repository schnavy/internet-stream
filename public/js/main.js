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
var regexExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
audio.volume = 0.4;

let titlewords = ["Die", "Flut", "an", "Reizen", "/", "Der", "Reiz", "von", "Fluten", "/"]
let titlechanger;
let tcounter = 0;
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
let mouseX = 0;
let mouseY = 0;
let imgsource;
let source;
let data = {
  news: {
    images: [],
    texte: []
  },
  userGenerated: {
    images: [],
    texte: []
  },
  wiki: {
    images: [],
    texte: []
  }

}
let PLimgs = {
  "news": [],
  "userGenerated": [],
  "wiki": []
}



// txtdata = txtdata.filter((x) => x.category == "News");
data.news.images = imgdata.filter((x) => x.category == "News");
data.userGenerated.images = imgdata.filter((x) => x.category == "user generated");
data.wiki.images = imgdata.filter((x) => x.category == "Wiki");

data.news.texte = txtdata.filter((x) => x.category == "News");
data.userGenerated.texte = txtdata.filter((x) => x.category == "user generated");
data.wiki.texte = txtdata.filter((x) => x.category == "Wiki");


// console.log(txtdata.filter((x) => x.category == "News"));
console.log(isDownloader);

console.log(imgdata);
console.log(txtdata);
console.log(data);

//Preloader
for (const cat in data) {
  let elem = data[cat]
  for (i = 0; i < elem.images.length; i++) {
    PLimgs[cat][i] = new Image();
    PLimgs[cat][i].src = elem.images[i].url;
  }
}
window.onload = console.log("Preloader fertig!");

// let colors = ["black", "#e2e2e2", "#c30000", "#1a29b6", "#e1f36b", "#c41bc2"];

if (isDownloader) {
  toggleStream();
  setInterval(() => {
    let imgsource = getCategory()
    let textsource = getCategory()
    changeImg(imgsource.images);
    changeText(textsource.texte);
  }, 300);
  wrapper.classList.add("downloadMode");
} else {
  changeImg();
  changeImg();
  changeText();
  streamDesktop();
}

titlechanger = setInterval((e) => {

  if (streamIsActive) return
  if (tcounter < titlewords.length - 1) {
    tcounter++
    titleh2.textContent = titlewords[tcounter - 1] + " " + titlewords[tcounter];
  } else {
    tcounter = 0
    titleh2.textContent = titlewords[titlewords.length - 1] + " " + titlewords[tcounter];
  }

}, 600);


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

function changeImg(input = data.news.images) {

  imgR = getRandomOf(input.length);
  scale = getScaleFromMouse();

  if (imgswitcher) {
    otherImg.style.display = "none";
    currImg.style.display = "block";
    otherImg.src = input[imgR].url;
    currImg.style.transform = "scale(" + scale + ")";
  } else {
    otherImg.style.display = "block";
    currImg.style.display = "none";
    currImg.src = input[imgR].url;
    otherImg.style.transform = "scale(" + scale + ")";
  }
  imgswitcher = !imgswitcher;
}

function changeText(input = data.news.texte) {
  textR = getRandomOf(input.length);
  currText.textContent = input[textR].text;
  if (regexExp.test(input[textR].text)) {
    currText.className = "mainText";
    currText.classList.add("emojistyle");
  } else if (txtdata[textR].type == "p" || input[textR].text.length > 200) {
    let tempR = getRandomOf(6);
    currText.className = "mainText";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = getRandomOf(10);
    currText.className = "mainText";
    currText.classList.add("hStyle" + tempR);
  }
}

function toggleStream() {
  if (streamIsActive) {
    // clearInterval(logStream);
    body.classList.remove("crosshair");
    title.style.display = "block";
    wrapper.style.display = "none";
  } else {
    body.classList.add("crosshair");
    wrapper.style.display = "flex";
    // logStream = setInterval(logParameters, 10);
    title.style.display = "none";
  }
  streamIsActive = !streamIsActive;
}

function streamDesktop() {
  if (streamIsActive && !streamIsPaused) {
    source = getCategory()
    speed = getSpeedFromMouseY();
    changeImg(source.images);
    changeText(source.texte);
    logParameters()
    audio.play();
  }
  setTimeout(streamDesktop, speed);
}

function logParameters() {
  if (typeof source != "undefined") {
    speedLog.innerHTML =
      "Speed: " +
      Math.floor(speed) +
      " ms </br> Image Origin: " +
      source.images[imgR].origin +
      "(" + source.images[imgR].category + ")</br> Text Origin: " +
      source.texte[textR].origin +
      "(" + source.texte[textR].category + ")</br> Skalierung: " +
      scale
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


function getCategory() {
  if (mouseY < document.documentElement.clientHeight / 2) {
    let r = Math.floor(Math.random() * 3)
    let value = Object.keys(data)[r]
    return data[value];
  }
  if (mouseX < document.documentElement.clientWidth / 3) {
    return data.news;
  } else if (mouseX < document.documentElement.clientWidth / 3 * 2) {
    return data.wiki;
  } else {
    return data.userGenerated;
  }
}