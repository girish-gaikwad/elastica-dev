import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, unique: true }, // Unique category identifier
    name: { type: String, required: true }, // Category name
    slug: { type: String, required: true, unique: true }, // URL-friendly slug
    description: { type: String }, // Category description
    image: {
      url: { type: String, required: true }, // Image URL
      altText: { type: String, required: true }, // Alternative text for accessibility
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp for creation
    updatedAt: { type: Date, default: Date.now }, // Timestamp for updates
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Export model (check if model already exists to prevent re-compilation errors)
export default mongoose.models.Categories || mongoose.model("Categories", CategorySchema);
