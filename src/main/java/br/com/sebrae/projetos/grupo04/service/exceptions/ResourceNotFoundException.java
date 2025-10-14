package br.com.sebrae.projetos.grupo04.service.exceptions;

import java.util.UUID;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(UUID id) {
        super("Recurso não encontrado. id: " + id);
    }
}
