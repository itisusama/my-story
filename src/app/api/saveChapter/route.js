import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { bookId, name, content } = await request.json();

  const filePath = path.join(process.cwd(), 'src', 'data', 'chapters.json');

  // Read existing chapters from chapters.json
  let chapters = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    chapters = fileData ? JSON.parse(fileData) : [];
  }

  // Determine the new ID by finding the max ID and incrementing
  const lastId = chapters.length > 0 ? Math.max(...chapters.map((ch) => parseInt(ch.id, 10))) : 0;
  const newId = (lastId + 1).toString();

  // Create new chapter object
  const newChapter = {
    id: newId,
    bookId,
    name,
    content,
  };

  // Add new chapter to the list
  chapters.push(newChapter);

  // Save updated chapters array to chapters.json
  fs.writeFileSync(filePath, JSON.stringify(chapters, null, 2));

  return NextResponse.json({ success: true, newChapter });
}
