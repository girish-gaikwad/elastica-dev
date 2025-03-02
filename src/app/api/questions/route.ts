import connectDB from "@/lib/mongoose";
import Question from "@/models/question";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(request: Request) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Please Login First" }, { status: 400 });
    }
    const { productId, question } = await request.json();
    if (!productId || !question) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user.userId;
    const username = user.name;
    const questionId = `Q${Date.now()}`;


    const newQuestion = new Question({
      productId,
      userId,
      questionId,
      username,
      question,
      answers: [],
    });

    await newQuestion.save();
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding question" },
      { status: 500 }
    );
  }
}
