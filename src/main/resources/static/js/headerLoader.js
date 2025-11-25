document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (!headerPlaceholder) {
        return;
    }
    const isSubdirectory = window.location.pathname.includes('/emAnalise/');
    const basePath = isSubdirectory ? "../" : "";
    const headerPath = basePath + "header.html";

    const userRole = localStorage.getItem('userRole');

    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar ${headerPath}`);
            return response.text();
        })
        .then(data => {
            headerPlaceholder.innerHTML = data;

            const navList = headerPlaceholder.querySelector(".nav-list");
            if (navList) {
                navList.innerHTML = '';

                let links = [];

                if (userRole === 'ROLE_USER') {
                    links = [
                        { text: 'Home', href: 'dashboardUsuario.html' },
                        { text: 'Pesquisas', href: 'visualizacaoDoMuralUsuario.html' },
                        { text: 'Mural', href: 'minhasRespostas.html' }
                    ];
                } else {
                    links = [
                        { text: 'Home', href: 'homepage.html' },
                        { text: 'Criação de pesquisas', href: 'criacaoDePesquisasADM.html' },
                        { text: 'Disparo de pesquisas', href: 'disparoDePesquisasADM.html' },
                        { text: 'Análise de dados', href: 'emAnalise/analiseDadosADM.html' },
                        { text: 'Mural', href: 'emAnalise/muralADM.html' }
                    ];
                }

                links.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');

                    let fullHref = item.href;
                    if (isSubdirectory && !fullHref.startsWith('http') && !fullHref.startsWith('#')) {
                        if (!fullHref.startsWith('../')) {
                            fullHref = basePath + fullHref;
                        }
                    } else if (!isSubdirectory && fullHref.startsWith('../')) {
                         fullHref = fullHref.replace('../', '');
                    }

                    a.href = fullHref;
                    a.textContent = item.text;
                    a.className = 'nav-link';

                    li.appendChild(a);
                    navList.appendChild(li);
                });
            }

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

            const logo = headerPlaceholder.querySelector('.header-logo');
            if(logo) logo.src = basePath + "img/simbolo_azulclaro.png";

            const logoutBtn = headerPlaceholder.querySelector('.logout-btn');
            if(logoutBtn) {
                logoutBtn.href = basePath + "paginaLogin.html";
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userRole');
                });
            }
        })
        .catch(error => {
            console.error("Erro ao carregar header:", error);
        });
});