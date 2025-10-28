package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.UsuarioCadastroDTO;
import br.com.sebrae.projetos.grupo04.DTO.UsuarioLoginDTO;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.repository.UsuarioRepository;
import br.com.sebrae.projetos.grupo04.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

<<<<<<< HEAD
    public String login(UsuarioLoginDTO dto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
        Authentication autenticacao = authenticationManager.authenticate(authenticationToken);
        return tokenService.generateToken((Usuario) autenticacao.getPrincipal());
=======
    public Usuario login(UsuarioLoginDTO dto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
        Authentication autenticacao = authenticationManager.authenticate(authenticationToken);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(context);

        return (Usuario) autenticacao.getPrincipal();
    }

    public Usuario cadastro(UsuarioCadastroDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um usuario com este email");
        }

        Usuario usuario = new Usuario(dto.nome(),dto.email(), dto.senha(), dto.role());
        repository.save(usuario);
        return usuario;
>>>>>>> 5a51d328e9aa56eeae8fb3cc0b23405b525964f2
    }

    public Usuario cadastro(UsuarioCadastroDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um usuario com este email");
        }

        String encryptedPassword = passwordEncoder.encode(dto.senha());
        Usuario usuario = new Usuario(dto.nome(), dto.email(), encryptedPassword, dto.role());
        return repository.save(usuario);
    }
}