import { NextResponse } from "next/server";
import Product from "@/models/produts"; 
import connectDB from "@/lib/mongoose"; 
import mongoose from "mongoose";

export async function PUT(request) {
  try {
    // Ensure database connection
    await connectDB();

    // Parse the request body to get the product data
    let productData;
    try {
      productData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!productData._id && !productData.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Create a query to find the product - try with both MongoDB _id and custom id field
    let query;
    try {
      if (productData._id) {
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productData._id)) {
          return NextResponse.json(
            { success: false, message: "Invalid MongoDB ObjectId format" },
            { status: 400 }
          );
        }
        query = { _id: productData._id };
      } else {
        query = { id: productData.id };
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Error creating query", error: error.message },
        { status: 400 }
      );
    }

    // Remove _id from update data if present (MongoDB doesn't allow _id updates)
    const { _id, averageRating, __v, ...updateData } = productData;

    // Validate price fields
    if (updateData.mrp !== undefined && isNaN(Number(updateData.mrp))) {
      return NextResponse.json(
        { success: false, message: "MRP must be a valid number" },
        { status: 400 }
      );
    }

    if (updateData.discount !== undefined && isNaN(Number(updateData.discount))) {
      return NextResponse.json(
        { success: false, message: "Discount must be a valid number" },
        { status: 400 }
      );
    }

    if (updateData.finalPrice !== undefined && isNaN(Number(updateData.finalPrice))) {
      return NextResponse.json(
        { success: false, message: "Final price must be a valid number" },
        { status: 400 }
      );
    }

    if (updateData.stock !== undefined && isNaN(Number(updateData.stock))) {
      return NextResponse.json(
        { success: false, message: "Stock must be a valid number" },
        { status: 400 }
      );
    }

    // Add timestamp for the update
    updateData.updatedAt = new Date().toISOString();

    // Find the product by ID and update it
    let updatedProduct;
    try {
      updatedProduct = await Product.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      // Handle specific MongoDB validation errors
      if (error.name === "ValidationError") {
        const validationErrors = {};
        for (const field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message: "Validation failed", 
            errors: validationErrors 
          },
          { status: 400 }
        );
      }
      
      // Handle other database errors
      return NextResponse.json(
        { success: false, message: "Database error", error: error.message },
        { status: 500 }
      );
    }

    // Check if the product was found and updated
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Return success response with the updated product
    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}