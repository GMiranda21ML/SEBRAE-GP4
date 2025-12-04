package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.CriarSugestaoDTO;
import br.com.sebrae.projetos.grupo04.DTO.SugestaoResponseDTO;
import br.com.sebrae.projetos.grupo04.model.Usuario;
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

    @PostMapping("/{id}/votar")
    public ResponseEntity<Void> votar(@PathVariable UUID id) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.alternarVoto(id, usuario);
        return ResponseEntity.ok().build();
    }
}