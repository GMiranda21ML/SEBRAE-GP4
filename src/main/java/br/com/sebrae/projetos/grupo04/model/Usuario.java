package br.com.sebrae.projetos.grupo04.model;

import br.com.sebrae.projetos.grupo04.DTO.UsuarioCadastroDTO;
import br.com.sebrae.projetos.grupo04.model.enums.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;
    private String nome;
    @Column(unique = true)
    private String email;
    private String senha;
    @Enumerated(EnumType.STRING)
    private Role role;

    public Usuario() {}

    public Usuario(String nome, String email, String senha, Role role, PasswordEncoder passwordEncoder) {
        this.nome = nome;
        this.email = email;
        this.senha = passwordEncoder.encode(this.senha);
        this.role = role;
    }

    public Usuario(UsuarioCadastroDTO dto, PasswordEncoder passwordEncoder) {
        this.nome = dto.nome();
        this.email = dto.email();
        this.senha = passwordEncoder.encode(dto.senha());
        this.role = dto.role();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
