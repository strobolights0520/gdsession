import { createServer } from "node:http";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function localConfigScript() {
  const envConfig = {
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "").split(",").map(v => v.trim()).filter(Boolean),
  };

  if (envConfig.SUPABASE_URL && envConfig.SUPABASE_ANON_KEY) {
    return `window.OPEN_GD_CONFIG = ${JSON.stringify(envConfig)};`;
  }

  try {
    return readFileSync(join(root, "src/config.local.js"), "utf-8");
  } catch {
    return `window.OPEN_GD_CONFIG = ${JSON.stringify(envConfig)};`;
  }
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  if (urlPath === "/api/config.js") {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(localConfigScript());
    return;
  }
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath === "/" ? "index.html" : safePath);

  try {
    if (!statSync(filePath).isFile()) throw new Error("not found");
    res.setHeader("Content-Type", types[extname(filePath)] || "application/octet-stream");
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`OPEN GD is running at http://127.0.0.1:${port}`);
});
