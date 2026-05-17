function parseList(value) {
  if (!value) return [];
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

export default function handler(req, res) {
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    ADMIN_EMAILS: parseList(process.env.ADMIN_EMAILS || ""),
  };

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(`window.OPEN_GD_CONFIG = ${JSON.stringify(config)};`);
}
