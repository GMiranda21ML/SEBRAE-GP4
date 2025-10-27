package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.model.Email;
import br.com.sebrae.projetos.grupo04.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    private List<Email> emails = Arrays.asList(
            new Email("rjdo@cesar.school", "teste rod", "texto de teste"),
            new Email("ams10@cesar.school", "teste gg", "texto de teste"));

    @GetMapping("/send")
    public ResponseEntity<String> sendEmail() {
        for (Email email : emails) {
            emailService.enviarEmail(email.getDestinatarioEmail(), email.getAssunto(), email.getTexto());
        }

        return ResponseEntity.ok("E-mail enviado com sucesso!");
    }
}

