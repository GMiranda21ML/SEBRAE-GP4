package br.com.sebrae.projetos.grupo04.DTO;

import br.com.sebrae.projetos.grupo04.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioCadastroDTO(
        @NotNull
        @NotBlank
        String nome,
        @NotNull
        @NotBlank
        @Email
        String email,
        @NotNull
        @NotBlank
        String senha,
        @NotNull
        Role role,
        @NotNull
        Boolean recebeEmail
) {
}
