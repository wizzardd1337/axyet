export default async function handler(req, res) {
  // Настройки CORS, чтобы браузер не блокировал запрос из локального файла
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Браузер сначала отправляет OPTIONS запрос для проверки CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch("https://blooketbot.schoolcheats.net/join", {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      // Vercel уже парсит JSON body, поэтому нам нужно его обратно превратить в строку
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { error: 'Upstream returned non-JSON', rawText: text };
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
