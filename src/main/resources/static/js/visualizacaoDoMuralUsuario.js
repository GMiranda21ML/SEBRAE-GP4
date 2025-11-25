document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = 'paginaLogin.html';
        });
    }

    const researchListContainer = document.querySelector('.research-list');

    function loadResearches(data) {
        researchListContainer.innerHTML = '';

        if (!data || data.length === 0) {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'Nenhuma pesquisa disponível no momento.';
            noDataMessage.style.textAlign = 'center';
            noDataMessage.style.color = 'white';
            noDataMessage.style.marginTop = '20px';
            researchListContainer.appendChild(noDataMessage);
            return;
        }

        data.forEach(research => {
            const researchBlock = document.createElement('div');
            researchBlock.classList.add('list-item');

            const dataExibicao = "05/10/2024";

            researchBlock.innerHTML = `
                <div class="item-header">
                    <h4 class="item-title">${research.titulo || 'Pesquisa sem Título'}</h4>
                    <span class="item-date">${dataExibicao}</span>
                </div>
                <p class="item-desc">${research.descricao || 'Sem descrição.'}</p>

                <div class="item-actions">
                    <button class="respond-btn" data-id="${research.id}">Responder</button>
                </div>
            `;

            researchListContainer.appendChild(researchBlock);

            const respondBtn = researchBlock.querySelector('.respond-btn');
            respondBtn.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                window.location.href = `responderPesquisa.html?id=${id}`;
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
                errorMessage.textContent = 'Falha ao carregar pesquisas.';
                errorMessage.style.color = 'white';
                errorMessage.style.textAlign = 'center';
                researchListContainer.appendChild(errorMessage);
            });
    }

    fetchAndLoadResearches();
});