package br.com.sebrae.projetos.grupo04.repository;

import br.com.sebrae.projetos.grupo04.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    boolean existsByEmail(String email);
    UserDetails findByEmail(String email);
}
