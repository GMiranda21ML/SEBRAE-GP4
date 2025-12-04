package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Sugestao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SugestaoRepository extends JpaRepository<Sugestao, UUID> {
    @Query("SELECT s FROM Sugestao s ORDER BY SIZE(s.curtidas) DESC, s.dataCriacao DESC")
    List<Sugestao> findAllByOrderByDataCriacaoDesc();
}