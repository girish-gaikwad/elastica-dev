// File: app/api/delete_product/route.js
import { NextResponse } from "next/server";
import Product from "@/models/produts"; // Adjust this path to match your project structure
import  connectDB from "@/lib/mongoose"; // Adjust this path to your database connection utility

export async function POST(request) {
  try {
    // Ensure database connection
    await connectDB();

    // Parse the request body to get the productId
    const { productId } = await request.json();

    // Validate the productId
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product by ID and delete it
    const deletedProduct = await Product.findOneAndDelete({ id: productId });

    // Check if the product was found and deleted
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      productId: productId
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}