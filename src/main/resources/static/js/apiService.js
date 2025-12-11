async function fetchAutenticado(url, options = {}) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'paginaLogin.html';
        return Promise.reject(new Error('Token não encontrado'));
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = 'paginaLogin.html';
            return Promise.reject(new Error('Não autorizado'));
        }

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const text = await response.text();

        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }

    } catch (error) {
        console.error('Erro na chamada fetchAutenticado:', error);
        return Promise.reject(error);
    }
}

function getPesquisas() {
    return fetchAutenticado('/pesquisa', { method: 'GET' });
}

function getPesquisaPorId(id) {
    return fetchAutenticado(`/pesquisa/${id}`, { method: 'GET' });
}

function criarPesquisa(dto) {
    return fetchAutenticado('/pesquisa', {
        method: 'POST',
        body: JSON.stringify(dto)
    });
}

function editarPesquisa(id, dto) {
    return fetchAutenticado(`/pesquisa/editar/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto)
    });
}

function deletarPesquisa(id) {
    return fetchAutenticado(`/pesquisa/deletar/${id}`, { method: 'DELETE' });
}

function submeterRespostas(dto) {
    return fetchAutenticado(`/resposta`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });
}

function dispararPesquisaEmail(id) {
    return fetchAutenticado(`/pesquisa/${id}/disparar-email`, {
        method: 'POST'
    });
}

function getMyRespostasPorPesquisa(pesquisaId) {
    return fetchAutenticado(`/resposta/pesquisa/${pesquisaId}`, { method: 'GET' });
}


function getMyPesquisasRespondidas() {
    return fetchAutenticado('/resposta/minhas-pesquisas', { method: 'GET' });
}

function getSugestoes() {
    return fetchAutenticado('/sugestoes', { method: 'GET' });
}

function criarSugestao(texto) {
    return fetchAutenticado('/sugestoes', {
        method: 'POST',
        body: JSON.stringify({ texto: texto })
    });
}

function editarSugestao(id, texto) {
    return fetchAutenticado(`/sugestoes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ texto: texto })
    });
}

function deletarSugestao(id) {
    return fetchAutenticado(`/sugestoes/${id}`, {
        method: 'DELETE'
    });
}

function votarSugestao(id) {
    return fetchAutenticado(`/sugestoes/${id}/votar`, {
        method: 'POST'
    });
}

function getSugestaoPorId(id) {
    return fetchAutenticado(`/sugestoes/${id}`, { method: 'GET' });
}

function getComentarios(idSugestao) {
    return fetchAutenticado(`/sugestoes/${idSugestao}/comentarios`, { method: 'GET' });
}

function criarComentario(idSugestao, texto) {
    return fetchAutenticado(`/sugestoes/${idSugestao}/comentarios`, {
        method: 'POST',
        body: JSON.stringify({ texto: texto })
    });
}

function editarComentario(id, texto) {
    return fetchAutenticado(`/sugestoes/comentarios/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ texto: texto })
    });
}

function deletarComentario(id) {
    return fetchAutenticado(`/sugestoes/comentarios/${id}`, {
        method: 'DELETE'
    });
}