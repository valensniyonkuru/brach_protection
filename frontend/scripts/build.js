import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";

if (existsSync("dist")) {
  rmSync("dist", { recursive: true, force: true });
}

mkdirSync("dist", { recursive: true });
cpSync("index.html", "dist/index.html");
cpSync("src", "dist/src", { recursive: true });

console.log("Frontend build output generated in dist/");