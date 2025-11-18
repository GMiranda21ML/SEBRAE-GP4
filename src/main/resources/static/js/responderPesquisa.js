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

    function renderizarPesquisa(pesquisa) {
        surveyTitleEl.textContent = pesquisa.titulo || 'Pesquisa sem Título';
        formEl.innerHTML = '';
        pesquisa.perguntas.forEach((pergunta, index) => {
            const questionWrapper = document.createElement('div');
            questionWrapper.className = 'question-item';

            questionWrapper.innerHTML = `
                <div class="question-header">
                    <h4 class="question-title">
                        Pergunta ${index + 1}: ${pergunta.texto}
                        ${pergunta.obrigatoria ? '<span class="mandatory-star">*</span>' : ''}
                    </h4>
                </div>
                <div class="question-response-area" data-pergunta-id="${pergunta.id}" data-tipo="${pergunta.tipo}" data-obrigatoria="${pergunta.obrigatoria}">
                </div>
            `;

            const responseArea = questionWrapper.querySelector('.question-response-area');

            switch (pergunta.tipo) {
                case 'TEXTO':
                    responseArea.innerHTML = `
                        <textarea class="answer-textarea" placeholder="Escreva aqui..." ${pergunta.obrigatoria ? 'required' : ''}></textarea>
                    `;
                    break;
                case 'SIM_NAO':
                    responseArea.innerHTML = `
                        <div class="option-list">
                            <label class="option-item">
                                <input type="radio" name="pergunta_${pergunta.id}" value="Sim" ${pergunta.obrigatoria ? 'required' : ''}>
                                <span>Sim</span>
                            </label>
                            <label class="option-item">
                                <input type="radio" name="pergunta_${pergunta.id}" value="Não">
                                <span>Não</span>
                            </label>
                        </div>
                    `;
                    break;
                case 'MULTIPLA_ESCOLHA':
                    const optionsHtml = pergunta.opcoes.map(opcao => `
                        <label class="option-item">
                            <input type="radio" name="pergunta_${pergunta.id}" value="${opcao}" ${pergunta.obrigatoria ? 'required' : ''}>
                            <span>${opcao}</span>
                        </label>
                    `).join('');
                    responseArea.innerHTML = `<div class="option-list">${optionsHtml}</div>`;
                    break;
            }
            formEl.appendChild(questionWrapper);
        });
    }

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
                            const textarea = area.querySelector('.answer-textarea');
                            if (textarea) textarea.value = respostaTexto;
                        } else if (tipo === 'SIM_NAO' || tipo === 'MULTIPLA_ESCOLHA') {
                            const optionInput = area.querySelector(`input[value="${respostaTexto}"]`);
                            if (optionInput) optionInput.checked = true;
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('Erro ao carregar respostas.', error);
        }
    }

    function alternarModoEdicao(habilitar) {
        const inputs = formEl.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.disabled = !habilitar;
        });

        if (habilitar) {
            enviarBtn.style.display = 'block';
            editarBtn.style.display = 'none';
        } else {
            enviarBtn.style.display = 'none';
            editarBtn.style.display = 'block';
        }
    }

    async function carregarPesquisa() {
        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            renderizarPesquisa(pesquisa);
            await carregarMinhasRespostas(pesquisaId);

            if (mode === 'view') {
                alternarModoEdicao(false);
            } else {
                alternarModoEdicao(true);
            }

        } catch (error) {
            console.error('Erro ao carregar pesquisa:', error);
            alert('Não foi possível carregar a pesquisa.');
            window.location.href = 'visualizacaoDoMuralUsuario.html';
        }
    }

    if (editarBtn) {
        editarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alternarModoEdicao(true);
        });
    }

    enviarBtn.addEventListener('click', async () => {
        if (!formEl.checkValidity()) {
            alert('Por favor, responda todas as perguntas obrigatórias (*).');
            formEl.reportValidity();
            return;
        }

        const respostas = [];
        const responseAreas = formEl.querySelectorAll('.question-response-area');

        responseAreas.forEach(area => {
            const id = area.dataset.perguntaId;
            const tipo = area.dataset.tipo;
            let resposta = null;

            switch (tipo) {
                case 'TEXTO':
                    resposta = area.querySelector('.answer-textarea').value;
                    break;
                case 'SIM_NAO':
                case 'MULTIPLA_ESCOLHA':
                    const checkedOption = area.querySelector(`input[name="pergunta_${id}"]:checked`);
                    if (checkedOption) {
                        resposta = checkedOption.value;
                    }
                    break;
            }
            respostas.push({ perguntaId: id, resposta: resposta });
        });

        const dto = { respostas: respostas };

        try {
            await submeterRespostas(dto);
            alert('Respostas salvas com sucesso!');

            if (mode === 'view') {
                 window.location.href = 'minhasRespostas.html';
            } else {
                 window.location.href = 'visualizacaoDoMuralUsuario.html';
            }

        } catch (error) {
            console.error('Erro ao enviar respostas:', error);
            alert('Houve um erro ao enviar sua resposta. Tente novamente.');
        }
    });

    voltarBtn.addEventListener('click', () => {
        window.history.back();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'paginaLogin.html';
    });

    carregarPesquisa();
});