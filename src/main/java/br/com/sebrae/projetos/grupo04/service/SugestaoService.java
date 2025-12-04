package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.CriarSugestaoDTO;
import br.com.sebrae.projetos.grupo04.DTO.SugestaoResponseDTO;
import br.com.sebrae.projetos.grupo04.model.Sugestao;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.repository.SugestaoRepository;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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

        return sugestoes.stream().map(s -> new SugestaoResponseDTO(
                s.getId(),
                s.getTexto(),
                s.getUsuario().getNome(),
                s.getDataCriacao(),
                s.getCurtidas().size(),
                s.getCurtidas().contains(usuarioLogado)
        )).toList();
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
}