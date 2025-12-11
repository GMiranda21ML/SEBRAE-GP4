package br.com.sebrae.projetos.grupo04.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record ComentarioRespostaDTO(
        UUID id,
        String texto,
        String nomeAutor,
        LocalDateTime dataCriacao ,
        boolean autorIsAdmin,
        boolean isAutor
) {}