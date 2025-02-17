/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package prueba;

import java.net.InetSocketAddress;
import java.util.Scanner;

public class Prueba {

//    public static final String ANSI_RESET = "\u001B[0m";
//    public static final String ANSI_GREEN = "\u001B[32m";
//    public static final String ANSI_RED = "\u001B[31m";
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
//         Puerto 8081 para el servidor WebSocket
        int port = 8081;
        String sentiWorNetPath=""; // Path to sentiWordNet
        try {

            MyWebSocketServer server = new MyWebSocketServer(sentiWorNetPath, port);
            server.start();
            System.out.println("Servidor WebSocket iniciado en el puerto 8081.");
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
}
