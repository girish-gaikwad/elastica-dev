import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Review from "@/models/reviews";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";

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

  const session = await getServerSession(authOptions);
  
    if (!session) {
      return Response.json({ message: "Please Login First" }, { status: 400 });
    }
  await connectDB();

  try {
    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    const userId = user.userId;
    const username = user.name;

    const newReview = new Review({ productId, userId, username, rating, comment, date: new Date() });
    await newReview.save();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Error submitting review" }, { status: 500 });
  }
}
