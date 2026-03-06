import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import makeWASocket, { useSingleFileAuthState, MessageType } from "@adiwajshing/baileys";
import fs from "fs-extra";

const { state, saveState } = useSingleFileAuthState("./sessions/queen-bella.json");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Initialize WhatsApp
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
});

sock.ev.on("creds.update", saveState);
sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close" && lastDisconnect.error?.output?.statusCode !== 401) {
        console.log("Reconnecting...");
    } else if (connection === "open") {
        console.log("WhatsApp connected!");
    }
});

// Fixed pairing code
const PAIR_CODE = "ROYTECH4";

app.post("/api/pair", async (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

    if (code !== PAIR_CODE) {
        return res.status(403).json({ error: "Invalid pairing code" });
    }

    // Create JSON with placeholder session id
    const sessionData = {
        sessionId: "PLACEHOLDER_FOR_SESSION_ID",
        footer: "𝐐𝐮𝐞𝐞𝐧 𝐁𝐞𝐥𝐥𝐚 𝐌𝐃 𝐣𝐬𝐨𝐧",
        joinButton: "https://wa.me/254755660053"
    };

    const jsonFilePath = `./sessions/${phone}-queen-bella.json`;
    await fs.writeJson(jsonFilePath, sessionData, { spaces: 2 });

    // Send JSON file via WhatsApp
    try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, {
            document: { url: jsonFilePath },
            mimetype: "application/json",
            fileName: "queen-bella.json",
            caption: "𝐐𝐮𝐞𝐞𝐧 𝐁𝐞𝐥𝐥𝐚 𝐌𝐃 JSON"
        });

        res.json({ success: true, message: "JSON sent to WhatsApp!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send JSON via WhatsApp" });
    }
});

// Serve frontend
app.use(express.static("public"));

app.listen(port, () => console.log(`Pairing site running on http://localhost:${port}`));