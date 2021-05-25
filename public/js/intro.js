if (viewTitle == "Intropanels") {
    const descriptionWrapper = document.querySelector(".description-wrapper")
    descriptionWrapper.classList.add("intropanels")
    intropanels()
} else if (mitIntro) {
    waitToggle()
}

function intropanels() {

    typewriter(introsps, introTexte.start, () => {
        typewriter(introsps2, introTexte.start, () => {
            typewriter(mehrps, introTexte.mehr, () => {
                typewriter(creditps, introTexte.credit)
            })
        })
    })
    setInterval(() => {
        let r = getRandomOf(5)

        if (r == 0) {
            typewriter(introsps, introTexte.start)
        } else if (r == 1) {
            typewriter(introsps2, introTexte.start)
        } else if (r == 2) {
            typewriter(mehrps, introTexte.mehr)
        } else if (r == 3) {
            typewriter(creditps, introTexte.credit)
        } else if (r == 4) {
            typewriter(introsps, introTexte.start, () => {
                typewriter(introsps2, introTexte.start, () => {
                    typewriter(mehrps, introTexte.mehr, () => {
                        typewriter(creditps, introTexte.credit)
                    })
                })
            })
        } else if (r == 3) {
            typewriterRemove(introsps2)
        } else {
            typewriter(mehrps, introTexte.start)
            typewriter(introsps, introTexte.credit)
            typewriter(mehrps, introTexte.start)
            typewriter(introsps2, introTexte.start)
            setTimeout(() => {
                typewriter(introsps, introTexte.start, () => {
                    typewriter(introsps2, introTexte.start, () => {
                        typewriter(mehrps, introTexte.mehr, () => {
                            typewriter(creditps, introTexte.credit)
                        })
                    })
                })

            }, 200)

        }
    }, 20000)
}

function waitToggle() {
    if (waitcount > 3) {
        typewriter(introsps, introTexte.start)
        return
    }
    waitcount++
    elem = introsps[0]
    if (elem.textContent == "|") {
        elem.textContent = "";
    } else if (elem.textContent == "") {
        elem.textContent = "|";
    }
    setTimeout(waitToggle, 600)
}


function typewriter(elemArray, txtArray, callback) {
    if (count >= txtArray.length) {
        count = 0
        callback()
        return
    }
    let elem = elemArray[count];
    let txt = txtArray[count]

    if (j < txt.length) {
        newtext += txt.charAt(j)
        if (j != txt.length - 1 && j % 2 != 0) {
            elem.textContent = newtext + "|";
        } else {
            elem.textContent = newtext;
        }

        j++;
        setTimeout(() => {
            typewriter(elemArray, txtArray, callback)
        }, (getRandomOf(introSpeed)));
    } else {
        newtext = ""
        count++;
        j = 0;
        setTimeout(() => {
            typewriter(elemArray, txtArray, callback)
        }, introPausen)
    }
}

function typewriterRemove(elemArray) {
    if (count == elemArray.length) {
        count = 0;
        return
    }

    let elem = elemArray[elemArray.length - 1 - count];

    elem.textContent = "";
    count++;

    setTimeout(() => {
        typewriterRemove(elemArray)
    }, (getRandomOf(introSpeed)));

}


function toggleTypewriter(elemArray, txtArray, bool, button) {

    if (!bool) {
        button.classList.add("kursiv")
        button.textContent = button.textContent.slice(0, -1) + "-"
        typewriter(elemArray, txtArray)
    } else {
        button.classList.add("kursiv")
        button.textContent = button.textContent.slice(0, -1) + "+"
        typewriterRemove(elemArray)

    }
    return !bool
}