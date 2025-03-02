import mongoose, { Schema, Document } from "mongoose";

interface IAnswer {
  userId: string;
  name: string;
  answer: string;
  date?: Date;
}

interface IQuestion extends Document {
  productId: string;
  userId: string;
  questionId: string,
  username: string;
  question: string;
  date?: Date;
  answers: IAnswer[];
}

const AnswerSchema = new Schema<IAnswer>({
  userId: String,
  name: String,
  answer: String,
  date: { type: Date, default: Date.now },
});

const QuestionSchema = new Schema<IQuestion>({
  productId: String,
  questionId: String,
  userId: String,
  username: String,
  question: String,
  date: { type: Date, default: Date.now },
  answers: [AnswerSchema],
});

export default mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
