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
                const likeText = jaCurtiu ? 'Curtiu' : 'Curtir';
                const btnColor = jaCurtiu ? '#387CC8' : '#e0e0e0';
                const btnTextColor = jaCurtiu ? 'white' : '#333';

                const card = document.createElement('div');
                card.className = 'data-block';

                card.style.height = 'auto';
                card.style.minHeight = '140px';
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
                            <p style="margin: 0; font-size: 1.1em; color: #333; line-height: 1.5; white-space: pre-wrap; font-weight: 500;">${sugestao.texto}</p>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 15px; font-size: 0.85em; color: #666;">
                            <span style="margin-right: 5px;">Postado por <strong>${sugestao.nomeAutor || 'Anônimo'}</strong></span>
                            <span style="margin: 0 5px;">•</span>
                            <span>${dataFormatada}</span>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; display: flex; align-items: center;">
                        <button class="like-btn" data-id="${sugestao.id}"
                                style="background-color: ${btnColor}; color: ${btnTextColor}; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: 0.2s; display: flex; align-items: center; gap: 8px;">
                            <span>👍</span> <span>${likeText}</span>
                            <span style="background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px; font-size: 0.9em;">${sugestao.totalCurtidas}</span>
                        </button>
                    </div>
                `;

                container.appendChild(card);
            });
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
                const likeText = jaCurtiu ? 'Curtiu' : 'Curtir';
                const btnColor = jaCurtiu ? '#387CC8' : '#e0e0e0';
                const btnTextColor = jaCurtiu ? 'white' : '#333';

                const card = document.createElement('div');
                card.className = 'data-block';

                card.style.height = 'auto';
                card.style.minHeight = '140px';
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
                            <p style="margin: 0; font-size: 1.1em; color: #333; line-height: 1.5; white-space: pre-wrap; font-weight: 500;">${sugestao.texto}</p>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 15px; font-size: 0.85em; color: #666;">
                            <span style="margin-right: 5px;">Postado por <strong>u/${sugestao.nomeAutor || 'Anônimo'}</strong></span>
                            <span style="margin: 0 5px;">•</span>
                            <span>${dataFormatada}</span>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; display: flex; align-items: center;">
                        <button class="like-btn" data-id="${sugestao.id}"
                                style="background-color: ${btnColor}; color: ${btnTextColor}; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: 0.2s; display: flex; align-items: center; gap: 8px;">
                            <span>👍</span> <span>${likeText}</span>
                            <span style="background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px; font-size: 0.9em;">${sugestao.totalCurtidas}</span>
                        </button>
                    </div>
                `;

                container.appendChild(card);
            });

            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    btn.disabled = true;
                    const id = btn.getAttribute('data-id');
                    try {
                        await votarSugestao(id);
                        await carregarDados();
                    } catch (error) {
                        console.error('Erro ao curtir:', error);
                        alert('Erro ao computar voto.');
                        btn.disabled = false;
                    }
                });
            });
        }
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    btn.disabled = true;
                    const id = btn.getAttribute('data-id');
                    try {
                        await votarSugestao(id);
                        await carregarDados();
                    } catch (error) {
                        console.error('Erro ao curtir:', error);
                        alert('Erro ao computar voto.');
                        btn.disabled = false;
                    }
                });
            });
        }

    async function carregarDados() {
        try {
            const sugestoes = await getSugestoes();
            renderizarMural(sugestoes);
        } catch (error) {
            console.error('Erro ao carregar mural:', error);
            container.innerHTML = '<p style="text-align: center; color: #d9534f;">Erro ao carregar dados. Verifique sua conexão ou faça login novamente.</p>';
        }
    }

    if (btnPublicar) {
        btnPublicar.addEventListener('click', async () => {
            const texto = inputComentario.value;
            if (!texto.trim()) {
                alert('O comentário não pode estar vazio.');
                return;
            }

            btnPublicar.disabled = true;
            btnPublicar.textContent = 'Enviando...';

            try {
                await criarSugestao(texto);
                inputComentario.value = '';
                await carregarDados();
            } catch (error) {
                console.error('Erro ao publicar:', error);
                alert('Erro ao publicar comentário.');
            } finally {
                btnPublicar.disabled = false;
                btnPublicar.textContent = 'Publicar';
            }
        });
    }

    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.data-block');
            let encontrou = false;

            cards.forEach(card => {
                const texto = card.innerText.toLowerCase();
                if (texto.includes(termo)) {
                    card.style.display = 'flex';
                    encontrou = true;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    carregarDados();
});