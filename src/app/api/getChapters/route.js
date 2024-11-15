import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const bookId = url.searchParams.get('bookId');
  const filePath = path.join(process.cwd(), 'src', 'data', 'chapters.json');
  const chaptersData = fs.readFileSync(filePath, 'utf-8');
  const chapters = chaptersData ? JSON.parse(chaptersData) : [];

  // Filter chapters based on the bookId
  const bookChapters = chapters.filter((chapter) => chapter.bookId === bookId);
  
  return new NextResponse(JSON.stringify({ success: true, chapters: bookChapters }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
