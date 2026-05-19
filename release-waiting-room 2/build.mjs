import { mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";

const out = "dist";
const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "").split(",").map(v => v.trim()).filter(Boolean),
};

function copy(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "src"), { recursive: true });

copy("index.html", join(out, "index.html"));
copy("src/standalone.jsx", join(out, "src/standalone.jsx"));

const htmlPath = join(out, "index.html");
const html = readFileSync(htmlPath, "utf-8").replace("/api/config.js", "/src/config.js");
writeFileSync(htmlPath, html);

writeFileSync(
  join(out, "src/config.js"),
  `window.OPEN_GD_CONFIG = ${JSON.stringify(config)};\n`
);
