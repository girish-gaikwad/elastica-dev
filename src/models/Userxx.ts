import mongoose, { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
  type: { type: String, required: true }, // e.g., Home, Work
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },

    addresses: [AddressSchema], // Array of addresses
    wishlist: [{ type: String }], // Array of product IDs
    cart: [CartItemSchema], // Array of cart items

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
