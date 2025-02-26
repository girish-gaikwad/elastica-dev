import connectDB from "@/lib/mongoose";
import Question from "@/models/question";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { productId, userId, username, question } = await request.json();
    
    const questionId = `Q${Date.now()}`;

    const newQuestion = new Question({
      questionId,
      productId,
      userId,
      username,
      question,
      answers: [],
    });

    await newQuestion.save();
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding question" }, { status: 500 });
  }
}

