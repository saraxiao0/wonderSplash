function toggleDropdown(containerName) {
    const button = document.querySelector("#" + containerName + " > button");
    button?.addEventListener("click", (event) => {
        const dropdown = document.querySelector("#" + containerName + " > ul");
        if (dropdown === null) {
            return;
        }
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
        } else {
            dropdown.classList.add("hidden");
        }
    });
};

export {
    toggleDropdown
};