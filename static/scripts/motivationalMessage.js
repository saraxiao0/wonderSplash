const button = document.getElementById("motivationalMessage");
const panel = document.getElementById("motivationPanel");
const cover = document.getElementById("motivationCover");

button.addEventListener("click", () => {
    const span = panel.querySelector("span");
    span.innerText = mainScript.genFact();
    panel.classList.remove("hidden");
    cover.classList.remove("hidden");
});

const closeButton = panel.querySelector(".closeButton");
closeButton.addEventListener("click", () => {
    cover.classList.add("hidden");
});