package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PesquisaRepository extends JpaRepository<Pesquisa, UUID> {


}
