package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotBlank;

public record CriarComentarioDTO(
        @NotBlank
        String texto
) {}