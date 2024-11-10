"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');
  const [books, setBooks] = useState([]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('/api/getBooks');
      const data = await response.json();
      setBooks(data.books || []);
    };
    fetchBooks();
  }, []);

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
        setBooks((prevBooks) => [...prevBooks, { id: data.id, name: bookName }]);
        setTimeout(() => setMessage(''), 20000);
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
      <div className="mt-6 w-full max-w-md">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => router.push(`/book/${book.id}`)} // Navigate to book detail page
          >
            <h2 className="text-lg font-semibold text-gray-800">{book.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
