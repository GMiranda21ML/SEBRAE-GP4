document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'paginaLogin.html';
        return;
    }

    const researchListContainer = document.querySelector('.research-list');

    function loadRespostas(data) {
        researchListContainer.innerHTML = '';

        if (!data || data.length === 0) {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'Nenhuma pesquisa respondida por você.';
            noDataMessage.style.textAlign = 'center';
            noDataMessage.style.color = 'white';
            noDataMessage.style.padding = '20px';
            researchListContainer.appendChild(noDataMessage);
            return;
        }

        const dataMockada = "05/10/2024";

        data.forEach(research => {
            const researchBlock = document.createElement('div');
            researchBlock.classList.add('research-block');

            researchBlock.innerHTML = `
                <h3 class="research-title">${research.titulo || 'Pesquisa sem Título'}</h3>
                <span class="data-exibicao">${dataMockada}</span>
                <p class="research-summary">${research.descricao || 'Sem descrição.'}</p>
                <button class="respond-btn" data-id="${research.id}">Visualizar</button>
            `;

            researchListContainer.appendChild(researchBlock);

            const respondBtn = researchBlock.querySelector('.respond-btn');
            respondBtn.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                window.location.href = `responderPesquisa.html?id=${id}&mode=view`;
            });
        });
    }

    function fetchAndLoadRespostas() {
        getMyPesquisasRespondidas()
            .then(data => {
                loadRespostas(data);
            })
            .catch(error => {
                console.error('Erro ao carregar pesquisas respondidas:', error);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Falha ao carregar pesquisas. Tente recarregar a página.';
                errorMessage.style.color = 'white';
                errorMessage.style.textAlign = 'center';
                researchListContainer.appendChild(errorMessage);
            });
    }

    fetchAndLoadRespostas();

    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            console.log('Botão Filtrar clicado');
        });
    }
});