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
        String token = usuarioService.login(dto);
        return ResponseEntity.ok().body(new RespostaLoginDTO(token));
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastro(@RequestBody @Valid UsuarioCadastroDTO dto) {
        Usuario novoUsuario = usuarioService.cadastro(dto);
        return ResponseEntity.ok(novoUsuario);
    }
}