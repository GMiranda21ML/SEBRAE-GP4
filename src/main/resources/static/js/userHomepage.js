document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado. Redirecionando para o login.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const logoutButton = document.getElementById('logout-btn');
    const navLinks = document.querySelectorAll('.nav-link');

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
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            console.log(`Carregando conteúdo para: ${e.target.textContent}`);
        });
    });

    async function carregarPesquisas() {
        try {
            const response = await fetch('/pesquisa', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar dados ou token inválido.');
            }

            const pesquisas = await response.json();
            console.log('Dados carregados:', pesquisas);

        } catch (error) {
            console.error('Erro:', error);
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            localStorage.removeItem('authToken');
            window.location.href = 'paginaLogin.html';
        }
    }

    // Para carregar os dados ao entrar na página, descomente a linha abaixo
    // carregarPesquisas();
});