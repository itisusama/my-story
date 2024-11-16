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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Book</h1>
      <input
        type="text"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
        placeholder="Enter book name"
        className="p-2 w-full max-w-xs mb-4 focus:outline-none"
      />
      <button
        onClick={createBook}
        className="px-4 py-2 rounded-md transition"
      >
        Create Book
      </button>
      {message && (
        <p className="mt-4 text-center font-semibold">{message}</p>
      )}
      <div className="mt-6 w-full max-w-md">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-4 mb-4 cursor-pointer transition"
            onClick={() => router.push(`/book/${book.id}`)} // Navigate to book detail page
          >
            <h2 className="text-lg">{book.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
