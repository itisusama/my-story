// src/app/api/createBook/route.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name } = await req.json();

  // Generate a unique ID
  const bookId = `book_${Date.now()}`;

  // Path to the books.json file
  const filePath = path.join(process.cwd(), 'src', 'data', 'books.json');

  // Read existing data from books.json or initialize it if it doesn't exist
  let books = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    books = fileData ? JSON.parse(fileData) : []; // Check if fileData is not empty
  }

  // Add the new book
  const newBook = { id: bookId, name };
  books.push(newBook);

  // Write the updated data back to books.json
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

  return NextResponse.json({ success: true, id: bookId });
}
