document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            link.classList.add('active');
            
            console.log(`Navegando para: ${link.textContent}`);
        });
    });

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Botão Log out clicado');
        });
    }

    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            console.log('Botão Filtrar clicado');
        });
    }

    const listContainer = document.querySelector('.list-container');
    if (listContainer) {
        listContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('action-icon')) {
                
                if (event.target.classList.contains('green')) {
                    console.log('Botão de Ação Verde clicado');
                } else if (event.target.classList.contains('red')) {
                    console.log('Botão de Ação Vermelho clicado');
                }
            }
        });
    }
});