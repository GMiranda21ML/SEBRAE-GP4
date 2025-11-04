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

                    if (data.role === 'ROLE_USER') {
<<<<<<< HEAD
                        window.location.href = 'VisualizacaoDoMuralUsuario.html';
=======
                        window.location.href = 'visualizacaoDoMuralUsuario.html';
>>>>>>> 407ec7eb992288dd38705a46ab0e27106cd7ec7d
                    } else if (data.role === 'ROLE_ADMIN') {
                        window.location.href = 'criacaoDePesquisasADM.html';
                    } else {
                        alert('Role desconhecido. Contate o suporte.');
                    }
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
