package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RespostaRepository extends JpaRepository<Resposta, UUID> {
    List<Resposta> findByUsuario(Usuario usuario);


    Optional<Resposta> findByUsuarioAndPergunta(Usuario usuario, Pergunta pergunta);

    @Query("SELECT r FROM Resposta r WHERE r.usuario = :usuario AND r.pergunta.pesquisa.id = :pesquisaId")
    List<Resposta> findByUsuarioAndPesquisaId(@Param("usuario") Usuario usuario, @Param("pesquisaId") UUID pesquisaId);
}
