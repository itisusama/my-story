import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'books.json');

  // Read and parse books.json, defaulting to an empty array if it doesn't exist or is empty
  let books = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    books = fileData ? JSON.parse(fileData) : [];
  }

  return NextResponse.json({ books });
}
