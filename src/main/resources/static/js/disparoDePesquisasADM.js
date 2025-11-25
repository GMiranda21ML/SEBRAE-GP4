document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const listContainer = document.querySelector('.list-container');
    const modal = document.getElementById('confirmation-modal');
    const returnBtn = document.getElementById('modal-return-btn');

    async function carregarPesquisas() {
        try {
            const pesquisas = await getPesquisas();
            listContainer.innerHTML = '';

            if (!pesquisas || pesquisas.length === 0) {
                listContainer.innerHTML = '<p style="color: white; text-align: center;">Nenhuma pesquisa pronta para disparo.</p>';
                return;
            }

            pesquisas.forEach(pesquisa => {
                const item = document.createElement('div');
                item.className = 'list-item';

                const dataCriacao = "05/10/2024";

                item.innerHTML = `
                    <div class="item-header">
                        <h4 class="item-title">${pesquisa.titulo || 'Pesquisa sem título'}</h4>
                        <span class="item-date">${dataCriacao}</span>
                    </div>
                    <p class="item-desc">${pesquisa.descricao || 'Sem descrição.'}</p>

                    <div class="item-actions">
                         <button class="disparar-btn" data-id="${pesquisa.id}">Disparar</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });

        } catch (error) {
            console.error('Erro ao carregar pesquisas:', error);
            listContainer.innerHTML = '<p style="color: white; text-align: center;">Falha ao carregar pesquisas.</p>';
        }
    }

    function showModal() {
        if (modal) modal.style.display = 'flex';
    }

    function hideModal() {
        if (modal) modal.style.display = 'none';
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', hideModal);
    }

    listContainer.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('disparar-btn')) {
            const id = target.dataset.id;
            if (!id) return;

            if (confirm('Tem certeza que deseja disparar esta pesquisa para todos os usuários?')) {
                try {
                    const logResultado = await dispararPesquisaEmail(id);
                    showModal();
                } catch (error) {
                    console.error('Erro ao disparar:', error);
                    alert('Falha ao disparar a pesquisa.');
                }
            }
        }
    });

    carregarPesquisas();
});