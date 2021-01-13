//Preloader
const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
let imgArray = [];
let anzahl = 200;
let mouseX = 0;
let mouseY = 0;
let pdatda = [];
let h3datda = [];

txtdata.forEach((e) => {
  if (e.type == "p") {
    pdatda.push(e.text);
  } else if (e.type == "h3") {
    h3datda.push(e.text);
  }
});

// txtdata = txtdata.map((x) => x.text);
imgdata = imgdata.map((x) => x.url);

console.log(imgdata);
console.log(txtdata);

for (i = 0; i < imgdata.length; i++) {
  imgArray[i] = new Image();
  imgArray[i] = imgdata[i];
}

const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
let currText = document.querySelector("#pMain");
let clickInfo = document.querySelector("#clickInfo");
let title = document.querySelector(".innerTitle");
let wrapper = document.querySelector(".wrapper");
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let stream = null;
let num = imgArray.length - 1;

function changeImg() {
  let r = Math.floor(Math.random() * imgArray.length);
  currImg.src = imgArray[r];
  console.log(r);
  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
  }
  if (num > 1) {
    num--;
  }
  currImg.style.transform = "scale(" + map(mouseY, 0, document.documentElement.clientHeight, 10, 1) + ")";
}

function changeText() {
  let r = Math.floor(Math.random() * txtdata.length);
  currText.textContent = txtdata[r].text;
  if (txtdata[r].type == "p" || txtdata[r].text.length > 60) {
    let r = Math.floor(Math.random()*2)
      currText.className = "";
      currText.classList.add("pStyle" + r);
  } else {
    let r = Math.floor(Math.random()*4)
      currText.className = "";
      currText.classList.add("hStyle" + r);
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
    // clearInterval(stream);
    // clearInterval(streamT);
    currImg.classList.remove("fullscreen");
    title.style.display = "block";
    clickInfo.style.display = "block";
    wrapper.style.display = "none";
  } else {
    currImg.classList.add("fullscreen");
    wrapper.style.display = "flex";
    
    // stream = setInterval(changeImg, 600);
    // streamT = setInterval(changeText, 100);
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
  setTimeout(
    imageStream,
    map(mouseY, 0, document.documentElement.clientHeight, 200, 2000)
  );
}
function textStream() {
  if (streamIsActive) {
    changeText();
  }
  setTimeout(
    textStream,
    map(mouseY, 0, document.documentElement.clientHeight , 100, 1000)
  );
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

function getMouseX(params) {}

window.addEventListener("mousemove", (e) => {
  mouseX = e.x;
  mouseY = e.y;
  if (streamIsActive) {
    // currImg.style.transform = "scale(" + map(mouseY, 0, document.documentElement.clientHeight, 1, 5) + ")";
  }
});
