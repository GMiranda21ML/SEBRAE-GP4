document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const titleInput = document.querySelector('.title-input');
    const summaryTextarea = document.querySelector('.summary-textarea');
    const saveBtn = document.querySelector('.save-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const pesquisaId = urlParams.get('id');
    let modoEdicao = pesquisaId != null;

    if (modoEdicao) {

        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            titleInput.value = pesquisa.titulo;
            summaryTextarea.value = pesquisa.descricao;

        } catch (error) {
            console.error('Erro ao carregar dados da pesquisa:', error);
            alert('Não foi possível carregar a pesquisa para edição.');
            modoEdicao = false;
        }
    }

    saveBtn.addEventListener('click', async () => {
        const titulo = titleInput.value;
        const descricao = summaryTextarea.value;

        const perguntas = [];

        // Você precisaria de um código aqui para ler as perguntas do .form-body
        // Ex: const perguntas = [{ "texto": "...", "tipo": "TEXTO", "obrigatoria": true }]

        const dto = {
            titulo: titulo,
            descricao: descricao,
            perguntas: perguntas
        };

        try {
            if (modoEdicao) {
                await editarPesquisa(pesquisaId, dto);
                alert('Pesquisa atualizada com sucesso!');
            } else {
                await criarPesquisa(dto);
                alert('Pesquisa criada com sucesso!');
            }
            window.location.href = 'criacaoDePesquisasADM.html';

        } catch (error) {
            console.error('Erro ao salvar pesquisa:', error);
            alert('Falha ao salvar a pesquisa.');
        }
    });
});