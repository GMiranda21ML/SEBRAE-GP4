document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            alert('Você foi desconectado.');
            window.location.href = 'paginaLogin.html';
        });
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

                if (!pesquisas || pesquisas.length === 0) {
                    listContainer.innerHTML = '<p style="color: white; text-align: center;">Nenhuma pesquisa cadastrada.</p>';
                    return;
                }

                pesquisas.forEach(pesquisa => {
                    const item = document.createElement('div');
                    item.className = 'list-item';

                    // Data mockada (ajuste conforme seu backend retornar a data real)
                    const dataCriacao = "05/10/2024";

                    item.innerHTML = `
                        <div class="item-header">
                            <h4 class="item-title">${pesquisa.titulo || 'Pesquisa sem Título'}</h4>
                            <span class="item-date">${dataCriacao}</span>
                        </div>
                        <p class="item-desc">${pesquisa.descricao || 'Sem descrição.'}</p>

                        <div class="item-actions">
                            <button class="edit-btn" data-id="${pesquisa.id}">Editar</button>
                            <button class="excluir-btn" data-id="${pesquisa.id}">Excluir</button>
                        </div>
                    `;
                    listContainer.appendChild(item);
                });

            } catch (error) {
                console.error('Erro ao carregar pesquisas:', error);
                listContainer.innerHTML = '<p style="color: white; text-align: center;">Falha ao carregar pesquisas.</p>';
            }
        }

    listContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (!id) return;

        if (target.classList.contains('edit-btn')) {

            window.location.href = `criacaoEdicaoPesquisa.html?id=${id}`;
        }

        if (target.classList.contains('excluir-btn')) {
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