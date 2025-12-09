package br.com.sebrae.projetos.grupo04.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "sugestoes")
public class Sugestao {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;

    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToMany
    @JoinTable(
            name = "sugestao_curtidas",
            joinColumns = @JoinColumn(name = "sugestao_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> curtidas = new HashSet<>();

    // NOVO: Mapeamento dos comentários
    @OneToMany(mappedBy = "sugestao", cascade = CascadeType.ALL)
    private List<Comentario> comentarios = new ArrayList<>();

    public Sugestao() {
        this.dataCriacao = LocalDateTime.now();
    }

    public Sugestao(String texto, Usuario usuario) {
        this.texto = texto;
        this.usuario = usuario;
        this.dataCriacao = LocalDateTime.now();
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Set<Usuario> getCurtidas() { return curtidas; }
    public List<Comentario> getComentarios() { return comentarios; }

    public void adicionarCurtida(Usuario usuario) {
        this.curtidas.add(usuario);
    }

    public void removerCurtida(Usuario usuario) {
        this.curtidas.remove(usuario);
    }
}