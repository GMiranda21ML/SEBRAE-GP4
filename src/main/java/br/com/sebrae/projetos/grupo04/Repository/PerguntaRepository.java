package br.com.sebrae.projetos.grupo04.Repository;

import br.com.sebrae.projetos.grupo04.model.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerguntaRepository extends JpaRepository<Pergunta, Long> {
}
