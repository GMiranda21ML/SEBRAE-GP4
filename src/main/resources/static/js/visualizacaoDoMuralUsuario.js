document.addEventListener('DOMContentLoaded', () => {

    // 1. Verifica o token
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const researchListContainer = document.querySelector('.research-list');

    // 2. Função para criar os blocos de pesquisa no HTML
    function loadResearches(data) {
        if (!data || data.length === 0) {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'Nenhuma pesquisa disponível no momento.';
            noDataMessage.style.textAlign = 'center';
            noDataMessage.style.padding = '20px';
            researchListContainer.appendChild(noDataMessage);
            return;
        }

        data.forEach(research => {
            const researchBlock = document.createElement('div');
            researchBlock.classList.add('research-block');

            // Formata o HTML para cada pesquisa
            researchBlock.innerHTML = `
                <h3 class-="research-title">${research.titulo || 'Pesquisa sem Título'}</h3>
                <p class="research-summary">${research.descricao || 'Sem descrição.'}</p>
                <button class="respond-btn" data-id="${research.id}">Responder</button>
            `;

            researchListContainer.appendChild(researchBlock);

            // 3. Adiciona o clique no botão RESPONDER
            const respondBtn = researchBlock.querySelector('.respond-btn');
            respondBtn.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');

                // *** CORREÇÃO AQUI ***
                // Redireciona para uma página de resposta, passando o ID
                window.location.href = `responderPesquisa.html?id=${id}`;
            });
        });
    }

    // 4. Função que busca os dados da API e chama o loadResearches
    function fetchAndLoadResearches() {
        // Esta função (getPesquisas) DEVE estar em 'apiService.js'
        getPesquisas()
            .then(data => {
                loadResearches(data);
            })
            .catch(error => {
                console.error('Erro ao carregar pesquisas:', error);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Falha ao carregar pesquisas. Tente recarregar a página.';
                errorMessage.style.color = 'red';
                errorMessage.style.textAlign = 'center';
                researchListContainer.appendChild(errorMessage);
            });
    }

    // 5. Chama a função para carregar tudo
    fetchAndLoadResearches();

    // --- Botões de Controle (Logout e Filtro) ---

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // *** CORREÇÃO AQUI ***
            localStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = 'paginaLogin.html';
        });
    }

    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            console.log('Botão Filtrar clicado');
            // Adicionar lógica de filtro aqui
        });
    }
});