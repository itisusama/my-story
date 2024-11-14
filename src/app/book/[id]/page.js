"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookDetail({ params }) {
  const { id } = params;
  const [book, setBook] = useState(null);
  const [chapterName, setChapterName] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch("/api/getBooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) setBook(data.book);
    };
    fetchBook();
  }, [id]);

  const saveChapter = async () => {
    if (chapterName.trim() && chapterContent.trim()) {
      const response = await fetch("/api/saveChapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        setTimeout(() => setMessage(""), 20000);
      } else {
        setMessage("Error saving chapter.");
      }
    } else {
      setMessage("Please enter both chapter name and content.");
    }
  };

  const handleEdit = () => {
    router.push(`/book/${id}/edit`); // Navigate to the Edit page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-10 lg:p-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {book ? book.name : "Loading..."}
        </h1>
        <p className="text-gray-600 mb-8">Book ID: {id}</p>

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
              Save
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition"
            >
              Edit Chapters
            </button>
          </div>
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
