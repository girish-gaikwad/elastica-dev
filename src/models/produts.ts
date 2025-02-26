import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Unique product ID
    name: { type: String, required: true }, // Product name
    categoryId: { type: String, required: true, ref: "Category" }, // Reference to Category model
    dimensions: { type: String }, // Product dimensions
    weight: { type: String }, // Product weight
    mrp: { type: Number, required: true }, // Maximum retail price
    discount: { type: Number, default: 0 }, // Discount percentage
    finalPrice: { type: Number, required: true }, // Final price after discount
    stock: { type: Number, required: true }, // Available stock quantity
    brand: { type: String, required: true }, // Brand name
    isNew: { type: Boolean, default: false }, // New product flag
    description: { type: String }, // Detailed product description
    keyFeatures: [{ type: String }], // List of key product features
    technicalDetails: {
      material: { type: String },
      waterResistant: { type: Boolean },
      indoorOutdoor: { type: String },
      ecoFriendly: { type: Boolean },
      leakProof: { type: Boolean },
      weatherResistant: { type: Boolean },
      easyToClean: { type: Boolean },
    },
    images: [
      {
        url: { type: String, required: true }, // Image URL
        altText: { type: String }, // Image description
      },
    ],
    tags: [{ type: String }], // Searchable tags for filtering
    createdAt: { type: Date, default: Date.now }, // Creation timestamp
    updatedAt: { type: Date, default: Date.now }, // Update timestamp
  },
  { timestamps: true } // Automatically manage createdAt & updatedAt
);

// Export model (check if model already exists to prevent re-compilation errors)
export default mongoose.models.products || mongoose.model("products", ProductSchema);
