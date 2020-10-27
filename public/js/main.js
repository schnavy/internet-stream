const body = document.querySelector("body")
let currImg = document.querySelector("#curr-img");
let imgArray = data["image-urls"];
let clickInfo = document.querySelector("#clickInfo");
let n = 0;
let streamIsActive = false;
let stream = null;

function changeImg() {
  currImg.src = imgArray[n];
  console.log(imgArray[n]);

  if (n == imgArray.length - 1) {
    n = 0;
  } else {
    n++;
  }
}

window.addEventListener("click", (e) => {
  currImg.style.display = "block"
  if (streamIsActive) {
    clearInterval(stream);
    clickInfo.style.display ="block"
    body.style.backgroundColor = "red"
    } else {
    stream = setInterval(changeImg, 500);
    clickInfo.style.display ="none"
    body.style.backgroundColor = "grey"
  }
  streamIsActive = !streamIsActive;
  console.log(streamIsActive);
});
