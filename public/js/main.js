const body = document.querySelector("body");
const currImg = document.querySelector("#curr-img");
const otherImg = document.querySelector("#other-img");
const currText = document.querySelector("#pMain");
const clickInfo = document.querySelector("#clickInfo");
const title = document.querySelector(".innerTitle");
const titleh2 = document.querySelector(".innerTitle h2 span");
const wrapper = document.querySelector(".wrapper");
const speedLog = document.querySelector("#speed-log");
const circles = document.querySelectorAll(".circle")
const audio = new Audio("../audio/click.mp3");
var regexExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
audio.volume = 0.1;

let speed, imgR, textR, scale, titlechanger, imgsource, source;
let pStyleAnzahl = 1;
let hStyleAnzahl = 4;
let titlewords = ["Die", "Flut", "der", "Reize", "/", "Der", "Reiz", "der", "Fluten", "/"]
let tcounter = 0;
let streamIsActive = false;
let streamIsPaused = false;
let imgswitcher = false;
let imgArray = [];
let newsImgs = [];
let ugImgs = [];
let mouseX = 0;
let mouseY = 0;
let moveCounter = 0
// let colors = ["black", "#e2e2e2", "#c30000", "#1a29b6", "#e1f36b", "#c41bc2"];
let colors = ["#0000ff", "#FF0000", "#FFFF00", "#cccccc", "#ffffff"]
let swcolors = ["black", "white", "grey", "lightgray", "#ddd", "#0000ff", "#FF0000", "#FFFF00", "#cccccc", "#ffffff"]


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
  changeCircles()

  // if (moveCounter % 20 == 0) {
  //   source = getCategory()
  //   changeImg(source.images);
  //   changeText(source.texte);
  //   logParameters()
  //   audio.play();

  //   console.log(moveCounter);
  // }
  // moveCounter++
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
    currImg.style.filter = "blur(" + Math.floor((12 - scale) / 2) + "px)"
  } else {
    otherImg.style.display = "block";
    currImg.style.display = "none";
    currImg.src = input[imgR].url;
    otherImg.style.transform = "scale(" + scale + ")";
    otherImg.style.filter = "blur(" + Math.floor((12 - scale) / 2) + "px)"
  }
  imgswitcher = !imgswitcher;
}

function changeText(input = data.news.texte) {

  textR = getRandomOf(input.length);
  currText.removeAttribute("style");
  currText.innerHTML = "<span>" + input[textR].text + "</span>";
  // if (regexExp.test(input[textR].text)) {
  //   currText.className = "mainText";
  //   currText.classList.add("emojistyle");
  // } else
  if (input[textR].text.length > 100) {
    let tempR = getRandomOf(pStyleAnzahl);
    currText.className = "mainText";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = getRandomOf(hStyleAnzahl);
    currText.className = "mainText";
    currText.classList.add("hStyle" + tempR);
  }
  let c = colors[getRandomOf(colors.length)]

  currText.querySelector("span").style.textShadow = '0px 0px ' + (getRandomOf(20) - 3) + 'px' + c;
  let r = getRandomOf(12)
  if (r == 1) {
    currText.querySelector("span").classList.add("balken")
  } else if (r < 6) {
    currText.style.color = "rgba(0,0,0,0)"
  } else {
    currText.style.color = c
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

    changeFormlinien()

    audio.play();


  }
  setTimeout(streamDesktop, speed);
}

function changeCircles() {
  let r = wrapper.clientHeight - 4

  for (let i = 0; i < circles.length; i++) {
    const elem = circles[i];
    elem.style.height = r + "px"
    let w = r / (i + 1);
    elem.style.width = w + "px"
    elem.style.left = map(mouseX, 0, document.documentElement.clientWidth, 0, wrapper.clientWidth - w) + "px"

    // elem.style.left = Math.floor(getRandomOf(document.documentElement.clientWidth-w )) + "px";
    elem.style.top = "0px"

  }

}

let linienFormen = document.querySelectorAll(".svg-container")
let linienQuote;

function changeFormlinien() {

  let h = wrapper.clientHeight;
  let w = wrapper.clientWidth;
  for (let i = 0; i < linienFormen.length; i++) {
    linienQuote = map(mouseY, 0, h, 1, 8)
    r = Math.floor(getRandomOf(linienQuote))
    const elem = linienFormen[i];
    if (r == 1) {
      elem.style.display = "block"
      elem.style.top = Math.floor(getRandomOf(h)) + "px"
      elem.style.left = Math.floor(getRandomOf(w)) + "px"
      elem.style.width = (getRandomOf(800) + 200) + "px"
      elem.style.transform = "rotate(" + Math.floor(getRandomOf(360)) + "deg) scaleX(" + Math.floor(getRandomOf(10)) + ")"
      elem.style.filter = "blur(" + Math.floor(getRandomOf(7)) + "px)"
      elem.firstElementChild.firstElementChild.style.stroke = swcolors[getRandomOf(swcolors.length)]
    } else if (r > 2) {
      elem.style.display = "none"
    }
  }

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
      scale + ")</br> Rays: " +
      linienQuote
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
    map(mouseY, 200, document.documentElement.clientHeight - 200, 10, 1),
    1
  );
}

function getSpeedFromMouseY() {
  return map(mouseY, 200, document.documentElement.clientHeight, 200, 2200);
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