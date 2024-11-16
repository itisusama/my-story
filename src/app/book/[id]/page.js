"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function BookDetail({ params }) {
  const { id } = use(params);
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
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-full max-w-4xl p-6">
    <h1>
      {book ? book.name : "Loading..."}
    </h1>
    <p>Book ID: {id}</p>

    {/* Form for adding a new chapter */}
    <div>
      <input
        type="text"
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
        placeholder="Enter chapter name"
      />
      <textarea
        value={chapterContent}
        onChange={(e) => setChapterContent(e.target.value)}
        placeholder="Enter chapter content"
      ></textarea>
      <div>
        <button
          onClick={saveChapter}
        >
          Save Chapter
        </button>
        <button
          onClick={handleEdit}
        >
          Edit Chapters
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <p>
          {message}
        </p>
      )}
    </div>
  </div>
</div>

  );
}
