
package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.AtualizarRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.ListaRespostasDTO;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
import br.com.sebrae.projetos.grupo04.service.RespostaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/resposta")
public class RespostaController {

    @Autowired
    private RespostaService respostaService;
    @Autowired
    private GenericoService service;


    @PostMapping
    public ResponseEntity<Void> salvarRespostas(@RequestBody @Valid ListaRespostasDTO dto) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        respostaService.salvarRespostas(dto, usuario);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/minhas-pesquisas")
    public ResponseEntity<Set<Pesquisa>> getMinhasPesquisasRespondidas() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Set<Pesquisa> pesquisas = respostaService.getPesquisasRespondidasPeloUsuario(usuario);
        return ResponseEntity.ok().body(pesquisas);
    }


    @GetMapping("/pesquisa/{pesquisaId}")
    public ResponseEntity<List<Resposta>> getMinhasRespostasPorPesquisa(@PathVariable UUID pesquisaId) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Resposta> respostas = respostaService.getRespostasDoUsuarioPorPesquisa(usuario, pesquisaId);
        return ResponseEntity.ok().body(respostas);
    }

    @GetMapping
    public ResponseEntity<List<Resposta>> buscarRespostas() {
        List<Resposta> respostas = service.findAll(TipoEntidade.RESPOSTA);
        return ResponseEntity.ok().body(respostas);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> atualizarResposta(@RequestBody @Valid AtualizarRespostaDTO dto, @PathVariable UUID id) {
        respostaService.atualizarResposta(dto, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarResposta(@PathVariable UUID id) {
        respostaService.deletarResposta(id);
        return ResponseEntity.noContent().build();
    }
}