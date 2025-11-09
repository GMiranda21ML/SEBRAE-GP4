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

        try {
            return await response.json();
        } catch (e) {
            return response;
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

function submeterRespostas(pesquisaId, dto) {
    return fetchAutenticado(`/resposta`, {
        method: 'POST',
        body: JSON.stringify(dto)
    });
}