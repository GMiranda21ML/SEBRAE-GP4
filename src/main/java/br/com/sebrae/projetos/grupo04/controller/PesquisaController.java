package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.service.PesquisaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pesquisa")
public class PesquisaController {
    @Autowired
    private PesquisaService service;

    @GetMapping
    public ResponseEntity<List<Pesquisa>> findAll() {
        List<Pesquisa> pesquisas = service.findAll();
        return ResponseEntity.ok().body(pesquisas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pesquisa> findById(@PathVariable UUID id) {
        Pesquisa pesquisa = service.findById(id);
        return ResponseEntity.ok().body(pesquisa);
    }

    @PostMapping("/criar")
    public ResponseEntity<Pesquisa> criarPesquisa(@RequestBody CriarPesquisaDTO dto) {
        Pesquisa pesquisa = service.criarPesquisa(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(pesquisa.getId())
                .toUri();

        return ResponseEntity.created(uri).body(pesquisa);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarPesquisa(@PathVariable UUID id) {
        service.deletarPesquisa(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/editar/{id}")
    public ResponseEntity<Void> editarPesquisa(@RequestBody CriarPesquisaDTO dto, @PathVariable UUID id) {
        service.editarPesquisa(dto, id);
        return ResponseEntity.ok().build();
    }
}
