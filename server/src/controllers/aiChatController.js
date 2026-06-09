const https = require("https");
const { RecyclerSchedule } = require("../models/RecyclerSchedule");
const { Shipment } = require("../models/Shipment");
const { TransactionLedger } = require("../models/TransactionLedger");

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

    // Role-based scoping check
    let systemContext = "You are EcoXchange assistant: waste segregation, recycling, rewards, marketplace, India context. Be concise.";
    
    if (req.user && req.user.role === "recycler") {
      // Security enforcement: prohibit access to admin stats, other user data
      const lastMessageText = messages[messages.length - 1]?.content || "";
      const lower = lastMessageText.toLowerCase();
      if (
        lower.includes("admin") ||
        lower.includes("all users") ||
        lower.includes("platform secrets") ||
        lower.includes("system configuration") ||
        lower.includes("key_secret")
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Recyclers cannot query system-wide configuration or admin scopes.",
        });
      }

      // Fetch dynamic recycler contextual data for the conversation
      const schedules = await RecyclerSchedule.find({ recycler: req.user._id }).limit(5);
      const shipments = await Shipment.find({ recycler: req.user._id }).limit(5);
      const ledgerCredits = await TransactionLedger.find({ user: req.user._id, type: "credit" }).limit(5);

      systemContext += ` You are answering a Recycler client.
Here is their current context to help answer queries:
- Active Schedules: ${JSON.stringify(schedules)}
- Recent Shipments: ${JSON.stringify(shipments)}
- Financial Credits: ${JSON.stringify(ledgerCredits)}
Strictly refuse to disclose any secrets or system details beyond this recycler scope.`;
    }

    const payload = JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemContext,
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

    // Emit chatbot stream/response update if socket server configured
    const io = req.app.get("io");
    if (io) {
      io.to(String(req.user._id)).emit("chat:stream", { reply: text });
    }

    return res.json({ success: true, data: { reply: text } });
  } catch (e) {
    return next(e);
  }
};

module.exports = { chat };

