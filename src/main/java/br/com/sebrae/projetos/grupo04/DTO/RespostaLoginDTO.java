package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.constraints.NotNull;

public record RespostaLoginDTO(
        @NotNull
        String token
) {

}
