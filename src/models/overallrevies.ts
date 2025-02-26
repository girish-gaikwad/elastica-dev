import mongoose from 'mongoose';

const overallreviews = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true },
    body: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true, collection: 'Overallreviews' } // Explicit collection name
);

const Overallreviews = mongoose.models.overallreviews || mongoose.model('overallreviews', overallreviews);

export default Overallreviews;
