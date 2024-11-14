"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditChapters({ params }) {
  const { id } = params;
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await fetch(`/api/getChapters?bookId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setChapters(data.chapters);
      }
    };
    fetchChapters();
  }, [id]);
  

  const handleSave = async () => {
    if (selectedChapter) {
      const response = await fetch("/api/editChapter", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedChapter.name,
          content: selectedChapter.content,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Chapter updated successfully!");
  
        // Update only the modified chapter in the state
        setChapters((prevChapters) =>
          prevChapters.map((chapter) =>
            chapter.id === selectedChapter.id
              ? { ...chapter, name: selectedChapter.name, content: selectedChapter.content }
              : chapter
          )
        );
      } else {
        alert("Error updating chapter.");
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Edit Chapters for Book {id}
        </h1>

        {/* Chapter cards */}
        <div className="space-y-4 mb-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter)}
              className="p-4 border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition border-gray-200"
            >
              <h2 className="text-lg font-semibold">{chapter.name}</h2>
            </div>
          ))}
        </div>

        {/* Edit selected chapter */}
        {selectedChapter && (
          <div className="space-y-4">
            <input
              type="text"
              value={selectedChapter.name}
              onChange={(e) =>
                setSelectedChapter((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={selectedChapter.content}
              onChange={(e) =>
                setSelectedChapter((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
