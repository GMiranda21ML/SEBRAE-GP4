package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotBlank;

public record CriarSugestaoDTO (
        @NotBlank(message = "O texto da sugestão não pode estar vazio")
        String texto
) {}