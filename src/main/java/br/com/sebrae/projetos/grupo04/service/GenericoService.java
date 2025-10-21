package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.repository.PerguntaRepository;
import br.com.sebrae.projetos.grupo04.repository.PesquisaRepository;
import br.com.sebrae.projetos.grupo04.repository.RespostaRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GenericoService {

    @Autowired
    PerguntaRepository perguntaRepository;
    @Autowired
    PesquisaRepository pesquisaRepository;
    @Autowired
    RespostaRepository respostaRepository;

    @SuppressWarnings("unchecked")
    public <T> List<T> findAll(TipoEntidade tipo) {
        return switch (tipo) {
            case PESQUISA -> (List<T>) pesquisaRepository.findAll();
            case PERGUNTA -> (List<T>) perguntaRepository.findAll();
            case RESPOSTA -> (List<T>) respostaRepository.findAll();
            default ->  throw new IllegalArgumentException("Tipo inválido");
        };
    }

    public Pesquisa findPesquisaById(UUID id) {
        return pesquisaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Pergunta findPerguntaById(UUID id) {
        return perguntaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Resposta findRespostaById(UUID id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Object findById(TipoEntidade tipo, UUID id) {
        return switch (tipo) {
            case PESQUISA -> findPesquisaById(id);
            case PERGUNTA -> findPerguntaById(id);
            case RESPOSTA -> findRespostaById(id);
            default -> throw new IllegalArgumentException("Tipo inválido");
        };
    }
}
