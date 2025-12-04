package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.DTO.MuralDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PerguntaRepository extends JpaRepository<Pergunta, UUID> {

    @Query("SELECT new br.com.sebrae.projetos.grupo04.DTO.MuralDTO(" +
            "p.id, p.texto, p.pesquisa.titulo, COUNT(r)) " +
            "FROM Pergunta p " +
            "LEFT JOIN p.respostas r " +
            "GROUP BY p.id, p.texto, p.pesquisa.titulo " +
            "ORDER BY COUNT(r) DESC")
    List<MuralDTO> findPerguntasMaisRespondidas();
}