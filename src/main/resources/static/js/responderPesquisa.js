document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pesquisaId = urlParams.get('id');

    if (!pesquisaId) {
        alert('ID da pesquisa não encontrado.');
        window.location.href = 'visualizacaoDoMuralUsuario.html';
        return;
    }

    const surveyTitleEl = document.getElementById('survey-title');
    const formEl = document.getElementById('response-form');
    const enviarBtn = document.getElementById('enviar-btn');
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

    async function carregarPesquisa() {
        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            renderizarPesquisa(pesquisa);
        } catch (error) {
            console.error('Erro ao carregar pesquisa:', error);
            alert('Não foi possível carregar a pesquisa. Você será redirecionado.');
            window.location.href = 'visualizacaoDoMuralUsuario.html';
        }
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

            respostas.push({
                perguntaId: id,
                resposta: resposta
            });
        });

        const dto = {
            respostas: respostas
        };

        try {
            await submeterRespostas(pesquisaId, dto);
            alert('Pesquisa respondida com sucesso!');
            window.location.href = 'visualizacaoDoMuralUsuario.html';
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
        alert('Você foi desconectado.');
        window.location.href = 'paginaLogin.html';
    });

    carregarPesquisa();
});