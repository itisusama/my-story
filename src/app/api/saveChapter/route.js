// src/app/api/saveChapter/route.js
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

  // Add new chapter
  const newChapter = {
    bookId,
    name,
    content,
  };
  chapters.push(newChapter);

  // Save updated chapters array to chapters.json
  fs.writeFileSync(filePath, JSON.stringify(chapters, null, 2));

  return NextResponse.json({ success: true });
}
