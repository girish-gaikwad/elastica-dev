import connectDB from "@/lib/mongoose";
import Question from "@/models/question";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Please Login First" }, { status: 400 });
  }
  const QuestionId = await params.questionId;
  if(!QuestionId){
    
    return Response.json({ message: "question id is not defined" }, { status: 400 });
  }
  await connectDB();

  try {
    const { answer } = await request.json();
    const question = await Question.findOne({ questionId: QuestionId });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    const user = await User.findOne({ email: session.user.email });

    const userId = user.userId;
    const name = user.name;

    question.answers.push({ userId,name, answer, date: new Date() });
    await question.save();

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error submitting answer" },
      { status: 500 }
    );
  }
}
