const content = document.getElementById("content");
const p5Container = document.getElementById("p5Container");

content.addEventListener("click", (e => {
    console.log(e);
    content.classList.add("hidden");
    p5Container.dispatchEvent(e);
    content.classList.remove("hidden");
}));