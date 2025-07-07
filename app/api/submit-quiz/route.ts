
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({ score: 4, feedback: {} });
}
