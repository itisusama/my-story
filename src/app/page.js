"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');

  const createBook = async () => {
    if (bookName.trim()) {
      const response = await fetch('/api/createBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: bookName }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Book "${bookName}" created with ID: ${data.id}`);
        setBookName('');
        // Set a timer to clear the message after 30 seconds
        setTimeout(() => setMessage(''), 30000);
      } else {
        setMessage('Error creating book.');
      }
    } else {
      setMessage('Please enter a book name.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create a Book</h1>
      <input
        type="text"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
        placeholder="Enter book name"
        className="border border-gray-300 rounded-md p-2 w-full max-w-xs mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={createBook}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Create Book
      </button>
      {message && (
        <p className="mt-4 text-green-500 text-center font-semibold">{message}</p>
      )}
    </div>
  );
}
