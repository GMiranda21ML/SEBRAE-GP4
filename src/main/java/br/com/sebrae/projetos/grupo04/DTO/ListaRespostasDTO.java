package br.com.sebrae.projetos.grupo04.DTO;

import jakarta.validation.Valid;

import java.util.List;

public record ListaRespostasDTO(
        @Valid
        List<RespostaItemDTO> respostas
) {
}
