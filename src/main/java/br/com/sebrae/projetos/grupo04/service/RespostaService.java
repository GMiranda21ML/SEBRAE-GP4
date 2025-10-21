package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.CriarRespostaDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.repository.RespostaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RespostaService {

    @Autowired
    private RespostaRepository repository;
    @Autowired
    private GenericoService service;

    public Resposta criarResposta(CriarRespostaDTO dto) {
        UUID perguntaId = dto.perguntaId().id();

        Pergunta pergunta = service.findPerguntaById(perguntaId);

        Resposta resposta = new Resposta(dto.respostaTexto(), pergunta);
        pergunta.getRespostas().add(resposta);

        repository.save(resposta);
        return resposta;
    }
}
