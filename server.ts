import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Kangeyam Cattle AI Server" });
});

// Grounded RAG Knowledge Base Search & Chat Endpoint
app.post("/api/rag/query", async (req, res) => {
  try {
    const { question, language, context } = req.body;
    const ai = getAI();

    if (!ai) {
      // Offline fallback response based on verified domain rules
      return res.json({
        success: true,
        source: "local-knowledge-base",
        answer:
          language === "ta"
            ? "காங்கேயம் மாடுகள் தமிழகத்தின் பூர்வீக இனம். இவை உழவு, உழைப்பு மற்றும் தரமான ஏ2 (A2) பால் உற்பத்திக்கு புகழ்பெற்றவை. தினமும் 15-20 கிலோ உலர்/பசும் தீவனம், 30-40 கிராம் தாது உப்பு மற்றும் சுத்தமான குடிநீர் அளிப்பது உற்பத்திக்கும் ஆரோக்கியத்திற்கும் இன்றியமையாதது."
            : "Kangeyam cattle are a resilient indigenous draught and dual-purpose breed native to Tamil Nadu. They thrive on native pastures and produce nutrient-rich A2 milk. Essential care requires 15-20 kg balanced green/dry roughage, 30-40g mineral mixture, and clean water daily.",
      });
    }

    const systemPrompt = `You are the Kangeyam Cattle AI Expert Assistant, a dedicated advisor for Tamil Nadu farmers raising Kangeyam indigenous cattle.
IMPORTANT RULES:
1. Language: Answer strictly in ${language === "ta" ? "simple, natural, respectful Tamil (எளிய, தூய தமிழ்) suitable for farmers" : "clear, simple English"}.
2. Breed Specifics: Focus specifically on Kangeyam cattle (மயிலை, காரி, செவலை, முரம்பு). Note that Kangeyam is primarily a draught and dual-purpose breed with typical milk yield of 2.5 to 6 liters/day, high A2 fat (4.5-5.5%), and high genetic/draught value.
3. Medical Safety: NEVER prescribe specific antibiotics, surgical doses, or autonomous veterinary prescriptions. Always advise consulting a licensed veterinary surgeon (கால்நடை மருத்துவர்) for disease symptoms.
4. Grounding: Answer using verified animal husbandry, feeding (dry fodder, cumbu napier, azolla, mineral mixture), vaccination (FMD, BQ, Anthrax), and lactation management.
5. Tone: Encouraging, practical, clear, structured with bullet points. Avoid robotic translations.

Context from knowledge base:
${context || "Kangeyam cattle breed standards, TANUVAS feed formulations, disease prevention guidelines."}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const text = response.text || "";
    res.json({ success: true, answer: text, source: "gemini-grounded" });
  } catch (error: any) {
    console.error("RAG Query Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process question",
    });
  }
});

// Voice Query Assistant Endpoint
app.post("/api/voice/assist", async (req, res) => {
  try {
    const { transcript, language, animalData } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        success: true,
        reply:
          language === "ta"
            ? "உங்கள் கேள்வியை ஆராய்ந்தோம். மாட்டின் தீவன அளவு, தண்ணீர் மற்றும் உடல் வெப்பநிலையை சரிபார்க்கவும். சந்தேகம் இருப்பின் கால்நடை மருத்துவரை அணுகவும்."
            : "We analyzed your query. Please review daily feed intake, water access, and body temperature. If symptoms persist, consult a veterinarian.",
      });
    }

    const prompt = `The farmer asked via voice in ${language === "ta" ? "Tamil" : "English"}: "${transcript}"
Current cattle info (if any): ${JSON.stringify(animalData || {})}

Provide a concise, direct, helpful, and empathetic answer (max 3-4 sentences) suitable for voice playback to a rural farmer.
Language of response MUST be: ${language === "ta" ? "Natural farmer-friendly Tamil (சுலபமான தமிழ்)" : "Simple English"}.
Do not give complex medical prescriptions. Advise on practical feed, management, or vet consultation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    res.json({ success: true, reply: response.text || "" });
  } catch (error: any) {
    console.error("Voice Assist Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kangeyam Cattle AI Server running on port ${PORT}`);
  });
}

startServer();
