import formidable from "formidable";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Get your Gemini API key from env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const config = {
  api: {
    bodyParser: false, // 🚨 must be false for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("❌ File parse error:", err);
          return res.status(400).json({ error: "File parsing failed" });
        }

        const file = files.file;
        if (!file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = file.filepath;
        const fileBuffer = fs.readFileSync(filePath);

        // ✅ Convert image to base64
        const base64Image = fileBuffer.toString("base64");

        // 🧠 Call Gemini Pro Vision model
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = "Generate a short Instagram-style caption for this image.";

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.mimetype,
              data: base64Image,
            },
          },
          { text: prompt },
        ]);

        const caption = result.response.text();

        res.status(200).json({ caption });
      });
    } catch (error) {
      console.error("⚠️ Gemini API error:", error);
      res.status(500).json({ error: "Failed to generate caption" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
