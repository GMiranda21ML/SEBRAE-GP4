package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UsuarioIdDTO(
        @NotNull
        @NotBlank
        UUID id
) {
}
