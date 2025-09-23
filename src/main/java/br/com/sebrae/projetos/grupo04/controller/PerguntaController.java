package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.models.Pergunta;
import br.com.sebrae.projetos.grupo04.models.enums.TipoPergunta;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class PerguntaController {

    // so um teste pra ve se ta pegando
    @GetMapping
    public ResponseEntity<List<Pergunta>> testePergunta() {
        List<Pergunta> perguntas = new ArrayList<>();
        perguntas.add(new Pergunta("Pergunta Nº1: ", TipoPergunta.TEXTO, true));
        perguntas.add(new Pergunta("Pergunta Nº2: ", TipoPergunta.TEXTO, false));

        return ResponseEntity.ok(perguntas);
    }
}
