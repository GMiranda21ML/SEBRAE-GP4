package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.CriarSugestaoDTO;
import br.com.sebrae.projetos.grupo04.DTO.SugestaoResponseDTO;
import br.com.sebrae.projetos.grupo04.model.Sugestao;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.model.enums.Role;
import br.com.sebrae.projetos.grupo04.repository.SugestaoRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SugestaoService {

    @Autowired
    private SugestaoRepository repository;

    public void criarSugestao(CriarSugestaoDTO dto, Usuario autor) {
        Sugestao sugestao = new Sugestao(dto.texto(), autor);
        repository.save(sugestao);
    }

    public List<SugestaoResponseDTO> listarSugestoes(Usuario usuarioLogado) {
        List<Sugestao> sugestoes = repository.findAllByOrderByDataCriacaoDesc();

        return sugestoes.stream().map(s -> convertToDTO(s, usuarioLogado)).toList();
    }

    public void alternarVoto(UUID idSugestao, Usuario usuario) {
        Sugestao sugestao = repository.findById(idSugestao)
                .orElseThrow(() -> new ResourceNotFoundException(idSugestao));

        if (sugestao.getCurtidas().contains(usuario)) {
            sugestao.removerCurtida(usuario);
        } else {
            sugestao.adicionarCurtida(usuario);
        }

        repository.save(sugestao);
    }

    public SugestaoResponseDTO buscarPorId(UUID id, Usuario usuarioLogado) {
        Sugestao s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return convertToDTO(s, usuarioLogado);
    }

    public void editarSugestao(UUID id, CriarSugestaoDTO dto, Usuario usuario) {
        Sugestao sugestao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        if (!sugestao.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar esta sugestão.");
        }

        sugestao.setTexto(dto.texto());
        repository.save(sugestao);
    }

    public void deletarSugestao(UUID id, Usuario usuario) {
        Sugestao sugestao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        if (!sugestao.getUsuario().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Você não tem permissão para excluir esta sugestão.");
        }

        repository.delete(sugestao);
    }

    private SugestaoResponseDTO convertToDTO(Sugestao s, Usuario usuarioLogado) {
        boolean respondidaPorAdmin = s.getComentarios() != null && s.getComentarios().stream()
                .anyMatch(c -> c.getUsuario().getRole() == Role.ROLE_ADMIN);

        boolean isAutor = s.getUsuario().getId().equals(usuarioLogado.getId());

        return new SugestaoResponseDTO(
                s.getId(),
                s.getTexto(),
                s.getUsuario().getNome(),
                s.getDataCriacao(),
                s.getCurtidas().size(),
                s.getCurtidas().contains(usuarioLogado),
                respondidaPorAdmin,
                isAutor
        );
    }
}