package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.UsuarioCadastroDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioDetalhadoDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioLoginDTO;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
import br.com.sebrae.projetos.grupo04.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private GenericoService genericoService;

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDetalhadoDTO> findById(@PathVariable UUID id) {
        Usuario usuario = genericoService.findUsuarioById(id);
        UsuarioDetalhadoDTO usuarioDTO = new UsuarioDetalhadoDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.isEnabled(),
                usuario.isAccountNonExpired(),
                usuario.isCredentialsNonExpired(),
                usuario.getUsername(),
                usuario.isAccountNonLocked(),
                usuario.getAuthorities()
        );
        return ResponseEntity.ok().body(usuarioDTO);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        List<Usuario> usuarios = genericoService.findAll(TipoEntidade.USUARIO);
        List<UsuarioDTO> usuarioDTOS = usuarios.stream()
                .map(u -> new UsuarioDTO(u.getId(), u.getNome(), u.getEmail(), u.getRole()))
                .toList();
        return ResponseEntity.ok().body(usuarioDTOS);
    }

}