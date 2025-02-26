import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Review from "@/models/reviews";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  await connectDB();

  try {
    const reviews = await Review.find({ productId: params.productId }).sort({ date: -1 });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const { productId, userId, username, rating, comment } = await request.json();

    if (!productId || !userId || !username || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newReview = new Review({ productId, userId, username, rating, comment, date: new Date() });
    await newReview.save();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Error submitting review" }, { status: 500 });
  }
}
