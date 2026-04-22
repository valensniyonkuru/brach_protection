package com.brachprotection.backend;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public final class App {
    private App() {
    }

    public static String health() {
        return "ok";
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/health", new TextHandler(health()));
        server.createContext("/", new TextHandler("branch-protection backend starter"));
        server.setExecutor(null);
        server.start();
        System.out.println("Backend starter listening on port " + port);
    }

    private static final class TextHandler implements HttpHandler {
        private final byte[] body;

        private TextHandler(String body) {
            this.body = body.getBytes();
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().add("Content-Type", "text/plain; charset=utf-8");
            exchange.sendResponseHeaders(200, body.length);
            try (OutputStream outputStream = exchange.getResponseBody()) {
                outputStream.write(body);
            }
        }
    }
}