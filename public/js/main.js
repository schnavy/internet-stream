//Preloader

let imgArray = [];
for (i = 0; i < data["imageurls"].length; i++) {
  imgArray[i] = new Image();
  imgArray[i] = data["imageurls"][i];
}

const body = document.querySelector("body");
let currImg = document.querySelector("#curr-img");
// let imgArray = data["image-urls"];
let clickInfo = document.querySelector("#clickInfo");
let n = 0;
let scrollCounter = 0;
let streamIsActive = false;
let stream = null;

function changeImg() {
  let r = Math.floor(Math.random() * imgArray.length);
  currImg.src = imgArray[r];

  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
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
    currImg.classList.add("fullscreen");
    stream = setInterval(changeImg, 100);
    clickInfo.style.display = "none";
    body.style.backgroundColor = "grey";

  }
  streamIsActive = !streamIsActive;
});

window.addEventListener("scroll", (e) => {
  currImg.style.display = "block";
  if (scrollCounter % 5 == 0) {
    changeImg();
  }
  scrollCounter++;
  console.log(e);
});
