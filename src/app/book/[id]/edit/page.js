"use client";

import { useState, useEffect } from "react";

export default function EditChapters({ params }) {
  const { id } = params; // Book ID from the route
  const [chapters, setChapters] = useState([]);
  const [formState, setFormState] = useState({ name: "", content: "", id: null });

  // Fetch chapters for the book
  useEffect(() => {
    const fetchChapters = async () => {
      const response = await fetch(`/api/getChapters?bookId=${id}`);
      const data = await response.json();
      if (data.success) {
        setChapters(data.chapters);
      }
    };
    fetchChapters();
  }, [id]);

  // Handle chapter selection
  const handleSelectChapter = (chapter) => {
    setFormState({ name: chapter.name, content: chapter.content, id: chapter.id });
  };

  // Save changes to the chapter
  const handleSave = async () => {
    if (formState.id) {
      const response = await fetch(`/api/editChapter`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterId: formState.id,
          name: formState.name,
          content: formState.content,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Chapter updated successfully!");
        // Update the local state to reflect the changes
        setChapters((prevChapters) =>
          prevChapters.map((chapter) =>
            chapter.id === formState.id
              ? { ...chapter, name: formState.name, content: formState.content }
              : chapter
          )
        );
        setFormState({ name: "", content: "", id: null }); // Reset the form
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

        {/* List of chapters */}
        <div className="space-y-4 mb-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => handleSelectChapter(chapter)}
              className="p-4 border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition border-gray-200"
            >
              <h2 className="text-lg font-semibold">{chapter.name}</h2>
            </div>
          ))}
        </div>

        {/* Form to edit a chapter */}
        <div className="space-y-4">
          <input
            type="text"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Chapter Name"
          />
          <textarea
            value={formState.content}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Chapter Content"
          ></textarea>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
