document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('mural-container');
    const inputComentario = document.getElementById('novo-comentario-input');
    const btnPublicar = document.getElementById('btn-publicar');
    const filtroInput = document.getElementById('filtro-mural');

    function renderizarMural(listaSugestoes) {
        container.innerHTML = '';

        if (!listaSugestoes || listaSugestoes.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Nenhum comentário encontrado.</p>';
            return;
        }

        listaSugestoes.forEach(sugestao => {
            let dataFormatada = 'Data desconhecida';
            if (sugestao.dataCriacao) {
                const dataObj = new Date(sugestao.dataCriacao);
                dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            }

            const jaCurtiu = sugestao.curtiu;
            const btnColor = jaCurtiu ? '#387CC8' : '#f0f0f0';
            const btnTextColor = jaCurtiu ? 'white' : '#333';
            const likeText = jaCurtiu ? 'Curtiu' : 'Curtir';

            const card = document.createElement('div');
            card.className = 'data-block';

            // Estilos do Card
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'space-between';
            card.style.padding = '20px';
            card.style.backgroundColor = '#f7f7f7';
            card.style.borderRadius = '8px';
            card.style.marginBottom = '15px';
            card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';

            card.innerHTML = `
                <div class="data-details">
                    <div style="margin-bottom: 12px;">
                        <h4 style="margin: 0 0 5px 0; font-size: 1.1em; color: #333; font-weight: bold;">${sugestao.texto}</h4>
                    </div>

                    <div style="display: flex; align-items: center; margin-bottom: 15px; font-size: 0.85em; color: #666;">
                        <span style="margin-right: 5px;">Postado por <strong>${sugestao.nomeAutor || 'Anônimo'}</strong></span>
                        <span style="margin: 0 5px;">•</span>
                        <span>${dataFormatada}</span>
                    </div>
                </div>

                <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; display: flex; align-items: center; gap: 10px;">
                    <button class="like-btn" data-id="${sugestao.id}"
                            style="background-color: ${btnColor}; color: ${btnTextColor}; border: 1px solid #ddd; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                        <span>👍</span> ${likeText} <span style="background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px; font-size: 0.9em; margin-left: 5px;">${sugestao.totalCurtidas}</span>
                    </button>

                    <button class="comment-btn" data-id="${sugestao.id}"
                            style="background-color: #e0e0e0; color: #333; border: 1px solid #ddd; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                        <span>💬</span> Comentários
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

        // Configurar evento de clique nos botões
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                try {
                    await votarSugestao(id);
                    await carregarDados();
                } catch (error) {
                    console.error('Erro ao curtir:', error);
                }
            });
        });

        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                // Redireciona para a página de resposta com o ID da sugestão
                window.location.href = `respostaMural.html?id=${id}`;
            });
        });
    }

    async function carregarDados() {
        try {
            const sugestoes = await getSugestoes();
            renderizarMural(sugestoes);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    if (btnPublicar) {
        btnPublicar.addEventListener('click', async () => {
            const texto = inputComentario.value;
            if (!texto.trim()) { alert('Escreva algo!'); return; }
            await criarSugestao(texto);
            inputComentario.value = '';
            await carregarDados();
        });
    }

    // Filtro simples
    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            document.querySelectorAll('.data-block').forEach(card => {
                card.style.display = card.innerText.toLowerCase().includes(termo) ? 'flex' : 'none';
            });
        });
    }

    carregarDados();
});