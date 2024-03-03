function toggleSelect(element) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
    }
    else {
        element.classList.add("selected");
    }
}

Array.from(document.querySelectorAll("li.musicToggle")).forEach((li) => {
    li.addEventListener("click", () => {
        const musicId = li.getAttribute("music-id");
        mainScript.musicManager.toggleSoundtrack(musicId);
        toggleSelect(li);
    });
});

mainScript.toggleDropdown("musicContainer");

const startMusic = document.querySelector(".startMusic");
mainScript.musicManager.toggleSoundtrack(startMusic.getAttribute("music-id"));
toggleSelect(startMusic);