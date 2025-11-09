package br.com.sebrae.projetos.grupo04.service;

import br.com.sebrae.projetos.grupo04.DTO.RespostaLoginDTO;
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


    public RespostaLoginDTO login(UsuarioLoginDTO dto) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
        Authentication autenticacao = authenticationManager.authenticate(authenticationToken);
        Usuario usuario = (Usuario) autenticacao.getPrincipal();
        String token = tokenService.generateToken(usuario);
        return new RespostaLoginDTO(token, usuario.getRole());
    }

    public RespostaLoginDTO cadastro(UsuarioCadastroDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um usuario com este email");
        }
        String encryptedPassword = passwordEncoder.encode(dto.senha());
        Usuario usuario = new Usuario(dto.nome(), dto.email(), encryptedPassword, dto.role());
        Boolean recebeEmail = false;
        if (dto.recebeEmail() != null) {
            recebeEmail = dto.recebeEmail();
        }
        usuario.setRecebeEmail(recebeEmail);
        repository.save(usuario);
        String token = tokenService.generateToken(usuario);

        return new RespostaLoginDTO(token,usuario.getRole());
    }
}