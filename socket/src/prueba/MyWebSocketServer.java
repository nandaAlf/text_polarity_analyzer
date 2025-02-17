/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package prueba;

import org.java_websocket.handshake.ClientHandshake;
import java.net.InetSocketAddress;
import java.util.*;
import java.util.Map;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import edu.stanford.nlp.ling.*;
import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.util.CoreMap;
import edu.stanford.nlp.pipeline.Annotation;

/**
 *
 * @author Admin
 */
public class MyWebSocketServer extends WebSocketServer {

    private SentiWordNet sentiWordNet;
    private StanfordCoreNLP pipeline;

    public MyWebSocketServer(String sentiWordNetPath, int port) throws Exception {
//        super(address);
//        sentiWordNet = new SentiWordNet(sentiWordNetPath);
        super(new InetSocketAddress(port));

        // Configurar Stanford CoreNLP
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma");
        this.pipeline = new StanfordCoreNLP(props);

        // Cargar SentiWordNet
        try {
            this.sentiWordNet = new SentiWordNet(sentiWordNetPath);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error al cargar SentiWordNet.");
        }
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("Cliente conectado: " + conn.getRemoteSocketAddress());
        conn.send("¡Bienvenido al servidor WebSocket!");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Conexión cerrada con el cliente: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Mensaje recibido: " + message);

        // Crear anotación con Stanford CoreNLP
        Annotation document = new Annotation(message);
        pipeline.annotate(document);

        double totalPolarity = 0.0;
        int wordCount = 0;

        List<Map<String, String>> results = new ArrayList<>();


        for (CoreMap sentence : document.get(CoreAnnotations.SentencesAnnotation.class)) {
            for (CoreLabel token : sentence.get(CoreAnnotations.TokensAnnotation.class)) {
                String word = token.get(CoreAnnotations.TextAnnotation.class);
                String lemma = token.get(CoreAnnotations.LemmaAnnotation.class);
                String pos = token.get(CoreAnnotations.PartOfSpeechAnnotation.class);

                // Convertir POS al formato de SentiWordNet
                String sentiWordNetPOS = convertPOSToSentiWordNet(pos);
                String color = "white"; // Default

                if (sentiWordNetPOS != null) {
                    double polarity = sentiWordNet.getPolarity(lemma, sentiWordNetPOS);
                    totalPolarity += polarity;
                    wordCount++;

                    // Determinar color según polaridad
                    if (polarity > 0) {
                        color = "green";
                    } else if (polarity < 0) {
                        color = "red";
                    }
                }

                // Agregar palabra y color al resultado
                Map<String, String> entry = new LinkedHashMap<>();
                entry.put("word", word);
                entry.put("color", color);
                results.add(entry);
            }
        }

        // Calcular y mostrar la polaridad promedio
        double averagePolarity = (wordCount > 0) ? totalPolarity / wordCount : 0.0;
        System.out.printf("Polaridad promedio del texto: %.2f%n", averagePolarity);

        // Crear objeto que contiene resultados y polaridad promedio
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("results", results);
        response.put("averagePolarity", averagePolarity);

        Gson gson = new Gson();
        String json = gson.toJson(response);
        conn.send(json);
        System.out.println(json); // Simula el envío al cliente
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    private String convertPOSToSentiWordNet(String pos) {
        if (pos.startsWith("J")) {
            return "a"; // Adjetivo
        }
        if (pos.startsWith("V")) {
            return "v"; // Verbo
        }
        if (pos.startsWith("N")) {
            return "n"; // Sustantivo
        }
        if (pos.startsWith("R")) {
            return "r"; // Adverbio
        }
        return null; // Otros no se procesan
    }

}
