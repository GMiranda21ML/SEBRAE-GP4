package br.com.sebrae.projetos.grupo04.DTO;

import br.com.sebrae.projetos.grupo04.model.enums.Role;
import jakarta.validation.constraints.NotNull;

public record RespostaLoginDTO(
        @NotNull
        String token,
        Role role
) {

}
