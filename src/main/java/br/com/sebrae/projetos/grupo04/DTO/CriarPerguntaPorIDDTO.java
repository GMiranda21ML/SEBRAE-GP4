package br.com.sebrae.projetos.grupo04.DTO;

import br.com.sebrae.projetos.grupo04.model.enums.TipoPergunta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.UUID;

public record CriarPerguntaPorIDDTO(
        @NotNull
        @NotBlank
        @Length(max = 500)
        String texto,
        @NotNull
        TipoPergunta tipo,
        @NotNull
        Boolean obrigatoria,
        @NotNull
        UUID idPesquisa

) {
}
