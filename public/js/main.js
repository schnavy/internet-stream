//Preloader

let imgArray = [];
let anzahl = 200;

data = data.map(x => x.url)
console.log(data);

for (i = 0; i < data.length; i++) {
  imgArray[i] = new Image();
  imgArray[i] = data[i];
}

const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
let clickInfo = document.querySelector("#clickInfo");
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let stream = null;
let num = imgArray.length - 1;

function changeImg() {
  console.log(num);
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
}

window.addEventListener("click", (e) => {
  currImg.style.display = "block";
  if (streamIsActive) {
    clearInterval(stream);
    currImg.classList.remove("fullscreen");
    clickInfo.style.display = "block";
    body.style.backgroundColor = "red";
  } else {
    // currImg.classList.add("fullscreen");
    stream = setInterval(changeImg, 100);
    clickInfo.style.display = "none";
    body.style.backgroundColor = "grey";
  }
  streamIsActive = !streamIsActive;
});

window.addEventListener("wheel", (e) => {
  currImg.style.display = "block";
  if (scrollCounter % 2 == 0) {
    changeImg();
  }
  scrollCounter++;
});
