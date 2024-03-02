let selectedStyle = "";
let selectedMusic = -1;

// from https://stackoverflow.com/a/35867833
function toggleStylesheet(stylesheetName) {
    // if its currently active stylesheet, do nothing
    if (stylesheetName === selectedStyle) {
        return;
    }

    selectedStyle = stylesheetName;
    const href = "/static/css/" + stylesheetName;

    // turn on stylesheetName
    let existingNode = 0; //get existing stylesheet node if it already exists:
    for (let i = 0; i < document.styleSheets.length; i++) {
        if (
            document.styleSheets[i].href &&
            document.styleSheets[i].href.indexOf(href) > -1
        )
            existingNode = document.styleSheets[i].ownerNode;
    }
    console.log(existingNode);

    // delete other stylesheet
    if (existingNode !== 0) {
        existingNode.parentNode.removeChild(existingNode);
    }

    // add this stylesheet
    console.log(existingNode);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
}

Array.from(document.querySelectorAll("li.cssToggle")).forEach((li) => {
    li.addEventListener("click", () => {
        toggleStylesheet(li.innerText);
    });
});

Array.from(document.querySelectorAll("li.musicToggle")).forEach((li, i) => {
    li.addEventListener("click", () => {
        mainScript.musicManager.playSoundtrack(i);
    });
});

mainScript.musicManager.playSoundtrack(selectedMusic);
toggleStylesheet("template_city1.css");
