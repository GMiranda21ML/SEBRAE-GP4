package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Sugestao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SugestaoRepository extends JpaRepository<Sugestao, UUID> {
    List<Sugestao> findAllByOrderByDataCriacaoDesc();
}