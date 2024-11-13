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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {book ? book.name : "Loading..."}
        </h1>
        <p className="text-gray-700 mb-6">Book ID: {id}</p>

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
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded-md self-end hover:bg-green-600 transition"
          >
            Edit Chapters
          </button>
          {message && (
            <p className="text-green-500 text-center font-semibold">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
