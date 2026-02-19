require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse/lib/pdf-parse.js");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://social-media-content-analyzer-pi.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
const upload = multer({ dest: "uploads/" });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY in environment variables");
  process.exit(1);
}

async function callGroq(content) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a social media growth analyst. Provide a short summary, a score out of 10, engagement improvements, and relevant hashtags."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}

/* ===================== TEXT ANALYSIS ===================== */

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const result = await callGroq(text);

    console.log("LLM RAW RESPONSE:\n", result);

    return res.json({ result });

  } catch (error) {
    console.error("Backend error:", error.response?.data || error.message);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

/* ===================== FILE ANALYSIS ===================== */

app.post("/analyze-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let extractedText = "";

    // PDF
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    }

    // Image OCR
    else if (mimeType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    }

    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Delete file after processing
    fs.unlinkSync(filePath);

    const result = await callGroq(extractedText);

    return res.json({
      extractedText,
      result
    });

  } catch (error) {
    console.error("File analyze error:", error.response?.data || error.message);
    return res.status(500).json({ error: "File analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


