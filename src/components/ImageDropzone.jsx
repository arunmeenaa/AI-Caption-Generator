import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
        isDragActive ? "border-purple-500 bg-purple-100" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-purple-600 font-semibold">Drop your image here...</p>
      ) : (
        <p className="text-gray-500">
          Drag & drop an image here, or <span className="text-purple-600 font-semibold">click to browse</span>
        </p>
      )}
    </div>
  );
}
