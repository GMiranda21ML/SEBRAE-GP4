package br.com.sebrae.projetos.grupo04.consumoapi;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ConsumoAPI {

    public String ObterDados(String endereco){

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().
                uri(URI.create(endereco))
                .build();
        HttpResponse<String> response = null;

        try{
            response = client.send(request, HttpResponse.BodyHandlers.ofString());

        }catch (IOException e){
            throw new RuntimeException(e); //usar serr
        }catch (InterruptedException e ){
            throw new RuntimeException(e); //usar serr
        }

        String json = response.body();
        return json;
    }
}
