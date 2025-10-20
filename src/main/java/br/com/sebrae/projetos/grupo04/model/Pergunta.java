package br.com.sebrae.projetos.grupo04.model;

import br.com.sebrae.projetos.grupo04.model.enums.TipoPergunta;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "perguntas")
public class Pergunta {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;
    private String texto;
    @Enumerated(EnumType.STRING)
    private TipoPergunta tipo;
    private Boolean ehObrigatoria;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pesquisa_id")
    private Pesquisa pesquisa;
    @JsonIgnore
    @OneToOne(mappedBy = "pergunta")
    private Resposta resposta;

    public Pergunta() {}

    public Pergunta(String texto, TipoPergunta tipo, Boolean ehObrigatoria) {
        this.texto = texto;
        this.tipo = tipo;
        this.ehObrigatoria = ehObrigatoria;
    }

    public Pergunta(String texto, TipoPergunta tipo, Boolean ehObrigatoria, Pesquisa pesquisa) {
        this.texto = texto;
        this.tipo = tipo;
        this.ehObrigatoria = ehObrigatoria;
        this.pesquisa = pesquisa;
    }

    public UUID getId() {
        return this.id;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getTexto() {
        return this.texto;
    }

    public void setTipo(TipoPergunta tipo) {
        this.tipo = tipo;
    }

    public TipoPergunta getTipo() {
        return this.tipo;
    }

    public void setEhObrigatoria(Boolean ehObrigatoria) {
        this.ehObrigatoria = ehObrigatoria;
    }

    public Boolean getEhObrigatoria() {
        return this.ehObrigatoria;
    }

    public void setPesquisa(Pesquisa pesquisa) {
        this.pesquisa = pesquisa;
    }

    public Pesquisa getPesquisa() {
        return this.pesquisa;
    }

}
