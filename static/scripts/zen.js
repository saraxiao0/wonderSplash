let zenMode = false;
const hide = ["header", "imageCredits", "footer", "buttonContainer"];

const zen = document.getElementById("zenModeOn");
const zenOff = document.getElementById("zenModeOff");

zen.addEventListener("click", () => {
    hide.forEach((id) => {
        let temp = document.getElementById(id);
        temp.classList.add("hidden");
    });

    zenOff.classList.remove("hidden");

    zenMode = true;
});
zenOff.addEventListener("click", () => {
    hide.forEach((id) => {
        let temp = document.getElementById(id);
        temp.classList.remove("hidden");
    });

    zenOff.classList.add("hidden");

    zenMode = false;
});
