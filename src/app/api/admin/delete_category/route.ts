import { NextResponse } from "next/server";
import Categories from "@/models/categories";
import connectDB from "@/lib/mongoose";

export async function DELETE(request: Request) {
  await connectDB(); // Ensure database connection

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const deletedCategory = await Categories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}

