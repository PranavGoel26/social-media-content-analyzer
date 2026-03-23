
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse/lib/pdf-parse.js");
const Tesseract = require("tesseract.js");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
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
            "You are a social media growth analyst. You MUST respond with ONLY valid JSON containing the following keys: \"summary\" (string), \"score\" (number out of 10), \"improvements\" (array of strings), and \"hashtags\" (array of strings). Do not include markdown code blocks or any other surrounding text."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  let rawContent = response.data.choices[0].message.content;
  try {
    // Attempt to clear markdown backticks if any were generated despite instructions
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(rawContent);
  } catch (e) {
    console.error("Failed to parse AI JSON response:", rawContent);
    // Return a fallback object so frontend structure doesn't break
    return {
      summary: rawContent,
      score: 0,
      improvements: ["Analysis parsing failed. Try again."],
      hashtags: []
    };
  }
}

/*  TEXT ANALYSIS */

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

/*  FILE ANALYSIS */

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


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});



