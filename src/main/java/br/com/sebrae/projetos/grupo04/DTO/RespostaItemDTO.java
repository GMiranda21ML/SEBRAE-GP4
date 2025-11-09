package br.com.sebrae.projetos.grupo04.DTO;

import java.util.UUID;

public record RespostaItemDTO(
        UUID perguntaId,
        String resposta
) {
}
