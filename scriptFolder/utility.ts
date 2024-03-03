function toggleDropdown(containerName) {
    const button = document.querySelector("#" + containerName + " > button") as HTMLButtonElement;
    button?.addEventListener("click", (event) => {
        const dropdown = document.querySelector("#" + containerName + " > ul");
        if (dropdown === null) {
            return;
        }
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
            button.innerText = button.innerText + " ↪";
        } else {
            dropdown.classList.add("hidden");
            button.innerText = button.innerText.substring(0, button.innerText.length - 2);
        }
    });
};

export {
    toggleDropdown
};