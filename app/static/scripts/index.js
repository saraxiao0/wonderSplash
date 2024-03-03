let selectedStyle = "";
let selectedMusic = -1;

function selectElement(element, query) {
    Array.from(document.querySelectorAll(query)).forEach((e) => {
    e.classList.remove("selected");
   });

   element.classList.add("selected");
}

// from https://stackoverflow.com/a/35867833
function toggleStylesheet(li, stylesheetName) {
    selectElement(li, "li.cssToggle");

    // if its currently active stylesheet, do nothing
    if (stylesheetName === selectedStyle) {
        return;
    }

    const existingStylesheet = document.getElementById(selectedStyle);
    selectedStyle = stylesheetName;
    const href = "/static/css/" + stylesheetName;

    // delete other stylesheet
    if (existingStylesheet !== null) {
        existingStylesheet.disabled = true;
    }

    // add this stylesheet
    const link = document.createElement("link");
    link.id = stylesheetName;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
}

Array.from(document.querySelectorAll("li.cssToggle")).forEach((li) => {
    li.addEventListener("click", () => {
        toggleStylesheet(li, li.innerText);
    });
});

Array.from(document.querySelectorAll("li.musicToggle")).forEach((li, i) => {
    li.addEventListener("click", () => {
        mainScript.musicManager.playSoundtrack(i);
        selectElement(li, "li.musicToggle");
    });
});

const start = document.getElementById("startStyle");
toggleStylesheet(start, start.innerText);

function toggleDropdown(containerName) {
    const button = document.querySelector("#" + containerName + " > button");
    button.addEventListener("click", (event) => {
        const dropdown = document.querySelector("#" + containerName + " > ul");
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
        }
        else {
            dropdown.classList.add("hidden");
        }
    });
}

toggleDropdown("musicContainer");
toggleDropdown("styleContainer");