package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioLoginDTO(
        @NotNull
        @NotBlank
        @Email
        String email,
        @NotNull
        @NotBlank
        String senha
) {
}
