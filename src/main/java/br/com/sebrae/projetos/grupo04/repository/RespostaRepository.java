package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Resposta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RespostaRepository extends JpaRepository<Resposta, UUID> {
}
