package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.service.PerguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pergunta")
public class PerguntaController {

    @Autowired
    PerguntaService service;

    @GetMapping
    public ResponseEntity<List<Pergunta>> findAll() {
        List<Pergunta> perguntas = service.findAll();
        return ResponseEntity.ok().body(perguntas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pergunta> findById(@PathVariable UUID id) {
        Pergunta pergunta = service.findById(id);
        return ResponseEntity.ok().body(pergunta);
    }

}
