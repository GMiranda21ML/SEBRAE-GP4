package br.com.sebrae.projetos.grupo04.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record SugestaoResponseDTO(
        UUID id,
        String texto,
        String nomeAutor,
        LocalDateTime dataCriacao,
        int totalCurtidas,
        boolean curtiu ,
        boolean respondidaPorAdmin
) {}