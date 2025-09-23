package br.com.sebrae.projetos.grupo04.model;

import br.com.sebrae.projetos.grupo04.model.enums.TipoPergunta;

public class Pergunta {
    private Long id;
    private String texto;
    private TipoPergunta tipo;
    private Boolean ehObrigatoria;

    public Pergunta() {}

    public Pergunta(String texto, TipoPergunta tipo, Boolean ehObrigatoria) {
        this.texto = texto;
        this.tipo = tipo;
        this.ehObrigatoria = ehObrigatoria;
    }

    public Long getId() {
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


}
