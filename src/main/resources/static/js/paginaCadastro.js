document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('form');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const role = document.getElementById('role').value;

            const cadastroData = {
                nome: nome,
                email: email,
                senha: senha,
                role: role
            };

            try {
                const response = await fetch('/auth/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cadastroData)
                });

                if (response.ok) {
<<<<<<< HEAD
                    alert('Cadastro realizado com sucesso! Faça login para continuar.');
                    window.location.href = 'paginaLogin.html';
=======
                    alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');

                    if (role === 'ROLE_ADMIN') {
                        window.location.href = 'criacaoDePesquisasADM.html';
                    }else if (role == 'ROLE_USER') {
                        window.location.href = 'visualizacaoDoMuralUsuario.html'
                    }
                    else{
                        window.location.href = 'paginaLogin.html';
                        }
>>>>>>> 407ec7eb992288dd38705a46ab0e27106cd7ec7d
                } else {
                    const errorText = await response.text();
                    if (errorText.includes('Já existe um usuario com este email')) {
                        alert('Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                    } else {
                        alert('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
                    }
                    console.error('Falha no cadastro:', errorText);
                }
            } catch (error) {
                console.error('Erro ao tentar cadastrar:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
        });
    }
});
