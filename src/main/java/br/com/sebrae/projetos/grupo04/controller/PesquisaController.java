package br.com.sebrae.projetos.grupo04.controller;

import br.com.sebrae.projetos.grupo04.DTO.CriarPesquisaDTO;
import br.com.sebrae.projetos.grupo04.model.Pergunta;
import br.com.sebrae.projetos.grupo04.model.Pesquisa;
import br.com.sebrae.projetos.grupo04.model.Usuario;
import br.com.sebrae.projetos.grupo04.model.enums.TipoEntidade;
import br.com.sebrae.projetos.grupo04.service.EmailService;
import br.com.sebrae.projetos.grupo04.service.GenericoService;
import br.com.sebrae.projetos.grupo04.service.PesquisaService;
import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pesquisa")
public class PesquisaController {
    @Autowired
    private GenericoService service;
    @Autowired
    private PesquisaService pesquisaService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/{id}/disparar-email")
    public ResponseEntity<String> dispararPesquisaEmail(@PathVariable UUID id){
        Pesquisa pesquisa;
        try{
            pesquisa = service.findPesquisaById(id);
        }catch (ResourceNotFoundException e ){
            return ResponseEntity.notFound().build();
        }
        List<Usuario> usuarios = service.findAll(TipoEntidade.USUARIO);
        if(usuarios.isEmpty()){
            System.err.println("Usuário não encontrado");
        }
        final String LINK_SITE= "https://sebrae-gp4-bh75.onrender.com/responderPesquisa.html?id=";
        String assunto = "Responder nova pesquisa: " + pesquisa.getTitulo();
        String linkAcesso  = LINK_SITE + pesquisa.getId();
        String mensagemPadrao = "Olá, %s!\n"
                + "Gostaria de responder nossa nova pesquisa?\n"
                + "Titulo: %s\n"
                + "Descrição: %s\n"
                + "Responda por este link: %s\n"
                + "Obrigado pela anteção.";
        int emailEnviados = 0;
        int falhasEnviar = 0;

        for (Usuario usuario : usuarios){
            if (usuario.isRecebeEmail() != null && usuario.isRecebeEmail()) {

                String emailDestinatario = usuario.getEmail();
                String nomeDestinatario = usuario.getNome();

                String formatoEmail = String.format(mensagemPadrao,
                        nomeDestinatario,
                        pesquisa.getTitulo(),
                        pesquisa.getDescricao(),
                        linkAcesso
                );
                try{
                    emailService.enviarEmail(emailDestinatario, assunto, formatoEmail);
                    emailEnviados++;
                }catch (MailException e){
                    System.err.println("Erro ao enviar email para: " + emailDestinatario);
                    e.printStackTrace();
                    falhasEnviar++;
                }
            }
        }
        String logDisparos = "Emails enviados: "+emailEnviados+ "\nFalhas ao enviar: "+ falhasEnviar;
        return ResponseEntity.ok(logDisparos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pesquisa> findById(@PathVariable UUID id) {
        Pesquisa pesquisa = service.findPesquisaById(id);
        return ResponseEntity.ok().body(pesquisa);
    }

    @GetMapping
    public ResponseEntity<List<Pesquisa>> findAll() {
        List<Pesquisa> pesquisas = service.findAll(TipoEntidade.PESQUISA);
        return ResponseEntity.ok().body(pesquisas);
    }

    @PostMapping
    public ResponseEntity<Pesquisa> criarPesquisa(@RequestBody @Valid CriarPesquisaDTO dto) {
        Pesquisa pesquisa = pesquisaService.criarPesquisa(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(pesquisa.getId())
                .toUri();

        return ResponseEntity.created(uri).body(pesquisa);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarPesquisa(@PathVariable UUID id) {
        pesquisaService.deletarPesquisa(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/editar/{id}")
    public ResponseEntity<Void> editarPesquisa(@RequestBody @Valid CriarPesquisaDTO dto, @PathVariable UUID id) {
        pesquisaService.editarPesquisa(dto, id);
        return ResponseEntity.ok().build();
    }
}