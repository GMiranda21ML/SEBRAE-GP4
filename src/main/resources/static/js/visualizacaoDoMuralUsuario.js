document.addEventListener('DOMContentLoaded', () => {

    const researchListContainer = document.querySelector('.research-list');

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

            researchBlock.innerHTML = `
                <h3 class="research-title">${research.title}</h3>
                <p class="research-summary">${research.summary}</p>
                <button class="respond-btn" data-id="${research.id}">Responder</button>
            `;

            researchListContainer.appendChild(researchBlock);

            const respondBtn = researchBlock.querySelector('.respond-btn');
            respondBtn.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                console.log(`Botão Responder clicado para Pesquisa ID: ${id}`);
            });
        });
    }

    function fetchAndLoadResearches() {
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

    fetchAndLoadResearches();

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
});