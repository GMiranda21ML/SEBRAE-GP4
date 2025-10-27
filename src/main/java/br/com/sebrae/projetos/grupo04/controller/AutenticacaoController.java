package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.UsuarioCadastroDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioLoginDTO;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid UsuarioLoginDTO dto) {
        var usuarioSenha = new UsernamePasswordAuthenticationToken(dto.email(),dto.senha());
        var auth = this.authenticationManager.authenticate(usuarioSenha);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastro(@RequestBody @Valid UsuarioCadastroDTO dto) {
        if (repository.findByEmail(dto.email()) != null) {
            return ResponseEntity.badRequest().build();
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(dto.senha());
        Usuario usuario = new Usuario(dto.nome(),dto.email(),encryptedPassword,dto.role());
        repository.save(usuario);
        return ResponseEntity.ok().build();
    }

}
