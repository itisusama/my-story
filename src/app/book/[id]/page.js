"use client";

import { useState } from "react";

export default function BookDetail({ params }) {
  const { id } = params; // Get book ID from URL parameters
  const [chapterName, setChapterName] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [message, setMessage] = useState("");

  // Handle save button click to save chapter
  const saveChapter = async () => {
    if (chapterName.trim() && chapterContent.trim()) {
      const response = await fetch("/api/saveChapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id, // Send bookId to associate with chapter
          name: chapterName,
          content: chapterContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Chapter saved successfully!");
        setChapterName("");
        setChapterContent("");
        setTimeout(() => setMessage(""), 20000); // Clear message after 20 seconds
      } else {
        setMessage("Error saving chapter.");
      }
    } else {
      setMessage("Please enter both chapter name and content.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Book {id}</h1>
        <p className="text-gray-700 mb-6">Book ID: {id}</p>

        {/* Chapter Form */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Enter chapter name"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            placeholder="Enter chapter content"
            className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            onClick={saveChapter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md self-end hover:bg-blue-600 transition"
          >
            Save
          </button>
          {message && <p className="text-green-500 text-center font-semibold">{message}</p>}
        </div>
      </div>
    </div>
  );
}
