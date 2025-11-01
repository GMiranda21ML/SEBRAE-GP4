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

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {

        localStorage.removeItem('authToken');
        window.location.href = 'paginaLogin.html';
        return Promise.reject(new Error('Não autorizado'));
    }

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return response.json();
}

function getPesquisas() {
    return fetchAutenticado('/pesquisa', { method: 'GET' });
}

function deletarPesquisa(id) {
    return fetchAutenticado(`/pesquisa/deletar/${id}`, { method: 'DELETE' });
}