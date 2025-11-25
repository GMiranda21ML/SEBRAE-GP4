document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pesquisaId = urlParams.get('id');
    const mode = urlParams.get('mode');

    if (!pesquisaId) {
        alert('ID da pesquisa não encontrado.');
        window.location.href = 'visualizacaoDoMuralUsuario.html';
        return;
    }

    const surveyTitleEl = document.getElementById('survey-title');
    const formEl = document.getElementById('response-form');
    const enviarBtn = document.getElementById('enviar-btn');
    const editarBtn = document.getElementById('editar-btn');
    const voltarBtn = document.getElementById('voltar-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    // --- Renderização ---
    function renderizarPesquisa(pesquisa) {
        if(surveyTitleEl) surveyTitleEl.textContent = pesquisa.titulo || 'Pesquisa';
        formEl.innerHTML = '';

        // Verificação de segurança
        if (!pesquisa.perguntas || pesquisa.perguntas.length === 0) {
            formEl.innerHTML = '<p style="text-align:center; padding:20px;">Esta pesquisa não possui perguntas cadastradas.</p>';
            if(enviarBtn) enviarBtn.style.display = 'none';
            return;
        }

        pesquisa.perguntas.forEach((pergunta, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'question-wrapper';

            const questionCard = `
                <div class="question-card">
                    <p class="question-text">
                        <strong>Pergunta ${index + 1}:</strong> ${pergunta.texto}
                        ${pergunta.obrigatoria ? '<span class="mandatory">*</span>' : ''}
                    </p>
                </div>
            `;

            let answerArea = '';

            if (pergunta.tipo === 'TEXTO') {
                // ALTERAÇÃO: Usando textarea em vez de input text
                answerArea = `
                    <div class="text-answer-container question-response-area"
                         data-pergunta-id="${pergunta.id}" data-tipo="TEXTO">
                        <textarea class="answer-textarea" rows="1" placeholder="Escreva aqui..." ${pergunta.obrigatoria ? 'required' : ''}></textarea>
                    </div>
                `;
            }
            else if (pergunta.tipo === 'SIM_NAO') {
                answerArea = `
                    <div class="options-card question-response-area"
                         data-pergunta-id="${pergunta.id}" data-tipo="SIM_NAO">
                        <label class="option-item">
                            <input type="radio" name="pergunta_${pergunta.id}" value="Sim" ${pergunta.obrigatoria ? 'required' : ''}>
                            Sim
                        </label>
                        <label class="option-item">
                            <input type="radio" name="pergunta_${pergunta.id}" value="Não">
                            Não
                        </label>
                    </div>
                `;
            }
            else if (pergunta.tipo === 'MULTIPLA_ESCOLHA') {
                const opcoes = pergunta.opcoes || [];
                const opcoesHtml = opcoes.map(op => `
                    <label class="option-item">
                        <input type="radio" name="pergunta_${pergunta.id}" value="${op}" ${pergunta.obrigatoria ? 'required' : ''}>
                        ${op}
                    </label>
                `).join('');

                answerArea = `
                    <div class="options-card question-response-area"
                         data-pergunta-id="${pergunta.id}" data-tipo="MULTIPLA_ESCOLHA">
                        ${opcoesHtml}
                    </div>
                `;
            }

            wrapper.innerHTML = questionCard + answerArea;
            formEl.appendChild(wrapper);
        });
    }

    // --- Carregar Respostas Antigas ---
    async function carregarMinhasRespostas(pesquisaId) {
        try {
            const minhasRespostas = await getMyRespostasPorPesquisa(pesquisaId);
            if (minhasRespostas && minhasRespostas.length > 0) {
                const respostasMap = new Map();
                minhasRespostas.forEach(r => {
                    const pId = r.perguntaId || (r.pergunta ? r.pergunta.id : null);
                    if(pId) respostasMap.set(pId, r.respostaTexto);
                });

                const responseAreas = formEl.querySelectorAll('.question-response-area');
                responseAreas.forEach(area => {
                    const id = area.dataset.perguntaId;
                    const tipo = area.dataset.tipo;

                    if (respostasMap.has(id)) {
                        const respostaTexto = respostasMap.get(id);
                        if (tipo === 'TEXTO') {
                            // Busca textarea ou input (retrocompatibilidade)
                            const input = area.querySelector('textarea') || area.querySelector('input');
                            if (input) {
                                input.value = respostaTexto;
                                // Ajusta a altura se for textarea
                                input.style.height = 'auto';
                                input.style.height = (input.scrollHeight) + 'px';
                            }
                        } else {
                            const optionInput = area.querySelector(`input[value="${respostaTexto.replace(/"/g, '\\"')}"]`);
                            if (optionInput) optionInput.checked = true;
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('Sem respostas anteriores ou erro ao carregar:', error);
        }
    }

    function alternarModoEdicao(habilitar) {
        const inputs = formEl.querySelectorAll('input, textarea');
        inputs.forEach(input => input.disabled = !habilitar);

        if (habilitar) {
            if(enviarBtn) enviarBtn.style.display = 'block';
            if(editarBtn) editarBtn.style.display = 'none';
        } else {
            if(enviarBtn) enviarBtn.style.display = 'none';
            if(editarBtn) editarBtn.style.display = 'block';
        }
    }

    async function carregarPesquisa() {
        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            renderizarPesquisa(pesquisa);

            if (mode === 'view') {
                await carregarMinhasRespostas(pesquisaId);
                alternarModoEdicao(false);
            } else {
                await carregarMinhasRespostas(pesquisaId);
                alternarModoEdicao(true);
            }

        } catch (error) {
            console.error('Erro ao carregar:', error);
            alert('Não foi possível carregar a pesquisa. Verifique o console (F12) para mais detalhes.');
            window.location.href = 'visualizacaoDoMuralUsuario.html';
        }
    }

    // --- Enviar ---
    if (enviarBtn) {
        enviarBtn.addEventListener('click', async () => {
            if (!formEl.checkValidity()) {
                alert('Por favor, responda todas as perguntas obrigatórias.');
                formEl.reportValidity();
                return;
            }

            const respostas = [];
            const responseAreas = formEl.querySelectorAll('.question-response-area');

            responseAreas.forEach(area => {
                const id = area.dataset.perguntaId;
                const tipo = area.dataset.tipo;
                let resposta = null;

                if (tipo === 'TEXTO') {
                    const input = area.querySelector('textarea') || area.querySelector('input');
                    resposta = input ? input.value : null;
                } else {
                    const checked = area.querySelector(`input[name="pergunta_${id}"]:checked`);
                    if (checked) resposta = checked.value;
                }

                if(resposta) {
                    respostas.push({ perguntaId: id, resposta: resposta });
                }
            });

            const dto = { respostas: respostas };

            try {
                await submeterRespostas(dto);
                alert('Respostas enviadas com sucesso!');
                window.location.href = 'visualizacaoDoMuralUsuario.html';
            } catch (error) {
                console.error('Erro ao enviar:', error);
                alert('Erro ao enviar resposta. Tente novamente.');
            }
        });
    }

    if(editarBtn) {
        editarBtn.addEventListener('click', () => alternarModoEdicao(true));
    }

    if(voltarBtn) {
        voltarBtn.addEventListener('click', () => window.history.back());
    }

    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'paginaLogin.html';
        });
    }

    formEl.addEventListener('input', (e) => {
        if (e.target.classList.contains('answer-textarea')) {
            e.target.style.height = 'auto';
            e.target.style.height = (e.target.scrollHeight) + 'px';
        }
    });

    carregarPesquisa();
});