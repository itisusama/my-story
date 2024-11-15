"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookDetail({ params }) {
  const { id } = params;
  const [book, setBook] = useState(null); // Holds book details
  const [chapterName, setChapterName] = useState(""); // For new chapter's name
  const [chapterContent, setChapterContent] = useState(""); // For new chapter's content
  const [message, setMessage] = useState(""); // Displays success or error messages
  const router = useRouter(); // For navigation

  // Fetch book details when component mounts
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch("/api/getBooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) setBook(data.book);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  // Save a new chapter
  const saveChapter = async () => {
    if (!chapterName.trim() || !chapterContent.trim()) {
      setMessage("Please enter both chapter name and content.");
      return;
    }

    try {
      const response = await fetch("/api/saveChapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          name: chapterName,
          content: chapterContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Chapter saved successfully!");
        setChapterName("");
        setChapterContent("");
      } else {
        setMessage("Error saving chapter.");
      }
    } catch (error) {
      console.error("Failed to save chapter:", error);
      setMessage("Error saving chapter.");
    }

    // Clear the message after a delay
    setTimeout(() => setMessage(""), 20000);
  };

  // Navigate to the edit chapters page
  const handleEdit = () => {
    router.push(`/book/${id}/edit`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-10 lg:p-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {book ? book.name : "Loading..."}
        </h1>
        <p className="text-gray-600 mb-8">Book ID: {id}</p>

        {/* Form for adding a new chapter */}
        <div className="space-y-6">
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Enter chapter name"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            placeholder="Enter chapter content"
            className="w-full border border-gray-300 rounded-md p-3 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex justify-between space-x-4">
            <button
              onClick={saveChapter}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Save Chapter
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition"
            >
              Edit Chapters
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <p className="text-center font-semibold text-green-600 mt-4">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
