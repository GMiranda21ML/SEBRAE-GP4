package br.com.sebrae.projetos.grupo04.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "respostas")
public class Resposta {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;
    private String respostaTexto;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pergunta_id")
    private Pergunta pergunta;

    public Resposta() {}

    public Resposta(String respostaTexto, Pergunta pergunta) {
        this.respostaTexto = respostaTexto;
        this.pergunta = pergunta;
    }

    public UUID getId() {
        return this.id;
    }

    public void setRespostaTexto(String respostaTexto) {
        this.respostaTexto = respostaTexto;
    }

    public String getRespostaTexto() {
        return this.respostaTexto;
    }

    public void setPergunta(Pergunta pergunta) {
        this.pergunta = pergunta;
    }

    public Pergunta getPergunta() {
        return this.pergunta;
    }

    @JsonProperty("perguntaId")
    public UUID getPerguntaId() {
        if (this.pergunta != null) {
            return this.pergunta.getId();
        }
        return null;
    }

}
