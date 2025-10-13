package br.com.sebrae.projetos.grupo04.Service;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.Repository.PesquisaRepository;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PesquisaService {
    @Autowired
    private PesquisaRepository repository;

    public ResponseEntity<Void> criarPesquisa(CriarPesquisaDTO dto) {
        Pesquisa pesquisa = new Pesquisa(dto.titulo(), dto.descricao());

        List<Pergunta> perguntas = dto.perguntas().stream()
                .map(p -> new Pergunta(p.texto(), p.tipo(), p.ehObrigatoria(), pesquisa))
                .toList();

        pesquisa.setPerguntas(perguntas);

        repository.save(pesquisa);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public ResponseEntity<Void> deletarPesquisa(Long id) {
        Optional<Pesquisa> pesquisa =  repository.findById(id);
        if (pesquisa.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        repository.delete(pesquisa.get());

        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
