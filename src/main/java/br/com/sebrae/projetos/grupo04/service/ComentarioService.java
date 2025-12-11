package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.ComentarioRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarComentarioDTO;
import br.com.sebrae.projetos.grupo04.model.Comentario;
import br.com.sebrae.projetos.grupo04.model.Sugestao;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.model.enums.Role;
import br.com.sebrae.projetos.grupo04.repository.ComentarioRepository;
import br.com.sebrae.projetos.grupo04.repository.SugestaoRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private SugestaoRepository sugestaoRepository;

    public void criarComentario(UUID idSugestao, CriarComentarioDTO dto, Usuario autor) {
        Sugestao sugestao = sugestaoRepository.findById(idSugestao)
                .orElseThrow(() -> new ResourceNotFoundException(idSugestao));

        Comentario comentario = new Comentario(dto.texto(), autor, sugestao);
        comentarioRepository.save(comentario);
    }

    public List<ComentarioRespostaDTO> listarComentarios(UUID idSugestao, Usuario usuarioLogado) {
        Sugestao sugestao = sugestaoRepository.findById(idSugestao)
                .orElseThrow(() -> new ResourceNotFoundException(idSugestao));

        return comentarioRepository.findBySugestaoOrderByDataCriacaoAsc(sugestao).stream()
                .map(c -> new ComentarioRespostaDTO(
                        c.getId(),
                        c.getTexto(),
                        c.getUsuario().getNome(),
                        c.getDataCriacao(),
                        c.getUsuario().getRole() == Role.ROLE_ADMIN,
                        c.getUsuario().getId().equals(usuarioLogado.getId())
                )).toList();
    }

    public void editarComentario(UUID idComentario, CriarComentarioDTO dto, Usuario usuario) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException(idComentario));

        if (!comentario.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Você não pode editar este comentário.");
        }

        comentario.setTexto(dto.texto());
        comentarioRepository.save(comentario);
    }

    public void deletarComentario(UUID idComentario, Usuario usuario) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException(idComentario));

        if (!comentario.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Você não pode apagar este comentário.");
        }
        comentarioRepository.delete(comentario);
    }
}