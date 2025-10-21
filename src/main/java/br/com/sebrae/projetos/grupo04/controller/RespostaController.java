package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.AtualizarRespostaDTO;
import br.com.sebrae.projetos.grupo04.DTO.CriarRespostaDTO;
import br.com.sebrae.projetos.grupo04.model.Resposta;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
import br.com.sebrae.projetos.grupo04.service.RespostaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/resposta")
public class RespostaController {

    @Autowired
    private RespostaService respostaService;
    private GenericoService service;


    @GetMapping
    public ResponseEntity<List<Resposta>> buscarRespostas() {
        List<Resposta> respostas = service.findAll(TipoEntidade.RESPOSTA);
        return ResponseEntity.ok(respostas);
    }

    @PostMapping
    public ResponseEntity<Resposta> criarResposta(@RequestBody CriarRespostaDTO dto) {
        Resposta resposta = respostaService.criarResposta(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(resposta.getId())
                .toUri();

        return ResponseEntity.created(uri).body(resposta);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> atualizarResposta(@RequestBody AtualizarRespostaDTO dto, @PathVariable UUID id) {
        respostaService.atualizarResposta(dto, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarResposta(@PathVariable UUID id) {
        respostaService.deletarResposta(id);
        return ResponseEntity.noContent().build();
    }
}