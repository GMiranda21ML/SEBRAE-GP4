package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.Service.PesquisaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pesquisa")
public class PesquisaController {
    @Autowired
    private PesquisaService service;

    @PostMapping("/criar")
    public ResponseEntity<Void> criarPesquisa(@RequestBody CriarPesquisaDTO dto) {
        return service.criarPesquisa(dto);
    }
}
