package br.com.sebrae.projetos.grupo04.DTO;

import java.util.UUID;

public record MuralDTO (
        UUID id,
        String textoPergunta,
        String tituloPesquisa,
        Long totalRespostas
) {}
