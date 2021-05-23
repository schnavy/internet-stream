waitToggle()

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


function typewriter(elemArray, txtArray) {
    if (count >= txtArray.length) {
        count = 0
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
            typewriter(elemArray, txtArray)
        }, (getRandomOf(introSpeed)));
    } else {
        newtext = ""
        count++;
        j = 0;
        setTimeout(() => {
            typewriter(elemArray, txtArray)
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