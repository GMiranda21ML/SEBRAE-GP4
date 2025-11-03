document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const listContainer = document.querySelector('.list-container');
    const addBtn = document.querySelector('.add-btn');

    if (addBtn) {
        addBtn.addEventListener('click', () => {

            window.location.href = 'criacaoDeEdicaoPesquisa.html';
        });
    }

    async function carregarPesquisas() {
        try {
            const pesquisas = await getPesquisas();
            listContainer.innerHTML = '';

            if (pesquisas.length === 0) {
                listContainer.innerHTML = '<p>Nenhuma pesquisa cadastrada.</p>';
                return;
            }

            pesquisas.forEach(pesquisa => {
                const item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = `
                    <div class="item-details">
                        <h4>${pesquisa.titulo || 'Pesquisa sem título'}</h4>
                        <p>${pesquisa.descricao || 'Sem descrição.'}</p>
                    </div>
                    <div class="item-actions">
                        <div class="action-icon red" data-id="${pesquisa.id}"></div>
                        <button class="edit-btn" data-id="${pesquisa.id}">Editar</button>
                    </div>
                `;
                listContainer.appendChild(item);
            });

        } catch (error) {
            console.error('Erro ao carregar pesquisas:', error);
            listContainer.innerHTML = '<p>Falha ao carregar pesquisas. Tente novamente.</p>';
        }
    }

    listContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (!id) return;

        if (target.classList.contains('edit-btn')) {

            window.location.href = `criacaoEdicaoPesquisa.html?id=${id}`;
        }

        if (target.classList.contains('action-icon') && target.classList.contains('red')) {
            if (confirm('Tem certeza que deseja excluir esta pesquisa?')) {
                try {
                    await deletarPesquisa(id);
                    carregarPesquisas();
                } catch (error) {
                    console.error('Erro ao excluir pesquisa:', error);
                    alert('Falha ao excluir a pesquisa.');
                }
            }
        }
    });

    carregarPesquisas();
});