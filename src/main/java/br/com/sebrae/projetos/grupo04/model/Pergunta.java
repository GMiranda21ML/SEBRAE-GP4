package br.com.sebrae.projetos.grupo04.model;

import br.com.sebrae.projetos.grupo04.model.enums.TipoPergunta;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;
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
    private Boolean obrigatoria;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pesquisa_id")
    private Pesquisa pesquisa;
//    @OneToMany(mappedBy = "pergunta", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Resposta> respostas = new ArrayList<>();


    public Pergunta() {}

    public Pergunta(String texto, TipoPergunta tipo, Boolean obrigatoria) {
        this.texto = texto;
        this.tipo = tipo;
        this.obrigatoria = obrigatoria;
    }

    public Pergunta(String texto, TipoPergunta tipo, Boolean obrigatoria, Pesquisa pesquisa) {
        this.texto = texto;
        this.tipo = tipo;
        this.obrigatoria = obrigatoria;
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

    public void setObrigatoria(Boolean obrigatoria) {
        this.obrigatoria = obrigatoria;
    }

    public Boolean getObrigatoria() {
        return this.obrigatoria;
    }

    public void setPesquisa(Pesquisa pesquisa) {
        this.pesquisa = pesquisa;
    }

    public Pesquisa getPesquisa() {
        return this.pesquisa;
    }

//    public List<Resposta> getRespostas() {
//        return this.respostas;
//    }

}
