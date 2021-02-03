let imgArray = [];
let anzahl = 1000;
let mouseX = 0;
let mouseY = 0;

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

// txtdata = txtdata.map((x) => x.text);
// imgdata = imgdata.map((x) => x.url);

console.log(imgdata);
console.log(txtdata);

//Preloader
for (i = 0; i < imgdata.length; i++) {
  imgArray[i] = new Image();
  imgArray[i] = imgdata[i].url;
}

const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
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
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let streamIsPaused = false;
let num = imgArray.length - 1;
let colors = ["black", "white", "red", "blue", "yellow", "magenta"];

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
    map(mouseY, 0, document.documentElement.clientHeight - 300, 7, 1),
    1
  );
  currImg.style.transform = "scale(" + scale + ")";
  let rc = Math.floor(Math.random() * colors.length);
  wrapper.style.backgroundColor = colors[rc];
}

function changeText() {
  textR = Math.floor(Math.random() * txtdata.length);
  currText.textContent = txtdata[textR].text;
  if (txtdata[textR].type == "p" || txtdata[textR].text.length > 300) {
    let tempR = Math.floor(Math.random() * 5);
    currText.className = "";
    currText.classList.add("pStyle" + tempR);
  } else {
    let tempR = Math.floor(Math.random() * 7);
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
  changeText();
  let audio = new Audio("../audio/click.mp3");
  audio.volume = 0.05;

  audio.play();
}
// changeBoth();

function toggleStream(e) {
  // currImg.style.display = "block";
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

document.addEventListener(
  "keydown",
  (e) => {
    if (e.code === "Space") {
      streamIsPaused = !streamIsPaused;
    }
  },
  false
);

//SEPERATE STREAMS
// function imageStream() {
//   if (streamIsActive && !streamIsPaused) {
//     changeImg();
//   }
//   setTimeout(imageStream, speed);
// }
// function textStream() {
//   speed = map(mouseY, 100, document.documentElement.clientHeight, 200, 2000);

//   if (streamIsActive && !streamIsPaused) {
//     changeText();
//   }
//   setTimeout(textStream, speed);
// }
// imageStream();
// textStream();

stream();

function stream() {
  speed = map(mouseY, 200, document.documentElement.clientHeight, 200, 1800);

  if (streamIsActive && !streamIsPaused) {
    changeBoth();
  }
  setTimeout(stream, speed);
}

if (isMobileDevice() == false) {
  window.addEventListener("click", (e) => {
    toggleStream(e);
    streamIsPaused = false;
  });
} else {
  window.addEventListener("touchend", (e) => {
    toggleStream(e);
  });
}

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
