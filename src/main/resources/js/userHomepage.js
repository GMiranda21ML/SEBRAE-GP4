document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    logoutButton.addEventListener('click', () => {
        alert('Usuário desconectado! Redirecionando para a tela de login.');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));

            e.target.classList.add('active');

            console.log(`Carregando conteúdo para: ${e.target.textContent}`);
        });
    });
});