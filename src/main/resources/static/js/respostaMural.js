document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'paginaLogin.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sugestaoId = urlParams.get('id');

    if (!sugestaoId) {
        alert('Erro: Sugestão não encontrada.');
        window.location.href = 'muralADM.html';
        return;
    }

    const elTexto = document.getElementById('sugestao-texto');
    const elAutor = document.getElementById('sugestao-autor');
    const elData = document.getElementById('sugestao-data');
    const elLista = document.getElementById('lista-comentarios');
    const elInput = document.getElementById('comentario-input');
    const btnEnviar = document.getElementById('btn-enviar');

    try {
        const sugestao = await getSugestaoPorId(sugestaoId);
        elTexto.textContent = sugestao.texto;
        elAutor.textContent = sugestao.nomeAutor || 'Anônimo';
        if(sugestao.dataCriacao) {
            const d = new Date(sugestao.dataCriacao);
            elData.textContent = d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
        }
    } catch (e) {
        console.error(e);
        elTexto.textContent = 'Erro ao carregar sugestão.';
    }

    async function carregarComentarios() {
        try {
            const comentarios = await getComentarios(sugestaoId);
            elLista.innerHTML = '';

            if (!comentarios || comentarios.length === 0) {
                elLista.innerHTML = '<p style="color: #999; font-style: italic; text-align:center;">Seja o primeiro a comentar!</p>';
                return;
            }

            comentarios.forEach(c => {
                const div = document.createElement('div');
                div.className = 'comment-item';

                let dataFmt = '';
                if(c.dataCriacao) {
                    const dc = new Date(c.dataCriacao);
                    dataFmt = dc.toLocaleDateString() + ' ' + dc.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }

                const adminBadge = c.autorIsAdmin
                    ? '<span style="margin-left:8px; background-color:#387CC8; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; vertical-align:middle; font-weight:bold;" title="Administrador">ADM</span>'
                    : '';

                let botoesAcao = '';
                if (c.isAutor) {
                    botoesAcao = `
                        <div style="margin-top: 10px; display: flex; gap: 10px; font-size: 0.9em;">
                            <button class="btn-editar-comentario" data-id="${c.id}" data-texto="${c.texto.replace(/"/g, '&quot;')}" style="background: none; border: none; color: #387CC8; cursor: pointer; text-decoration: underline;">Editar</button>
                            <button class="btn-deletar-comentario" data-id="${c.id}" style="background: none; border: none; color: #ff4d4d; cursor: pointer; text-decoration: underline;">Excluir</button>
                        </div>
                    `;
                }

                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <div>
                            <strong style="color: #387CC8;">${c.nomeAutor || 'Usuário'}</strong>
                            ${adminBadge}
                        </div>
                        <span style="font-size: 0.8em; color: #888;">${dataFmt}</span>
                    </div>
                    <div style="color: #333; white-space: pre-wrap;">${c.texto}</div>
                    ${botoesAcao}
                `;
                elLista.appendChild(div);
            });

            document.querySelectorAll('.btn-deletar-comentario').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm('Deseja realmente excluir este comentário?')) {
                        try {
                            await deletarComentario(e.target.dataset.id);
                            carregarComentarios();
                        } catch(err) {
                            alert('Erro ao excluir.');
                            console.error(err);
                        }
                    }
                });
            });

            document.querySelectorAll('.btn-editar-comentario').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const novoTexto = prompt("Edite seu comentário:", e.target.dataset.texto);
                    if(novoTexto !== null && novoTexto.trim() !== "") {
                        try {
                            await editarComentario(e.target.dataset.id, novoTexto);
                            carregarComentarios();
                        } catch(err) {
                            alert('Erro ao editar.');
                            console.error(err);
                        }
                    }
                });
            });

        } catch (e) {
            console.error('Erro comentários:', e);
        }
    }

    await carregarComentarios();

    btnEnviar.addEventListener('click', async () => {
        const texto = elInput.value.trim();
        if (!texto) return;

        btnEnviar.disabled = true;
        btnEnviar.textContent = '...';

        try {
            await criarComentario(sugestaoId, texto);
            elInput.value = '';
            await carregarComentarios();
        } catch (e) {
            alert('Erro ao enviar comentário.');
            console.error(e);
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar';
        }
    });
});