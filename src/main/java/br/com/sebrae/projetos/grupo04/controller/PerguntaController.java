package br.com.sebrae.projetos.grupo04.controller;


import br.com.sebrae.projetos.grupo04.DTO.CriarPerguntaPorIDDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
import br.com.sebrae.projetos.grupo04.service.PerguntaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pergunta")
public class PerguntaController {

    @Autowired
    GenericoService service;
    @Autowired
    PerguntaService perguntaService;

    @GetMapping("/{id}")
    public ResponseEntity<Pergunta> findById(@PathVariable UUID id) {
        Pergunta pergunta = service.findPerguntaById(id);
        return ResponseEntity.ok().body(pergunta);
    }

    @GetMapping
    public ResponseEntity<List<Pergunta>> findAll() {
        List<Pergunta> perguntas = service.findAll(TipoEntidade.PERGUNTA);
        return ResponseEntity.ok().body(perguntas);
    }

    @PostMapping("/criar")
    public ResponseEntity<Pergunta> criarPerguntaPorID(@RequestBody @Valid CriarPerguntaPorIDDTO dto) {
        Pergunta novaPergunta = perguntaService.criarPerguntaPorID(dto);
        return ResponseEntity.ok().body(novaPergunta);
    }

}
