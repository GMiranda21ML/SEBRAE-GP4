document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Você não está autenticado.');
        window.location.href = 'paginaLogin.html';
        return;
    }

    // --- Elementos do DOM ---
    const titleInput = document.querySelector('.title-input');
    const summaryTextarea = document.querySelector('.summary-textarea');
    const saveBtn = document.querySelector('.save-btn');

    const formBody = document.querySelector('.form-body');
    const addTextoBtn = document.getElementById('add-texto-btn');
    const addSimNaoBtn = document.getElementById('add-simnao-btn');
    const addMultiplaBtn = document.getElementById('add-multipla-btn');

    const emailToggle = document.getElementById('email-toggle');
    const smsToggle = document.getElementById('sms-toggle');
    const whatsappToggle = document.getElementById('whatsapp-toggle');

    // --- Carregamento para Edição ---
    const urlParams = new URLSearchParams(window.location.search);
    const pesquisaId = urlParams.get('id');
    let modoEdicao = pesquisaId != null;

    if (modoEdicao) {
        try {
            const pesquisa = await getPesquisaPorId(pesquisaId);
            titleInput.value = pesquisa.titulo;
            summaryTextarea.value = pesquisa.descricao;

            // Carrega meios de envio
            if (pesquisa.meiosEnvio) {
                if(emailToggle) emailToggle.checked = pesquisa.meiosEnvio.email || false;
                if(smsToggle) smsToggle.checked = pesquisa.meiosEnvio.sms || false;
                if(whatsappToggle) whatsappToggle.checked = pesquisa.meiosEnvio.whatsapp || false;
            }

            if (pesquisa.perguntas && pesquisa.perguntas.length > 0) {
                pesquisa.perguntas.forEach(pergunta => {
                    if (pergunta.tipo === 'TEXTO') criarPerguntaTexto(pergunta);
                    else if (pergunta.tipo === 'SIM_NAO') criarPerguntaSimNao(pergunta);
                    else if (pergunta.tipo === 'MULTIPLA_ESCOLHA') criarPerguntaMultiplaEscolha(pergunta);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar pesquisa.');
        }
    }

    // --- Funções de Criação de Perguntas (HTML Dinâmico) ---

    function criarBlocoBase(tipo, perguntaData = {}) {
        const block = document.createElement('div');
        block.className = 'question-block';
        block.dataset.tipo = tipo;

        const titulo = perguntaData.texto || '';
        const obrigatoria = perguntaData.obrigatoria || false;

        // HTML do Bloco: Input + Resposta + Controles (Toggle + Excluir)
        block.innerHTML = `
            <div class="question-header-actions">
                 <button class="delete-question-btn" title="Excluir">✖</button>
            </div>

            <input type="text" class="question-title-input" placeholder="Escreva sua pergunta aqui:" value="${titulo}">

            <div class="answer-placeholder">
                </div>

            <div class="question-footer">
                <div class="toggle-item">
                    <label class="switch">
                        <input type="checkbox" class="obrigatoria-toggle" ${obrigatoria ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Obrigatória</span>
                </div>
            </div>
        `;

        // Funcionalidade de Excluir
        block.querySelector('.delete-question-btn').addEventListener('click', () => {
            block.remove();
        });

        return block;
    }

    function criarPerguntaTexto(perguntaData = {}) {
        const block = criarBlocoBase('TEXTO', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');

        placeholder.innerHTML = `
            <div style="margin-top: 15px;">
                <span class="answer-line-label">Caixa de Resposta:</span>
                <div class="answer-line"></div>
            </div>
        `;
        formBody.appendChild(block);
    }

    function criarPerguntaSimNao(perguntaData = {}) {
        const block = criarBlocoBase('SIM_NAO', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');

        placeholder.innerHTML = `
            <div class="simnao-options">
                <label class="radio-label">
                    <span class="radio-circle"></span> Sim
                </label>
                <label class="radio-label">
                    <span class="radio-circle"></span> Não
                </label>
            </div>
        `;
        formBody.appendChild(block);
    }

    function criarPerguntaMultiplaEscolha(perguntaData = {}) {
        const block = criarBlocoBase('MULTIPLA_ESCOLHA', perguntaData);
        const placeholder = block.querySelector('.answer-placeholder');

        placeholder.innerHTML = `
            <div class="answer-options-list" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
            </div>
            <button class="add-option-btn" style="background:none; border:none; color: #ddd; cursor:pointer; font-size:13px; margin-top:5px;">+ Adicionar Opção</button>
        `;

        const optionsList = placeholder.querySelector('.answer-options-list');
        const addBtn = block.querySelector('.add-option-btn');

        const adicionarOpcao = (texto = '') => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '10px';

            item.innerHTML = `
                <span class="radio-circle" style="width: 15px; height: 15px;"></span>
                <input type="text" class="option-text-input" placeholder="Opção" value="${texto}"
                       style="background: transparent; border: none; border-bottom: 1px solid white; color: white; outline: none; flex-grow: 1;">
                <button class="remove-option-btn" style="background:none; border:none; color:#ffcccc; cursor:pointer;">✖</button>
            `;

            item.querySelector('.remove-option-btn').addEventListener('click', () => item.remove());
            optionsList.appendChild(item);
        };

        if (perguntaData.opcoes && perguntaData.opcoes.length > 0) {
            perguntaData.opcoes.forEach(op => adicionarOpcao(op));
        } else {
            adicionarOpcao();
        }

        addBtn.addEventListener('click', () => adicionarOpcao());
        formBody.appendChild(block);
    }

    // --- Listeners dos Botões da Sidebar ---
    if(addTextoBtn) addTextoBtn.addEventListener('click', () => criarPerguntaTexto());
    if(addSimNaoBtn) addSimNaoBtn.addEventListener('click', () => criarPerguntaSimNao());
    if(addMultiplaBtn) addMultiplaBtn.addEventListener('click', () => criarPerguntaMultiplaEscolha());

    // --- Salvar ---
    saveBtn.addEventListener('click', async () => {
        const titulo = titleInput.value;
        const descricao = summaryTextarea.value;
        const perguntas = [];
        const questionBlocks = document.querySelectorAll('.question-block');

        questionBlocks.forEach(block => {
            const texto = block.querySelector('.question-title-input').value;
            const tipo = block.dataset.tipo;

            // AQUI: Lendo o valor do checkbox 'Obrigatória'
            const obrigatoria = block.querySelector('.obrigatoria-toggle').checked;

            if (!texto) return;

            const pergunta = {
                texto: texto,
                tipo: tipo,
                obrigatoria: obrigatoria
            };

            if (tipo === 'MULTIPLA_ESCOLHA') {
                const opcoes = [];
                block.querySelectorAll('.option-text-input').forEach(inp => {
                    if(inp.value) opcoes.push(inp.value);
                });
                pergunta.opcoes = opcoes;
            }
            perguntas.push(pergunta);
        });

        const dto = {
            titulo: titulo,
            descricao: descricao,
            perguntas: perguntas,
        };

        try {
            if (modoEdicao) {
                await editarPesquisa(pesquisaId, dto);
                alert('Pesquisa atualizada!');
            } else {
                await criarPesquisa(dto);
                alert('Pesquisa criada!');
            }
            window.location.href = 'criacaoDePesquisasADM.html';
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar.');
        }
    });
});