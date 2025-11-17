document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado. Redirecionando para o login.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const logoutButton = document.getElementById('logout-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    const currentPage = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            alert('Usuário desconectado! Redirecionando para a tela de login.');
            window.location.href = 'paginaLogin.html';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
});