package br.com.sebrae.projetos.grupo04.service;


import br.com.sebrae.projetos.grupo04.DTO.CriarPerguntaDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.repository.PerguntaRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PerguntaService {

    @Autowired
    private PerguntaRepository repository;

    public List<Pergunta> findAll() {
        return repository.findAll();
    }

    public Pergunta findById(UUID id) {
        Optional<Pergunta> pergunta = repository.findById(id);
        return pergunta.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Pergunta criarPergunta(CriarPerguntaDTO dto) {
        Pergunta pergunta = new Pergunta(dto.texto(), dto.tipo(), dto.ehObrigatoria());
        return repository.save(pergunta);
    }

    public List<Pergunta> criarPerguntasParaPesquisa(List<CriarPerguntaDTO> dtos, Pesquisa pesquisa) {
        List<Pergunta> perguntas = dtos.stream()
                .map(dto -> new Pergunta(dto.texto(), dto.tipo(), dto.ehObrigatoria(), pesquisa))
                .toList();

        return repository.saveAll(perguntas);
    }
}

