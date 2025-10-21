package br.com.sebrae.projetos.grupo04.controller;

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
    @Autowired
    private GenericoService service;


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
}
