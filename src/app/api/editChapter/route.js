import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const { chapterId, name, content } = await req.json();
  const filePath = path.join(process.cwd(), 'src', 'data', 'chapters.json');
  const chaptersData = fs.readFileSync(filePath, 'utf-8');
  const chapters = chaptersData ? JSON.parse(chaptersData) : [];

  const updatedChapters = chapters.map((chapter) =>
    chapter.id === chapterId
      ? { ...chapter, name: name, content: content }
      : chapter
  );

  fs.writeFileSync(filePath, JSON.stringify(updatedChapters, null, 2));

  return new Response(JSON.stringify({ success: true }));
}
