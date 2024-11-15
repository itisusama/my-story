import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    const { chapterId, name, content } = await req.json();
    const filePath = path.join(process.cwd(), 'src', 'data', 'chapters.json');
    const chaptersData = fs.readFileSync(filePath, 'utf-8');
    const chapters = chaptersData ? JSON.parse(chaptersData) : [];

    // Find the chapter to update
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId);

    if (chapterIndex === -1) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Chapter not found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the chapter
    chapters[chapterIndex].name = name;
    chapters[chapterIndex].content = content;

    // Save the updated chapters array
    fs.writeFileSync(filePath, JSON.stringify(chapters, null, 2));

    return new NextResponse(
      JSON.stringify({ success: true, message: "Chapter updated successfully" }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error updating chapter:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
