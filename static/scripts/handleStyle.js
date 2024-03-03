let selectedStyle = "";

function deselectAll(query) {
    Array.from(document.querySelectorAll(query)).forEach((e) => {
        e.classList.remove("selected");
    });
}

function selectElement(element, query) {
    deselectAll(query);
    element.classList.add("selected");
}

function addStylesheet(stylesheetName) {
    const href = "./static/css/" + stylesheetName + ".css";

    const link = document.createElement("link");
    link.id = stylesheetName;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
}

// from https://stackoverflow.com/a/35867833
function toggleStylesheet(li, stylesheetName) {
    selectElement(li, "li.cssToggle");

    // if its currently active stylesheet, do nothing
    if (stylesheetName === selectedStyle) {
        return;
    }

    // remove body class for other stylesheet
    const existingStylesheet = document.getElementById(selectedStyle);
    if (existingStylesheet !== null) {
        document.body.classList.remove(selectedStyle);
    }

    // add body class for this stylesheet
    selectedStyle = stylesheetName;
    document.body.classList.add(selectedStyle);

    const scriptName = li.getAttribute("p5");
    addP5(scriptName);
}

function addP5(scriptName) {
    const p5Container = document.getElementById("p5Container");
    p5Container.innerHTML = "";

    var ifrm = document.createElement("iframe");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.id = "p5Frame";
    ifrm.setAttribute("src", "./static/p5/" + scriptName + ".html");
    p5Container.appendChild(ifrm);
}

Array.from(document.querySelectorAll("li.cssToggle")).forEach((li) => {
    const name = li.getAttribute("css-name");
    addStylesheet(name);
    li.addEventListener("click", () => {
        toggleStylesheet(li, name);
    });
});
const start = document.querySelector(".startStyle");
toggleStylesheet(start, start.getAttribute("css-name"));

mainScript.toggleDropdown("styleContainer");