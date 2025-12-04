document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../paginaLogin.html';
        return;
    }

    const btnEnviar = document.getElementById('btn-enviar');
    const inputTitulo = document.getElementById('titulo-input');
    const inputComentario = document.getElementById('comentario-input');

    btnEnviar.addEventListener('click', async () => {
        const titulo = inputTitulo.value.trim();
        const corpo = inputComentario.value.trim();

        if (!titulo && !corpo) {
            alert('Por favor, escreva algo para publicar.');
            return;
        }
        let textoFinal = "";
        if (titulo) textoFinal += `TÍTULO: ${titulo}\n\n`;
        if (corpo) textoFinal += corpo;

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        try {
            await criarSugestao(textoFinal);
            
            alert('Comentário enviado para o mural com sucesso!');

            window.location.href = '../muralUsuario.html'; 

        } catch (error) {
            console.error('Erro ao postar:', error);
            alert('Erro ao enviar o comentário. Tente novamente.');
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Responder';
        }
    });
});