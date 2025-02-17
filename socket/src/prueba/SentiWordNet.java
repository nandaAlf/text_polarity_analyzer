package prueba;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;

public class SentiWordNet {
    private Map<String, Double> wordPolarities;

    public SentiWordNet(String pathToSentiWordNet) throws Exception {
        wordPolarities = new HashMap<>();
        loadSentiWordNet(pathToSentiWordNet);
    }

    private void loadSentiWordNet(String path) throws Exception {
        BufferedReader reader = new BufferedReader(new FileReader(path));
        String line;

        while ((line = reader.readLine()) != null) {
            // Ignorar comentarios
            if (line.startsWith("#")) {
                continue;
            }

            String[] parts = line.split("\t");
            if (parts.length != 6) {
                continue;
            }

            String pos = parts[0]; // Parte del discurso (n, v, a, r)
            String synsetTerms = parts[4]; // Términos y sentidos
            double posScore = Double.parseDouble(parts[2]);
            double negScore = Double.parseDouble(parts[3]);
            double polarity = posScore - negScore; 

            // Agregar términos al mapa
            for (String term : synsetTerms.split(" ")) {
                String[] termParts = term.split("#");
                String word = termParts[0] + "#" + pos; // Ejemplo: "happy#a"
                int senseNumber = Integer.parseInt(termParts[1]);

                // Usar el primer sentido (más frecuente)
                if (senseNumber == 1) {
                    wordPolarities.put(word, polarity);
                }
            }
        }

        reader.close();
    }

    public double getPolarity(String word, String pos) {
        String key = word + "#" + pos;
        return wordPolarities.getOrDefault(key, 0.0);
    }
}
