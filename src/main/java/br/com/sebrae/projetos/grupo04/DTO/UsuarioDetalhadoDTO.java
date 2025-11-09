package br.com.sebrae.projetos.grupo04.DTO;

import br.com.sebrae.projetos.grupo04.model.enums.Role;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public record UsuarioDetalhadoDTO(
        UUID id,
        String nome,
        String email,
        Role role,
        Boolean recebeEmail,
        Boolean enabled,
        Boolean accountNonExpired,
        Boolean credentialsNonExpired,
        String username,
        Boolean accountNonLocked,
        Collection<? extends GrantedAuthority> authorities
) {
}
