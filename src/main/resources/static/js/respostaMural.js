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

    // Elementos da tela
    const elTexto = document.getElementById('sugestao-texto');
    const elAutor = document.getElementById('sugestao-autor');
    const elData = document.getElementById('sugestao-data');
    const elLista = document.getElementById('lista-comentarios');
    const elInput = document.getElementById('comentario-input');
    const btnEnviar = document.getElementById('btn-enviar');

    // Carregar Sugestão (Topo)
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

    // Carregar Comentários (Meio)
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

                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong style="color: #387CC8;">${c.nomeAutor || 'Usuário'}</strong>
                        <span style="font-size: 0.8em; color: #888;">${dataFmt}</span>
                    </div>
                    <div style="color: #333;">${c.texto}</div>
                `;
                elLista.appendChild(div);
            });
        } catch (e) {
            console.error('Erro comentários:', e);
        }
    }

    await carregarComentarios();

    // Enviar Comentário (Fundo)
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