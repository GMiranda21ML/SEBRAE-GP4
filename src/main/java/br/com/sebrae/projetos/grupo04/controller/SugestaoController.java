package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.ComentarioRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarComentarioDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarSugestaoDTO;
import br.com.sebrae.projetos.grupo04.DTO.SugestaoResponseDTO;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.service.ComentarioService;
import br.com.sebrae.projetos.grupo04.service.SugestaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sugestoes")
public class SugestaoController {

    @Autowired
    private SugestaoService service;

    @Autowired
    private ComentarioService comentarioService;

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody @Valid CriarSugestaoDTO dto) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.criarSugestao(dto, usuario);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<SugestaoResponseDTO>> listar() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<SugestaoResponseDTO> lista = service.listarSugestoes(usuario);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SugestaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SugestaoResponseDTO dto = service.buscarPorId(id, usuario);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> editar(@PathVariable UUID id, @RequestBody @Valid CriarSugestaoDTO dto) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.editarSugestao(id, dto, usuario);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.deletarSugestao(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/votar")
    public ResponseEntity<Void> votar(@PathVariable UUID id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.alternarVoto(id, usuario);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<Void> comentar(@PathVariable UUID id, @RequestBody @Valid CriarComentarioDTO dto) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        comentarioService.criarComentario(id, dto, usuario);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<ComentarioRespostaDTO>> listarComentarios(@PathVariable UUID id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ComentarioRespostaDTO> lista = comentarioService.listarComentarios(id, usuario);
        return ResponseEntity.ok(lista);
    }

    @PatchMapping("/comentarios/{idComentario}")
    public ResponseEntity<Void> editarComentario(@PathVariable UUID idComentario, @RequestBody @Valid CriarComentarioDTO dto) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        comentarioService.editarComentario(idComentario, dto, usuario);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comentarios/{idComentario}")
    public ResponseEntity<Void> deletarComentario(@PathVariable UUID idComentario) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        comentarioService.deletarComentario(idComentario, usuario);
        return ResponseEntity.noContent().build();
    }
}