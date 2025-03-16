import { NextResponse } from "next/server";
import Categories from "@/models/categories";
import connectDB from "@/lib/mongoose";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { categoryId, name, slug, description, image } = await request.json();

        if (!categoryId) {
            return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
        }

        if (!name) {
            return NextResponse.json({ error: "Category name is required." }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ error: "Category slug is required." }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ error: "Category description is required." }, { status: 400 });
        }

        if (!image || !image.url || !image.altText) {
            return NextResponse.json({ error: "Category image is required." }, { status: 400 });
        }

        const existingCategory = await Categories.findOne({ categoryId });
        if (existingCategory) {
            return NextResponse.json({ error: "Category ID already exists." }, { status: 400 });
        }

        const newCategory = new Categories({
            categoryId,
            name,
            slug,
            description,
            image,
        });

        await newCategory.save();
        return NextResponse.json({ message: "Category added successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error adding category:", error);
        return NextResponse.json({ error: "Failed to add category." }, { status: 500 });
    }
}

