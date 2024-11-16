"use client";

import { useState, useEffect, use } from "react";

export default function EditChapters({ params }) {
  const { id } = use(params); // Book ID from the route
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
    <div className="min-h-screen p-4 flex flex-col lg:flex-row-reverse gap-6">
  {/* Left Side: Form to edit a chapter */}
  <div className="flex-1 bg-white rounded-lg p-8 shadow-md">
    <h1 className="text-2xl font-bold mb-6">Edit Chapters for Book {id}</h1>

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
        className="border rounded-md p-2 w-full"
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
        className="border rounded-md p-2 w-full h-32"
        placeholder="Chapter Content"
      ></textarea>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Save Changes
      </button>
    </div>
  </div>

  {/* Right Side: List of chapters */}
  <div className="w-full lg:w-1/3 bg-gray-100 rounded-lg p-6 shadow-md">
    <h2 className="text-xl font-bold mb-4">Chapters</h2>

    {/* List of chapters */}
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          onClick={() => handleSelectChapter(chapter)}
          className="p-4 border rounded-md cursor-pointer hover:bg-gray-200 transition"
        >
          <h3 className="text-lg font-semibold">{chapter.name}</h3>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}
