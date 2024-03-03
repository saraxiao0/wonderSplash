const button = document.getElementById("motivationalMessage");
const panel = document.getElementById("motivationPanel");
button.addEventListener("click", () => {
    const span = panel.querySelector("span");
    span.innerText = mainScript.genFact();
    panel.classList.remove("hidden");
});