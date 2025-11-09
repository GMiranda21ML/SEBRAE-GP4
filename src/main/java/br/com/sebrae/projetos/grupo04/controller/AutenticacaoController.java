package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.RespostaLoginDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioCadastroDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioLoginDTO;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UsuarioLoginDTO dto) {
       RespostaLoginDTO respostaLoginDTO = usuarioService.login(dto);
        return ResponseEntity.ok().body(respostaLoginDTO);
    }

    @PostMapping("/cadastro")
    public ResponseEntity<RespostaLoginDTO> cadastro(@RequestBody @Valid UsuarioCadastroDTO dto) {
        RespostaLoginDTO  respostaLoginDTO = usuarioService.cadastro(dto);
        return ResponseEntity.ok(respostaLoginDTO);
    }
}