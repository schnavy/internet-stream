let imgArray = [];
let newsImgs = [];
let ugImgs = [];
let anzahl = 2000;
let mouseX = 0;
let mouseY = 0;
let imgsource;
let sourceObjs;
let audio = new Audio("../audio/click.mp3");

imgdata.splice(0, imgdata.length - anzahl);
txtdata.splice(0, txtdata.length - anzahl);

// let pdatda = [];
// let h3data = [];
// txtdata.forEach((e) => {
//   if (e.type == "p") {
//     pdatda.push(e.text);
//   } else if (e.type == "h3") {
//     h3data.push(e.text);
//   }
// });

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



const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
let otherImg = document.querySelector("#other-img");
let currText = document.querySelector("#pMain");
let clickInfo = document.querySelector("#clickInfo");
let title = document.querySelector(".innerTitle");
let titleh2 = document.querySelector(".innerTitle h2 span");
let wrapper = document.querySelector(".wrapper");
let titlechanger;
let speed;
let speedLog = document.querySelector("#speed-log");
let imgR;
let textR;
let scale;
let scrollCounter = 0;
let streamIsActive = false;
let streamIsPaused = false;
let imgswitcher = false

// let colors = ["black", "#e2e2e2", "#c30000", "#1a29b6", "#e1f36b", "#c41bc2"];

if (isDownloader) {
  toggleStream();
  setInterval(() => {
    changeImg();
    changeText();
  }, 500);
  wrapper.classList.add("downloadMode")
} else {
  stream();
}

titleh2.addEventListener("mouseenter", (e) => {
  titlechanger = setInterval((e) => {
    let tempR = Math.floor(Math.random() * 7);
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
  console.log(e);
});

document.addEventListener(
  "keydown",
  (e) => {
    if (e.code === "Space") {
      streamIsPaused = !streamIsPaused;
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
});

if (isMobileDevice() == false) {
  window.addEventListener("click", (e) => {
    toggleStream();
    streamIsPaused = false;
  });
} else {
  window.addEventListener("touchend", (e) => {
    toggleStream();
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

  imgR = Math.floor(Math.random() * imgsource.length);

  scale = Math.max(
    map(mouseY, 0, document.documentElement.clientHeight - 300, 9, 1),
    1
  );

  if (imgswitcher) {
    otherImg.style.display = "none"
    currImg.style.display = "block"
    otherImg.src = imgsource[imgR];
    currImg.style.transform = "scale(" + scale + ")";
  } else {
    otherImg.style.display = "block"
    currImg.style.display = "none"
    currImg.src = imgsource[imgR];
    otherImg.style.transform = "scale(" + scale + ")";

  }
  imgswitcher = !imgswitcher
}

function changeText() {
  textR = Math.floor(Math.random() * txtdata.length);
  currText.textContent = txtdata[textR].text;
  if (txtdata[textR].type == "p" || txtdata[textR].text.length > 300) {
    let tempR = Math.floor(Math.random() * 6);
    currText.className = "mainText";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = Math.floor(Math.random() * 8);
    currText.className = "mainText";
    currText.classList.add("hStyle" + tempR);
  }
}


function toggleStream() {
  if (streamIsActive) {
    clearInterval(logStream);
    currImg.classList.remove("fullscreen");
    body.classList.remove("crosshair");
    title.style.display = "block";
    clickInfo.style.display = "block";
    wrapper.style.display = "none";
  } else {
    currImg.classList.add("fullscreen");
    body.classList.add("crosshair");

    wrapper.style.display = "flex";

    logStream = setInterval(logParameters, 10);
    clickInfo.style.display = "none";
    title.style.display = "none";
  }
  streamIsActive = !streamIsActive;
}


function stream() {
  speed = map(mouseY, 200, document.documentElement.clientHeight, 200, 1800);
  if (streamIsActive && !streamIsPaused) {
    changeImg();
    changeText();

    audio.volume = 0.05;

    audio.play();
  }
  setTimeout(stream, speed);
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