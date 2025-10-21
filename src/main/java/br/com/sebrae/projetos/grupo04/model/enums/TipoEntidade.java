package br.com.sebrae.projetos.grupo04.model.enums;

public enum TipoEntidade {
    PESQUISA(1,"pesquisa"),
    PERGUNTA(2,"pergunta"),
    RESPOSTA(3,"resposta");

    private Integer id;
    private String tipoEntidade;

    private TipoEntidade(Integer id, String tipoEntidade) {
        this.id = id;
        this.tipoEntidade = tipoEntidade;
    }
}
