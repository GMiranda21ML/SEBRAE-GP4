document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('mural-container');
    const filtroInput = document.getElementById('filtro-mural');

    const btnPublicar = document.getElementById('btn-publicar');
    const inputPublicar = document.getElementById('novo-comentario-input');

    if (btnPublicar && inputPublicar) {
        btnPublicar.addEventListener('click', async () => {
            const texto = inputPublicar.value;

            if (!texto || !texto.trim()) {
                alert('Por favor, escreva um comentário ou sugestão antes de publicar.');
                return;
            }

            btnPublicar.disabled = true;
            btnPublicar.textContent = 'Enviando...';

            try {
                await criarSugestao(texto);
                alert('Sugestão publicada com sucesso!');
                inputPublicar.value = '';
                await carregarDados();
            } catch (error) {
                console.error('Erro ao publicar:', error);
                alert('Ocorreu um erro ao enviar sua sugestão. Tente novamente.');
            } finally {
                btnPublicar.disabled = false;
                btnPublicar.textContent = 'Publicar';
            }
        });
    }

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

            const badgeAdmin = sugestao.respondidaPorAdmin
                ? `<div style="margin-bottom: 8px;">
                     <span style="background-color: #d1e7dd; color: #0f5132; padding: 4px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold; border: 1px solid #badbcc;">
                        ✓ Respondida por administrador
                     </span>
                   </div>`
                : '';

            let acoesAutor = '';
            if (sugestao.isAutor) {
                acoesAutor = `
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button class="btn-editar-sugestao" data-id="${sugestao.id}" data-texto="${sugestao.texto.replace(/"/g, '&quot;')}"
                                style="background: none; border: none; color: #387CC8; cursor: pointer; text-decoration: underline; font-size: 0.9em;">Editar</button>
                        <button class="btn-deletar-sugestao" data-id="${sugestao.id}"
                                style="background: none; border: none; color: #ff4d4d; cursor: pointer; text-decoration: underline; font-size: 0.9em;">Excluir</button>
                    </div>
                `;
            }

            const card = document.createElement('div');
            card.className = 'data-block';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'space-between';
            card.style.padding = '20px';
            card.style.backgroundColor = '#f7f7f7';
            card.style.borderRadius = '8px';
            card.style.marginBottom = '15px';
            card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            card.style.height = 'auto';
            card.style.minHeight = '140px';

            card.innerHTML = `
                <div class="data-details">
                    ${badgeAdmin}

                    <div style="margin-bottom: 12px;">
                        <h4 style="margin: 0 0 5px 0; font-size: 1.1em; color: #333; font-weight: bold;">${sugestao.texto}</h4>
                    </div>

                    <div style="display: flex; align-items: center; margin-bottom: 5px; font-size: 0.85em; color: #666;">
                        <span style="margin-right: 5px;">Postado por <strong>${sugestao.nomeAutor || 'Anônimo'}</strong></span>
                        <span style="margin: 0 5px;">•</span>
                        <span>${dataFormatada}</span>
                    </div>
                    ${acoesAutor}
                </div>

                <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 10px; display: flex; align-items: center; gap: 10px;">
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
                window.location.href = `respostaMural.html?id=${id}`;
            });
        });

        document.querySelectorAll('.btn-editar-sugestao').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const textoAtual = e.target.dataset.texto;
                const novoTexto = prompt("Edite sua sugestão:", textoAtual);

                if (novoTexto !== null && novoTexto.trim() !== "") {
                    try {
                        await editarSugestao(id, novoTexto);
                        alert("Sugestão atualizada!");
                        carregarDados();
                    } catch (err) {
                        console.error(err);
                        alert("Erro ao editar sugestão.");
                    }
                }
            });
        });

        document.querySelectorAll('.btn-deletar-sugestao').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm("Tem certeza que deseja excluir esta sugestão?")) {
                    try {
                        await deletarSugestao(e.target.dataset.id);
                        alert("Sugestão excluída.");
                        carregarDados();
                    } catch (err) {
                        console.error(err);
                        alert("Erro ao excluir sugestão.");
                    }
                }
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