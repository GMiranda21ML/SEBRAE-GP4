package br.com.sebrae.projetos.grupo04.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "pesquisas")
public class Pesquisa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descricao;
    @OneToMany(mappedBy = "pesquisa")
    private List<Pergunta> perguntas;

    public Pesquisa() {}

    public Pesquisa(String titulo, String descricao, List<Pergunta> perguntas) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.perguntas = perguntas;
    }

    public Long getId() {
        return this.id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return this.descricao;
    }

    // não sei se no banco ja atualiza, mas se nao atualizar, cria um set dps
    public List<Pergunta> getPerguntas() {
        return this.perguntas;
    }
}
