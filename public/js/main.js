const currImg = document.querySelector("#curr-img");
const otherImg = document.querySelector("#other-img");
const currText = document.querySelector("#pMain");
const clickInfo = document.querySelector("#clickInfo");
const title = document.querySelector(".innerTitle");
const titleh2 = document.querySelector(".innerTitle h2 span");
const speedLog = document.querySelector("#speed-log");
const circles = document.querySelectorAll(".circle")
const enter = document.querySelector(".enter")
let intro2 = document.querySelector(".description2")

let intro = document.querySelector(".description")
let introsps = document.querySelectorAll(".description .intro")
let introsps2 = document.querySelectorAll(".description2 .intro")

let mehrps = document.querySelectorAll(".description .more")
let creditps = document.querySelectorAll(".description .more2")
const moreBtn = document.querySelector(".moreInfo")
const creditBtn = document.querySelector(".credit")
var regexExp = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

// var audioCtx = new(window.AudioContext || window.webkitAudioContext)();



let sound = {
  "basis": [],
  "extra": [],
}
sound.basis[0] = new Audio("../audio/athmo/basis-0.mp3");
sound.basis[1] = new Audio("../audio/athmo/basis-1.mp3");
sound.basis[2] = new Audio("../audio/athmo/basis-2.mp3");
sound.extra[0] = new Audio("../audio/athmo/extra-0.mp3");
sound.extra[1] = new Audio("../audio/athmo/extra-1.mp3");
sound.extra[2] = new Audio("../audio/athmo/extra-2.mp3");


sound.basis.forEach((elem) => {
  elem.loop = true;
})
sound.extra.forEach((elem) => {
  elem.loop = true;
})




let speed, imgR, textR, scale, titlechanger, imgsource, source, blurrycircle;
let pStyleAnzahl = 1;
let hStyleAnzahl = 4;
let titlewords = ["Die", "Flut", "der", "Reize", "/", "Der", "Reiz", "der", "Fluten", "/"]
// let titlewords = ["Hello", " ${user.name}",",", "what‘s", "going", "on ", "today", "?"]

let tcounter = 0;
let streamIsActive = false;
let streamIsPaused = false;
let imgswitcher = false;
let imgArray = [];
let newsImgs = [];
let ugImgs = [];
let moveCounter = 0
// let colors = ["black", "#e2e2e2", "#c30000", "#1a29b6", "#e1f36b", "#c41bc2"];
let colors = ["#0000ff", "#FF0000", "#FFFF00", "#cccccc", "#ffffff"]
let swcolors = ["black", "white", "grey", "lightgray", "#ddd", "black", "white", "grey", "lightgray", "#ddd", "#0000ff", "#FF0000", "#FFFF00", "#cccccc", "#ffffff"]
// let swcolors = ["black", "white", "grey", "lightgray", "#ddd"]


let introTexte = {
  start: ['Herzlich Willkommen bei', 'Hello ${user.name}, what‘s going on today?', 'Hello ${user.name}, what‘s going on today?',
    'ist ein Raum.', 'ist Interaktion mit', 'und ohne Inhalt.', ' ist ein Ort der Machtbeziehungen', 'durch Handlung', 'durch Form',
    'durch Geschwindigkeit', 'Tritt ein und aale dich im Rausch der Informationen.', 'Bewege dich durch den Raum des Affekts',
    'losgelöst von Kontext und Bedeutung.', 'mehr Informationen +', 'credit +', 'Enter ↵'
  ],
  mehr: ['Hello ${user.name}, what‘s going on today?',
    'sammelt tagesaktuelle Bild- und Textelemente von 1653 URL‘s,', 'bestehend aus', 'Social Media Posts', 'Wikipedia Artikeln', 'Nachrichtenportalen', 'Diese Masse an Daten wird verarbeitet, zerlegt, neu zusammengesetzt',
    'und bildet einen flüchtigen, nicht-greifbaren Strom der Neuigkeiten', 'eine Flut der Reize.', 'Parametrisch', 'Algorithmisch', 'Intransparent organisieren sich Ton, Bild und Text zu einer', 'maximalen Konsumerfahrung.', 'Es entsteht ein Feed, ein Interface, eine Infrastruktur die ein Bewegungspektrum öffnet,',
    'in dem Handlung und Inhalt in wechselseitige Beziehung treten.',
    'in dem jede Handlung das System legitimiert.'
  ],
  credit: ['Installation: David Wahrenburg', 'Sound: Lasse Bornträger'],
  usage: ['Cursor bewegen um Inhalt/Form zu verändern', '(click) oder (enter) — start', '(space) — pause', '(esc) oder (click) — stopp']
}

//["today", "currently", "right now", "at the moment"]
let j = 0;
let count = 0;
let waitcount = 0;
let newtext = ""
let moreActive = false
let creditActive = false
let introSpeed = 0;
let introPausen = 0;

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
if (typeof (imgdata) != "undefined") {

  // txtdata = txtdata.filter((x) => x.category == "News");
  data.news.images = imgdata.filter((x) => x.category == "News");
  data.userGenerated.images = imgdata.filter((x) => x.category == "user generated");
  data.wiki.images = imgdata.filter((x) => x.category == "Wiki");

  data.news.texte = txtdata.filter((x) => x.category == "News");
  data.userGenerated.texte = txtdata.filter((x) => x.category == "user generated");
  data.wiki.texte = txtdata.filter((x) => x.category == "Wiki");


  // console.log(txtdata.filter((x) => x.category == "News"));

  // console.log(imgdata);
  // console.log(txtdata);
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

}




if (isDownloader) {
  toggleStream();
  setInterval(() => {
    let imgsource = getCategory()
    let textsource = getCategory()
    changeImg(imgsource.images);
    changeText(textsource.texte);
  }, 300);
  wrapper.classList.add("downloadMode");
} else if (kinect) {
  wrapper.classList.add("kinectMode");
  changeImg();
  changeImg();
  changeText();
  streamKinect();

  setInterval(() => {

    if (mouseY < 0) {
      mouseY = height
    }
    changeSound()
  }, 100)

} else if (typeof (imgdata) != "undefined") {
  if (fullscreen) {
    wrapper.classList.add("kinectMode");

  }
  blurrycircle = new BlurCirc();
  blurrycircle.show()
  changeImg();
  changeImg();
  changeText();
  streamDesktop();
  setInterval(() => {
    blurrycircle.move()
  }, 70);

}

// titlechanger = setInterval((e) => {

//   if (streamIsActive) return
//   if (tcounter < titlewords.length - 1) {
//     tcounter++
//     titleh2.textContent = titlewords[tcounter - 1] + " " + titlewords[tcounter];
//   } else {
//     tcounter = 0
//     titleh2.textContent = titlewords[titlewords.length - 1] + " " + titlewords[tcounter];
//   }

// }, 600);



window.addEventListener("mousemove", (e) => {
  if (!kinect) {

    let cY = Math.floor(
      map(mouseY, 100, width, 120, 80)
    );
    let cX = Math.floor(
      map(mouseX, 0, height, -3, 3)
    );
    let r = cY - cX;
    let g = cY;
    let b = cY + cX;
    body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    if (streamIsActive && !streamIsPaused) {
      blurrycircle.change()
      changeSound()
    }
  }

});



document.addEventListener(
  "keydown",
  (e) => {
    if (e.code === "Space") {
      streamIsPaused = !streamIsPaused;
    } else if (e.code === "Escape") {
      toggleStream("stop");
    } else if (e.code === "Enter") {
      toggleStream("start");
    }
  },
  false
);



if (isMobileDevice() == false) {
  window.addEventListener("click", (e) => {
    if (e.target == moreBtn) {
      moreActive = toggleTypewriter(mehrps, introTexte.mehr, moreActive, moreBtn)
    } else if (e.target == creditBtn) {
      creditActive = toggleTypewriter(creditps, introTexte.credit, creditActive, creditBtn)
    } else {
      toggleStream();
      streamIsPaused = false;
    }
  });
} else {
  window.addEventListener("touchend", (e) => {
    changeImg();
    changeText();
    toggleStream();
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
    // currImg.style.filter = "blur(" + Math.floor((12 - scale) / 2) + "px)"
  } else {
    otherImg.style.display = "block";
    currImg.style.display = "none";
    currImg.src = input[imgR].url;
    otherImg.style.transform = "scale(" + scale + ")";
    // otherImg.style.filter = "blur(" + Math.floor((12 - scale) / 2) + "px)"
  }
  imgswitcher = !imgswitcher;
}

function changeText(input = data.news.texte) {
  scale = getScaleFromMouse();

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

function toggleStream(onlyStartorStop) {
  if (streamIsActive && onlyStartorStop != "start") {
    body.classList.remove("crosshair");
    wrapper.style.display = "none";
    if (intro) {
      intro.style.display = "block";
    }
    streamIsActive = !streamIsActive;
    sound.extra.forEach((elem) => {
      elem.pause()
    })
    sound.basis.forEach((elem) => {
      elem.pause()
    })
  } else if (onlyStartorStop != "stop") {
    body.classList.add("crosshair");

    wrapper.style.display = "flex";
    if (intro) {
      intro.style.display = "none"
    }
    streamIsActive = !streamIsActive;

    sound.extra.forEach((elem) => {
      setTimeout(() => {
        elem.play()
        console.log("startet");
      }, getRandomOf(20000))

    })
    sound.basis.forEach((elem) => {
      elem.play()
    })
  }
}

function streamDesktop() {
  if (streamIsActive && !streamIsPaused) {
    source = getCategory()
    speed = getSpeedFromMouseY();
    changeImg(source.images);
    changeText(source.texte);
    logParameters()
    changeFormlinien()
  }
  setTimeout(streamDesktop, speed);
}

function streamKinect() {
  if (streamIsActive && !streamIsPaused) {
    // if (mouseY < 0) {
    //   mouseY = document.clientHeight
    // }
    source = getCategory()
    speed = getSpeedFromMouseY();
    changeImg(source.images);
    changeText(source.texte);
    logParameters()
    changeFormlinien()

  }
  setTimeout(streamKinect, speed);
}



let linienFormen = document.querySelectorAll(".svg-container")
let linienQuote;

function changeFormlinien() {
  if (!streamIsActive || streamIsPaused) return

  let h = wrapper.clientHeight;
  let w = wrapper.clientWidth;
  for (let i = 0; i < linienFormen.length; i++) {
    linienQuote = map(mouseY, 0, h, 1, 7)
    r = Math.floor(getRandomOf(linienQuote))
    const elem = linienFormen[i];
    if (r == 1) {
      elem.style.display = "block"
      elem.style.top = Math.floor(getRandomOf(h)) + "px"
      elem.style.left = Math.floor(getRandomOf(w)) + "px"
      elem.style.width = (getRandomOf(1000) + 200) + "px"
      elem.style.transform = "rotate(" + Math.floor(getRandomOf(360)) + "deg) scaleX(" + Math.floor(getRandomOf(15)) + ")"
      elem.style.filter = "blur(" + Math.floor(getRandomOf(15)) + "px)"
      elem.firstElementChild.firstElementChild.style.stroke = swcolors[getRandomOf(swcolors.length)]
    } else if (r > 2) {
      elem.style.display = "none"
    }
  }

}



function logParameters() {
  if (!streamIsActive || streamIsPaused) return

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



function getScaleFromMouse() {
  return Math.max(
    map(mouseY, 200, document.documentElement.clientHeight - 200, 12, 3),
    1
  );
}

function getSpeedFromMouseY() {
  return Math.floor(Math.max(map(mouseY, 200, document.documentElement.clientHeight, 50, 2000), 50))

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
    return data.wiki;
  } else if (mouseX < document.documentElement.clientWidth / 3 * 2) {
    return data.news;
  } else {
    return data.userGenerated;
  }
}