form.parse(req, async (err, fields, files) => {
  if (err) {
    console.error("❌ Form parse error:", err);
    return res.status(400).json({ error: "File parsing failed" });
  }

  const file = files.file;
  if (!file) {
    console.error("❌ No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("✅ File received:", file);

  try {
    const fileBuffer = await fs.readFile(file.filepath);
    const base64Image = fileBuffer.toString("base64");

    console.log("✅ Image converted to base64, length:", base64Image.length);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent([
      {
        inline_data: {
          mime_type: file.mimetype,
          data: base64Image,
        },
      },
      { text: "Generate a short Instagram-style caption for this image." },
    ]);

    const caption = result.response.text();

    console.log("✅ Caption generated:", caption);

    if (!caption || caption.trim() === "") {
      console.error("❌ Empty caption returned");
      return res.status(500).json({ error: "Empty caption returned" });
    }

    return res.status(200).json({ caption });
  } catch (apiError) {
    console.error("❌ Error during Gemini processing:", apiError);
    return res.status(500).json({ error: "Failed to generate caption" });
  }
});
