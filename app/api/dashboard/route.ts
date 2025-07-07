
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json([
    {
      quizId: '123',
      docTitle: 'The Great Gatsby',
      score: 4,
      createdAt: new Date(),
    },
  ]);
}
