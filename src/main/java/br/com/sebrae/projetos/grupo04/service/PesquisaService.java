package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.repository.PesquisaRepository;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PesquisaService {

    @Autowired
    private PesquisaRepository repository;

    @Autowired
    PerguntaService perguntaService;

    public List<Pesquisa> findAll() {
        return repository.findAll();
    }

    public Pesquisa findById(UUID id) {
        Optional<Pesquisa> pesquisa = repository.findById(id);
        return pesquisa.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Pesquisa criarPesquisa(CriarPesquisaDTO dto) {
        Pesquisa pesquisa = new Pesquisa(dto.titulo(), dto.descricao());
        repository.save(pesquisa);

        List<Pergunta> perguntas = perguntaService.criarPerguntasParaPesquisa(dto.perguntas(), pesquisa);

        pesquisa.setPerguntas(perguntas);

        return repository.save(pesquisa);
    }

    public void editarPesquisa(CriarPesquisaDTO dto, UUID id) {
        Pesquisa pesquisa = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
        pesquisa.setTitulo(dto.titulo());
        pesquisa.setDescricao(dto.descricao());
        List<Pergunta> perguntasAtualizadas = perguntaService.editarPerguntasParaPesquisa(dto.perguntas(),pesquisa);
        pesquisa.setPerguntas(perguntasAtualizadas);
        repository.save(pesquisa);
    }

    public void deletarPesquisa(UUID id) {
        Pesquisa pesquisa = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
        repository.delete(pesquisa);
    }
}
