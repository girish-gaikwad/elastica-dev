import mongoose, { Schema, Document } from "mongoose";

interface IAnswer {
  sellerId: string;
  sellerName: string;
  answer: string;
  date?: Date;
}

interface IQuestion extends Document {
  productId: string;
  userId: string;
  username: string;
  question: string;
  date?: Date;
  answers: IAnswer[];
}

const AnswerSchema = new Schema<IAnswer>({
  sellerId: String,
  sellerName: String,
  answer: String,
  date: { type: Date, default: Date.now },
});

const QuestionSchema = new Schema<IQuestion>({
  productId: String,
  userId: String,
  username: String,
  question: String,
  date: { type: Date, default: Date.now },
  answers: [AnswerSchema],
});

export default mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
