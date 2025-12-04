package br.com.sebrae.projetos.grupo04.service;


import br.com.sebrae.projetos.grupo04.DTO.CriarPerguntaDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarPerguntaPorIDDTO;
import br.com.sebrae.projetos.grupo04.DTO.MuralDTO;
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

    @Autowired
    private GenericoService service;

    public Pergunta criarPerguntaPorID(CriarPerguntaPorIDDTO dto) {
        Pesquisa pesquisa = service.findPesquisaById(dto.idPesquisa());
        Pergunta pergunta = new Pergunta(dto.texto(), dto.tipo(), dto.obrigatoria(),dto.opcoes(), pesquisa);
        return repository.save(pergunta);
    }

    public List<Pergunta> criarPerguntasParaPesquisa(List<CriarPerguntaDTO> dtos, Pesquisa pesquisa) {
        List<Pergunta> perguntas = dtos.stream()
                .map(dto -> new Pergunta(dto.texto(), dto.tipo(), dto.obrigatoria(),dto.opcoes(), pesquisa))
                .toList();

        return repository.saveAll(perguntas);
    }

    public List<Pergunta> editarPerguntasParaPesquisa(List<CriarPerguntaDTO> dtos, Pesquisa pesquisa) {
        List<Pergunta> perguntasAntigas = pesquisa.getPerguntas();
        for (int i = 0; i < dtos.size();i++) {

            CriarPerguntaDTO dto = dtos.get(i);

            if (i < perguntasAntigas.size()) {
                Pergunta pergunta = perguntasAntigas.get(i);
                pergunta.setTexto(dto.texto());
                pergunta.setTipo(dto.tipo());
                pergunta.setObrigatoria(dto.obrigatoria());
                pergunta.setOpcoes(dto.opcoes());
            } else {
                Pergunta nova = new Pergunta(dto.texto(),dto.tipo(),dto.obrigatoria(),dto.opcoes(),pesquisa);
                perguntasAntigas.add(nova);
            }
        }
        return perguntasAntigas;
    }
    public List<MuralDTO> listarPerguntasPopulares() {
        return repository.findPerguntasMaisRespondidas();
    }
}

