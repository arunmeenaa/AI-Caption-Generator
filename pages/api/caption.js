import formidable from "formidable";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: false, // ❌ disable default body parsing (needed for FormData)
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse FormData
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const file = files.file[0]; // get uploaded file
    const fileData = fs.readFileSync(file.filepath, { encoding: "base64" });

    // Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate caption
    const result = await model.generateContent([
      "Write a short creative caption for this image.",
      {
        inlineData: {
          data: fileData,
          mimeType: file.mimetype,
        },
      },
    ]);

    const caption = result.response.text();
    res.status(200).json({ caption });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate caption" });
  }
}
