// File: app/api/delete_product/route.js
import { NextResponse } from "next/server";
import Product from "@/models/produts"; // Adjust this path to match your project structure
import connectDB from "@/lib/mongoose"; // Adjust this path to your database connection utility

export async function POST(request) {
  try {
    await connectDB();

    const productData = await request.json();
    if (!productData) {
      return NextResponse.json(
        { error: "Product data is required" },
        { status: 400 }
      );
    }

    const exsisting = await Product.findOne({ id: productData.id });
    if (exsisting) {
      return NextResponse.json(
        { error: "Product id is already in use" },
        { status: 400 }
      );
    }
    const newProduct = new Product(productData);

    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      productId: newProduct.id,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
