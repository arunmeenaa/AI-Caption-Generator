import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload setup (store locally in /uploads)
const upload = multer({ dest: "uploads/" });

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Route: Upload image & generate caption
app.post("/caption", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Convert image to base64
    const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });

    // Load Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send image + prompt
    const result = await model.generateContent([
      "Write a short creative caption for this image.",
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype, // e.g. "image/jpeg"
        },
      },
    ]);

    const caption = result.response.text();
    res.json({ caption });

    // Clean up uploaded file
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
