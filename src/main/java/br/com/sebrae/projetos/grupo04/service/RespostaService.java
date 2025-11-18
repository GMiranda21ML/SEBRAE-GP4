
package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.AtualizarRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.ListaRespostasDTO;
import br.com.sebrae.projetos.grupo04.DTO.RespostaItemDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.repository.RespostaRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RespostaService {

    @Autowired
    private RespostaRepository repository;
    @Autowired
    private GenericoService service;

    public void salvarRespostas(ListaRespostasDTO dto, Usuario usuario) {
        for (RespostaItemDTO obj : dto.respostas()) {
            if (obj.resposta() != null && !obj.resposta().isBlank()) {
                Pergunta pergunta = service.findPerguntaById(obj.perguntaId());

                Optional<Resposta> respostaExistente = repository.findByUsuarioAndPergunta(usuario, pergunta);

                if (respostaExistente.isPresent()) {
                    Resposta resposta = respostaExistente.get();
                    resposta.setRespostaTexto(obj.resposta());
                    repository.save(resposta);
                } else {
                    Resposta resposta = new Resposta(obj.resposta(), pergunta, usuario);
                    repository.save(resposta);
                }
            }
        }
    }


    public Set<Pesquisa> getPesquisasRespondidasPeloUsuario(Usuario usuario) {
        List<Resposta> respostas = repository.findByUsuario(usuario);
        return respostas.stream()
                .map(Resposta::getPergunta)
                .map(Pergunta::getPesquisa)
                .collect(Collectors.toSet());
    }


    public List<Resposta> getRespostasDoUsuarioPorPesquisa(Usuario usuario, UUID pesquisaId) {
        return repository.findByUsuarioAndPesquisaId(usuario, pesquisaId);
    }


    public Resposta criarResposta(CriarRespostaDTO dto) {
        UUID perguntaId = dto.perguntaId().id();
        UUID usuarioId = dto.usuarioId().id();

        Pergunta pergunta = service.findPerguntaById(perguntaId);
        Usuario usuario = service.findUsuarioById(usuarioId);

        Resposta resposta = new Resposta(dto.respostaTexto(), pergunta,usuario);

        repository.save(resposta);
        return resposta;
    }

    public void deletarResposta(UUID id) {
        Resposta resposta = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));

        repository.delete(resposta);
    }

    public void atualizarResposta(AtualizarRespostaDTO dto, UUID id) {
        Resposta resposta = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
        resposta.setRespostaTexto(dto.respostaTexto());
        repository.save(resposta);
    }
}