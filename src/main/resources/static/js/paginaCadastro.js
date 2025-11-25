document.addEventListener('DOMContentLoaded', () => {

    const roleSelect = document.getElementById('role');
    const recebeEmailGroup = document.getElementById('recebeEmailGroup');
    const recebeEmailCheckbox = document.getElementById('recebeEmail');

    function toggleRecebeEmailVisibility() {
        if (roleSelect.value === 'ROLE_USER') {
            recebeEmailGroup.style.display = 'flex';
        } else {
            recebeEmailGroup.style.display = 'none';
            recebeEmailCheckbox.checked = false;
        }
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', toggleRecebeEmailVisibility);
    }

    if (roleSelect && recebeEmailGroup) {
        toggleRecebeEmailVisibility();
    }

    const cadastroForm = document.querySelector('form');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const role = document.getElementById('role').value;

            const recebeEmail = recebeEmailCheckbox.checked;

            const cadastroData = {
                nome: nome,
                email: email,
                senha: senha,
                role: role,
                recebeEmail: recebeEmail
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
                    const data = await response.json();

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userRole', data.role);

                    alert('Cadastro realizado com sucesso!');

                    if (data.role === 'ROLE_ADMIN') {
                        window.location.href = 'criacaoDePesquisasADM.html';
                    } else if (data.role === 'ROLE_USER') {
                        window.location.href = 'dashboardUsuario.html';
                    } else {
                        window.location.href = 'paginaLogin.html';
                    }

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