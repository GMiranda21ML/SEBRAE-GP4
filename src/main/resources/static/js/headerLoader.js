document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) {
        console.error("Elemento #header-placeholder não encontrado.");
        return;
    }

    const isSubdirectory = window.location.pathname.includes('/emAnalise/');
    const headerPath = isSubdirectory ? "../header.html" : "header.html";

    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Não foi possível carregar ${headerPath}`);
            }
            return response.text();
        })
        .then(data => {
            headerPlaceholder.innerHTML = data;

            const currentPage = window.location.pathname.split("/").pop();

            const navLinks = headerPlaceholder.querySelectorAll(".nav-link");

            navLinks.forEach(link => {
                const linkPage = link.getAttribute("href").split("/").pop();
                if (linkPage === currentPage) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        })
        .catch(error => {
            console.error("Erro ao carregar o cabeçalho:", error);
            headerPlaceholder.innerHTML = "<p>Erro ao carregar cabeçalho.</p>";
        });
});