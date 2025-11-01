document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.querySelector('form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {

            event.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const loginData = {
                email: email,
                senha: senha
            };

            try {

                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                if (response.ok) {

                    const data = await response.json();

                    localStorage.setItem('authToken', data.token);

                    window.location.href = 'userHomepage.html';
                } else {

                    console.error('Falha no login');
                    alert('Email ou senha inválidos. Tente novamente.');
                }
            } catch (error) {

                console.error('Erro ao tentar fazer login:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
        });
    }
});