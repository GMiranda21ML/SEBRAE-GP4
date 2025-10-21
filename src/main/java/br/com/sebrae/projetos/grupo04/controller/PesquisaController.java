package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
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
    private GenericoService service;
    @Autowired
    private PesquisaService pesquisaService;


    @GetMapping("/{id}")
    public ResponseEntity<Pesquisa> findById(@PathVariable UUID id) {
        Pesquisa pesquisa = service.findPesquisaById(id);
        return ResponseEntity.ok().body(pesquisa);
    }

    @GetMapping
    public ResponseEntity<List<Pesquisa>> findAll() {
        List<Pesquisa> pesquisas = service.findAll(TipoEntidade.PESQUISA);
        return ResponseEntity.ok().body(pesquisas);
    }

    @PostMapping("/criar")
    public ResponseEntity<Pesquisa> criarPesquisa(@RequestBody CriarPesquisaDTO dto) {
        Pesquisa pesquisa = pesquisaService.criarPesquisa(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(pesquisa.getId())
                .toUri();

        return ResponseEntity.created(uri).body(pesquisa);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarPesquisa(@PathVariable UUID id) {
        pesquisaService.deletarPesquisa(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/editar/{id}")
    public ResponseEntity<Void> editarPesquisa(@RequestBody CriarPesquisaDTO dto, @PathVariable UUID id) {
        pesquisaService.editarPesquisa(dto, id);
        return ResponseEntity.ok().build();
    }
}
