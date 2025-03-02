import connectToDatabase from "@/lib/mongoose";
import Product from "@/models/produts";
import Rating from "@/models/ratings";
import { NextResponse } from "next/server";

export async function GET(
  request: Request, 
  {params}: { params: { productId: string } } // ✅ Destructure params from context properly
) {
  const { productId } = await params


  await connectToDatabase();

  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch product details
    const product = await Product.findOne({ id: productId });  // ✅ Use findOne instead of find

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch all ratings for the product
    const ratings = await Rating.find({ productId });

    let avgRating = null;
    if (ratings.length > 0) {
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      avgRating = totalRating / ratings.length;
    }

    return NextResponse.json(
      { 
        product, 
        averageRating: avgRating !== null ? avgRating.toFixed(1) : "No rating available",
        totalRatings: ratings.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching product and rating:", error);
    return NextResponse.json(
      { message: "Error fetching product and rating" },
      { status: 500 }
    );
  }
}
