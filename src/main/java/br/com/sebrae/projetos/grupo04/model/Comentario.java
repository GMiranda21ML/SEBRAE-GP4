package br.com.sebrae.projetos.grupo04.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comentarios")
public class Comentario {

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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "sugestao_id")
    private Sugestao sugestao;

    public Comentario() {
        this.dataCriacao = LocalDateTime.now();
    }

    public Comentario(String texto, Usuario usuario, Sugestao sugestao) {
        this.texto = texto;
        this.usuario = usuario;
        this.sugestao = sugestao;
        this.dataCriacao = LocalDateTime.now();
    }

    // Getters
    public UUID getId() { return id; }
    public String getTexto() { return texto; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public Usuario getUsuario() { return usuario; }
    public Sugestao getSugestao() { return sugestao; }
}