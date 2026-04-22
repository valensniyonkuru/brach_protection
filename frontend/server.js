import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve("index.html"), "utf8");

const server = createServer((request, response) => {
  if (request.url === "/src/app.js") {
    response.writeHead(200, { "Content-Type": "application/javascript" });
    response.end(readFileSync(resolve("src/app.js"), "utf8"));
    return;
  }

  if (request.url === "/src/styles.css") {
    response.writeHead(200, { "Content-Type": "text/css" });
    response.end(readFileSync(resolve("src/styles.css"), "utf8"));
    return;
  }

  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(html);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Frontend starter listening on port 3000");
});