document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) {
        console.error("Elemento #header-placeholder não encontrado.");
        return;
    }

    // Verifica se está em subdiretório para ajustar o caminho do header.html
    // Se a URL tiver '/emAnalise/', volta um nível (../)
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

            // --- Lógica para marcar a aba ativa (Visual de Pasta) ---

            // Pega o nome do arquivo atual (ex: 'criacaoDePesquisasADM.html')
            const currentPage = window.location.pathname.split("/").pop();

            // Seleciona todos os links da navegação
            const navLinks = headerPlaceholder.querySelectorAll(".nav-link");

            navLinks.forEach(link => {
                // Pega o destino do link (href)
                const linkHref = link.getAttribute("href");

                if (linkHref) {
                    // Pega apenas o nome do arquivo do link (ignora '../')
                    const linkPage = linkHref.split("/").pop();

                    // Se o nome do arquivo da página for igual ao do link, ativa a aba
                    if (linkPage === currentPage) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                }
            });

            // Ajuste do caminho da imagem do logo se estiver em subdiretório
            if (isSubdirectory) {
                const logo = headerPlaceholder.querySelector('.header-logo');
                // Se você tiver uma classe .header-logo na imagem do header.html
                if(logo) logo.src = "../img/simbolo_azulclaro.png";

                // Ajuste opcional nos links se eles não forem absolutos
                const links = headerPlaceholder.querySelectorAll('a');
                links.forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                        a.setAttribute('href', '../' + href);
                    }
                });
            }
        })
        .catch(error => {
            console.error("Erro ao carregar o cabeçalho:", error);
        });
});