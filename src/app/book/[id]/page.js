// src/app/book/[id]/page.js
import fs from 'fs';
import path from 'path';

export default async function BookDetail({ params }) {
  const { id } = await params;

  // Path to books.json
  const filePath = path.join(process.cwd(), 'src', 'data', 'books.json');
  const booksData = fs.readFileSync(filePath, 'utf-8');
  const books = booksData ? JSON.parse(booksData) : [];

  // Find the specific book by id
  const book = books.find((book) => book.id === id);

  if (!book) {
    return <div className="p-4 text-center text-gray-600">Book not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{book.name}</h1>
        <p className="text-gray-700">Book ID: {book.id}</p>
      </div>
    </div>
  );
}
