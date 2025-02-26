import  connectDB  from "@/lib/mongoose";
import Question from "@/models/question";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  await connectDB();

  const QuestionId = params.questionId;
  try {
    const { sellerId, sellerName, answer } = await request.json();
    const question = await Question.findOne({ "questionId": QuestionId });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    question.answers.push({ sellerId, sellerName, answer, date: new Date() });
    await question.save();

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error submitting answer" }, { status: 500 });
  }
}
