document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'paginaLogin.html';
        return;
    }

});