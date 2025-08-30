import React, { useState } from "react";
import { motion } from "framer-motion";
import Footer from "./components/Footer";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ API endpoint (local vs deployed)
  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/caption"
      : "/api/caption";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ send as FormData

      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate caption");

      const data = await res.json();
      setCaption(data.caption);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate caption");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-purple-200 to-indigo-200">
      <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-6">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-purple-800 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          AI Caption Generator
        </motion.h1>

        <label className="w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-xl p-4 sm:p-6 bg-white shadow-md cursor-pointer hover:bg-purple-50 transition text-center">
          <span className="text-gray-600 text-sm sm:text-base mb-2">
            Click or Drag & Drop Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-lg shadow"
            />
          )}
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition-transform text-sm sm:text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Generating...
            </span>
          ) : (
            "✨ Generate Caption"
          )}
        </button>

        {caption && (
          <motion.div
            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white shadow-xl rounded-xl w-full max-w-sm sm:max-w-md text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-base sm:text-lg font-semibold text-purple-700">
              Generated Caption
            </h2>
            <p className="mt-2 sm:mt-3 text-gray-700 italic text-sm sm:text-base">
              “{caption}”
            </p>

            <button
              onClick={handleCopy}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition text-sm sm:text-base"
            >
              {copied ? "✅ Copied!" : "📋 Copy Caption"}
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
