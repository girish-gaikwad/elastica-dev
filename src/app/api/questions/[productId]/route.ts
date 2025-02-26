import  connectDB  from "@/lib/mongoose";
import Question from "@/models/question";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  await connectDB();

  try {
    const questions = await Question.find({ productId: params.productId });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching questions" }, { status: 500 });
  }
}
