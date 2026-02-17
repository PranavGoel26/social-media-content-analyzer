const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse/lib/pdf-parse.js");


const Tesseract = require("tesseract.js");
const fs = require("fs");


const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });


app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "tinyllama",
        prompt: `
        You are a social media growth analyst.

        Analyze this post and suggest:
        - A short summary
        - A score out of 10
        - Engagement improvements
        - Relevant hashtags

        Post:
        "${text}"
        `,
        stream: false,
        options: {
          temperature: 0.2
        }
      }
    );

    const rawResponse = response.data.response;

    console.log("LLM RAW RESPONSE:\n", rawResponse);

    // Just return raw text
    res.json({ result: rawResponse });

  }
   catch (error) {
    console.error("Backend error:", error.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
});



app.post("/analyze-file", upload.single("file"), async (req, res) => {
   console.log("File route hit");
   console.log("File object:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    let extractedText = "";

    // PDF Handling
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);

      extractedText = pdfData.text;
    }
  


    // Image OCR Handling
    else if (mimeType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    }

    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send extracted text to Ollama
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "tinyllama",
        prompt: `
        You are a social media growth analyst.

        Analyze this content and suggest:
        - A short summary
        - A score out of 10
        - Engagement improvements
        - Relevant hashtags

        Content:
        "${extractedText}"
        `,
        stream: false,
        options: { temperature: 0.2 }
      }
    );

    return res.json({
      extractedText,
      result: response.data.response
    });

  } catch (error) {
    console.error("File analyze error:", error.message);
    return res.status(500).json({ error: "File analysis failed" });
  }
});




app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
