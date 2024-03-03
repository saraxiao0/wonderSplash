function toggleSelect(element) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
    }
    else {
        element.classList.add("selected");
    }
}

Array.from(document.querySelectorAll("li.musicToggle")).forEach((li, i) => {
    li.addEventListener("click", () => {
        mainScript.musicManager.toggleSoundtrack(i);
        toggleSelect(li);
    });
});

mainScript.toggleDropdown("musicContainer");