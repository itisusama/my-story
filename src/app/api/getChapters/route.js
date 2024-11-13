import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const { bookId } = await req.json();
  const filePath = path.join(process.cwd(), 'src', 'data', 'chapters.json');
  const chaptersData = fs.readFileSync(filePath, 'utf-8');
  const chapters = chaptersData ? JSON.parse(chaptersData) : [];

  const bookChapters = chapters.filter((chapter) => chapter.bookId === bookId);
  return new Response(JSON.stringify({ success: true, chapters: bookChapters }));
}
