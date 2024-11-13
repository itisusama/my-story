import fs from 'fs';
import path from 'path';

const getBooks = () => {
  const filePath = path.join(process.cwd(), 'src', 'data', 'books.json');
  const booksData = fs.readFileSync(filePath, 'utf-8');
  const books = booksData ? JSON.parse(booksData) : [];
  return books;
};

export async function GET() {
  const books = getBooks();
  return new Response(JSON.stringify({ success: true, books }));
}

export async function POST(req) {
  const { id } = await req.json();
  const books = getBooks();
  const book = books.find((b) => b.id === id);

  if (book) {
    return new Response(JSON.stringify({ success: true, book }));
  } else {
    return new Response(JSON.stringify({ success: false }), { status: 404 });
  }
}
