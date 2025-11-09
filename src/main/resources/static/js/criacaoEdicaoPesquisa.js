document.addEventListener('DOMContentLoaded', async () => {

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

    const titleInput = document.querySelector('.title-input');
    const summaryTextarea = document.querySelector('.summary-textarea');
    const saveBtn = document.querySelector('.save-btn');
    const backBtn = document.getElementById('back-btn');

    const formBody = document.querySelector('.form-body');
    const addTextoBtn = document.getElementById('add-texto-btn');
    const addSimNaoBtn = document.getElementById('add-simnao-btn');
    const addMultiplaBtn = document.getElementById('add-multipla-btn');

    const emailToggle = document.getElementById('email-toggle');
    const smsToggle = document.getElementById('sms-toggle');
    const whatsappToggle = document.getElementById('whatsapp-toggle');

    const urlParams = new URLSearchParams(window.location.search);
    const pesquisaId = urlParams.get('id');
    let modoEdicao = pesquisaId != null;

    if (modoEdicao) {
        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            titleInput.value = pesquisa.titulo;
            summaryTextarea.value = pesquisa.descricao;

            if (pesquisa.meiosEnvio) {
                emailToggle.checked = pesquisa.meiosEnvio.email || false;
                smsToggle.checked = pesquisa.meiosEnvio.sms || false;
                whatsappToggle.checked = pesquisa.meiosEnvio.whatsapp || false;
            }

            if (pesquisa.perguntas && pesquisa.perguntas.length > 0) {
                pesquisa.perguntas.forEach(pergunta => {
                    if (pergunta.tipo === 'TEXTO') {
                        criarPerguntaTexto(pergunta);
                    } else if (pergunta.tipo === 'SIM_NAO') {
                        criarPerguntaSimNao(pergunta);
                    } else if (pergunta.tipo === 'MULTIPLA_ESCOLHA') {
                        criarPerguntaMultiplaEscolha(pergunta);
                    }
                });
            }

        } catch (error) {
            console.error('Erro ao carregar dados da pesquisa:', error);
            alert('Não foi possível carregar a pesquisa para edição.');
            modoEdicao = false;
        }
    }

    function criarBlocoBase(tipo, perguntaData = {}) {
        const block = document.createElement('div');
        block.className = 'question-block';
        block.dataset.tipo = tipo;

        const titulo = perguntaData.texto || '';
        const obrigatoria = perguntaData.obrigatoria || false;

        block.innerHTML = `
            <input type="text" class="question-title-input" placeholder="Digite sua pergunta aqui..." value="${titulo}">

            <div class="answer-placeholder">
                </div>

            <div class="question-controls">
                <div class="toggle-item">
                    <label class="switch">
                        <input type="checkbox" class="obrigatoria-toggle" ${obrigatoria ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Obrigatória</span>
                </div>

                <button class="delete-question-btn" title="Excluir Pergunta">✖</button>
            </div>
        `;
        return block;
    }

    function criarPerguntaTexto(perguntaData = {}) {
        const block = criarBlocoBase('TEXTO', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');
        placeholder.innerHTML = `
            <input type="text" placeholder="Resposta" disabled>
        `;
        formBody.appendChild(block);
    }

    function criarPerguntaSimNao(perguntaData = {}) {
        const block = criarBlocoBase('SIM_NAO', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');
        placeholder.innerHTML = `
            <div class="answer-options-list">
                <div class="option-item">
                    <input type="radio" name="simnao_${Date.now()}" disabled>
                    <label>Sim</label>
                </div>
                <div class="option-item">
                    <input type="radio" name="simnao_${Date.now()}" disabled>
                    <label>Não</label>
                </div>
            </div>
        `;
        formBody.appendChild(block);
    }

    function criarPerguntaMultiplaEscolha(perguntaData = {}) {
        const block = criarBlocoBase('MULTIPLA_ESCOLHA', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');
        placeholder.innerHTML = `
            <div class="answer-options-list">
                </div>
            <button class="add-option-btn">+ Adicionar Opção</button>
        `;

        const optionsList = placeholder.querySelector('.answer-options-list');

        if (perguntaData.opcoes && perguntaData.opcoes.length > 0) {
            perguntaData.opcoes.forEach(opcaoTexto => {
                adicionarOpcaoEditavel(optionsList, opcaoTexto);
            });
        } else {
            adicionarOpcaoEditavel(optionsList);
        }

        formBody.appendChild(block);
    }

    function adicionarOpcaoEditavel(optionsList, texto = '') {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <input type="radio" name="multi_${Date.now()}" disabled>
            <input type="text" class="option-text-input" placeholder="Opção" value="${texto}">
            <button class="remove-option-btn" title="Remover Opção">✖</button>
        `;
        optionsList.appendChild(optionItem);
    }


    if (addTextoBtn) {
        addTextoBtn.addEventListener('click', () => criarPerguntaTexto());
    }
    if (addSimNaoBtn) {
        addSimNaoBtn.addEventListener('click', () => criarPerguntaSimNao());
    }
    if (addMultiplaBtn) {
        addMultiplaBtn.addEventListener('click', () => criarPerguntaMultiplaEscolha());
    }

    formBody.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('delete-question-btn')) {
            target.closest('.question-block').remove();
        }

        if (target.classList.contains('add-option-btn')) {
            const optionsList = target.previousElementSibling;
            adicionarOpcaoEditavel(optionsList);
        }

        if (target.classList.contains('remove-option-btn')) {
            target.closest('.option-item').remove();
        }
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'criacaoDePesquisasADM.html';
        });
    }

    saveBtn.addEventListener('click', async () => {
        const titulo = titleInput.value;
        const descricao = summaryTextarea.value;

        const perguntas = [];
        const questionBlocks = document.querySelectorAll('.question-block');

        questionBlocks.forEach(block => {
            const texto = block.querySelector('.question-title-input').value;
            const tipo = block.dataset.tipo;
            const obrigatoria = block.querySelector('.obrigatoria-toggle').checked;

            if (!texto) return;

            const pergunta = {
                texto: texto,
                tipo: tipo,
                obrigatoria: obrigatoria
            };

            if (tipo === 'MULTIPLA_ESCOLHA') {
                const opcoes = [];
                const optionInputs = block.querySelectorAll('.option-text-input');

                optionInputs.forEach(input => {
                    if (input.value) {
                        opcoes.push(input.value);
                    }
                });

                pergunta.opcoes = opcoes;
            }

            perguntas.push(pergunta);
        });

        const dto = {
            titulo: titulo,
            descricao: descricao,
            perguntas: perguntas,
            meiosEnvio: {
                email: emailToggle.checked,
                sms: smsToggle.checked,
                whatsapp: whatsappToggle.checked
            }
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