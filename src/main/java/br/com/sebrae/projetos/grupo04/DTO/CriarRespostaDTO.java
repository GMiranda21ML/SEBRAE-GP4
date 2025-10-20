package br.com.sebrae.projetos.grupo04.DTO;

import br.com.sebrae.projetos.grupo04.model.Pergunta;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CriarRespostaDTO(
        @NotNull
        String respostaTexto,
        @NotNull
        PerguntaIdDTO perguntaId
) {
}
