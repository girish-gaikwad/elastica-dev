import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
