const https = require("https");

const chat = async (req, res, next) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ success: false, message: "messages[] required" });
    }
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({
        success: false,
        message: "OPENAI_API_KEY not configured",
      });
    }

    const payload = JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are EcoXchange assistant: waste segregation, recycling, rewards, marketplace, India context. Be concise.",
        },
        ...messages,
      ],
    });

    const data = await new Promise((resolve, reject) => {
      const r = https.request(
        {
          hostname: "api.openai.com",
          path: "/v1/chat/completions",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (resp) => {
          let body = "";
          resp.on("data", (c) => (body += c));
          resp.on("end", () => {
            if (resp.statusCode && resp.statusCode >= 400) {
              reject(new Error(body || resp.statusMessage));
            } else resolve(body);
          });
        },
      );
      r.on("error", reject);
      r.write(payload);
      r.end();
    });

    const json = JSON.parse(data);
    const text = json.choices?.[0]?.message?.content || "";
    return res.json({ success: true, data: { reply: text } });
  } catch (e) {
    return next(e);
  }
};

module.exports = { chat };
