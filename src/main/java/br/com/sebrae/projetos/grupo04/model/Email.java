package br.com.sebrae.projetos.grupo04.model;

public class Email {
    private String destinatarioEmail;
    private String assunto;
    private String texto;

    public Email(String destinatarioEmail, String assunto, String texto) {
        this.destinatarioEmail = destinatarioEmail;
        this.assunto = assunto;
        this.texto = texto;
    }

    public String getDestinatarioEmail() {
        return destinatarioEmail;
    }

    public String getAssunto() {
        return assunto;
    }

    public String getTexto() {
        return texto;
    }
}
