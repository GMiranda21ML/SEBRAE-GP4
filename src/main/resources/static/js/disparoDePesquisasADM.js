document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const listContainer = document.querySelector('.list-container');

    async function carregarPesquisas() {
        try {
            const pesquisas = await getPesquisas();
            listContainer.innerHTML = '';

            if (pesquisas.length === 0) {
                listContainer.innerHTML = '<p>Nenhuma pesquisa pronta para disparo.</p>';
                return;
            }

            pesquisas.forEach(pesquisa => {
                const item = document.createElement('div');
                item.className = 'list-item';

                item.innerHTML = `
                    <div class="item-details" style="flex-grow: 1; margin-right: 20px;">
                        <h4>${pesquisa.titulo || 'Pesquisa sem título'}</h4>
                        <p>${pesquisa.descricao || 'Sem descrição.'}</p>
                    </div>
                    <div class="item-actions">
                         <button class="disparar-btn" data-id="${pesquisa.id}">Disparar pesquisa</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });

        } catch (error) {
            console.error('Erro ao carregar pesquisas:', error);
            listContainer.innerHTML = '<p>Falha ao carregar pesquisas. Tente novamente.</p>';
        }
    }

    const modal = document.getElementById('confirmation-modal');
    const returnBtn = document.getElementById('modal-return-btn');

    function showModal() {
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function hideModal() {
        if (modal) {
            modal.style.display = 'none';
        }
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

                        alert(logResultado);

                        showModal();
                    } catch (error) {
                        console.error('Erro ao disparar pesquisa:', error);
                        alert('Falha ao disparar a pesquisa.');
                    }
                }
            }
        });

    carregarPesquisas();
});