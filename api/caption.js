import formidable from "formidable";
import fs from "fs/promises"; // ✅ use async version
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // ✅ tells Vercel not to kill long process
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ File parse error:", err);
        return res.status(400).json({ error: "File parsing failed" });
      }

      const file = files.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      try {
        const fileBuffer = await fs.readFile(file.filepath);
        const base64Image = fileBuffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = "Generate a short Instagram-style caption for this image.";

        const result = await model.generateContent([
          {
            inline_data: {
              mime_type: file.mimetype,
              data: base64Image,
            },
          },
          { text: prompt },
        ]);

        const caption = result.response.text();

        if (!caption) {
          return res.status(500).json({ error: "Empty caption returned" });
        }

        res.status(200).json({ caption });
      } catch (apiErr) {
        console.error("⚠️ Gemini API error:", apiErr);
        res.status(500).json({ error: "Failed to generate caption" });
      }
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
