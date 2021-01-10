//Preloader

let imgArray = [];
let anzahl = 200;
let mouseX;
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
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let stream = null;
let num = imgArray.length - 1;

function changeImg() {
  let r = Math.floor(Math.random() * imgArray.length);
  currImg.src = imgArray[r];

  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
  }
  if (num > 1) {
    num--;
  }
  console.log(mouseX);
}

function changeText() {
  let r = Math.floor(Math.random() * imgArray.length);
  currText.textContent = txtdata[r].text;
  if (txtdata[r].type == "p" || txtdata[r].text.length > 80) {
    if (Math.random() > 0.5) {
      currText.className = ''
      currText.classList.add("pStyle1");
    } else {
      currText.className = ''
      currText.classList.add("pStyle2");
    }
  } else {
    if (Math.random() > 0.33) {
      currText.className = ''
      currText.classList.add("hStyle1");
    } else if (Math.random() > 0.66){
      currText.className = ''
      currText.classList.add("hStyle2");
    } else {
      currText.className = ''
      currText.classList.add("hStyle3");
    }
 
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
window.addEventListener("click", (e) => {
  // currImg.style.display = "block";
  console.log(e.x);
  if (streamIsActive) {
    clearInterval(stream);
    clearInterval(streamT);
    currImg.classList.remove("fullscreen");
    clickInfo.style.display = "block";
  } else {
    currImg.classList.add("fullscreen");
    stream = setInterval(changeImg, 800);
    streamT = setInterval(changeText, 200);
    clickInfo.style.display = "none";
  }
  streamIsActive = !streamIsActive;
});

window.addEventListener("wheel", (e) => {
  // currImg.style.display = "block";
  if (scrollCounter % 2 == 0) {
    changeImg();
    changeText();
  }
  scrollCounter++;
});
