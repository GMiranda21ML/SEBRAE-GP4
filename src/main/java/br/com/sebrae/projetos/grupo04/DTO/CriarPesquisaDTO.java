package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.List;


public record CriarPesquisaDTO(
        @NotNull
        @NotBlank
        @Length(max = 200)
        String titulo,
        @NotNull
        @NotBlank
        @Length(max = 500)
        String descricao,
        List<CriarPerguntaDTO> perguntas

) {
}
