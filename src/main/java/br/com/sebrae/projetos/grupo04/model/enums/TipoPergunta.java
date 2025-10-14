package br.com.sebrae.projetos.grupo04.model.enums;

public enum TipoPergunta {
    TEXTO(1, "Texto"),
    MULTIPLA_ESCOLHA(2, "Multipla escolha"),
    SIM_NAO(3, "Sim ou Não");

    private Integer id;
    private String tipoPergunta;

    private TipoPergunta(Integer id, String tipoPergunta) {
        this.id = id;
        this.tipoPergunta = tipoPergunta;
    }
}
