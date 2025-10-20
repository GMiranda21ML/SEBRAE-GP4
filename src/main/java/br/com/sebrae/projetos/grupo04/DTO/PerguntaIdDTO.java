package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PerguntaIdDTO(
        @NotNull
        @NotBlank
        UUID id
) {
}
