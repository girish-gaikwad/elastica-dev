import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imgUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'SliderImgs' } // Explicit collection name
);

const Sliderimg = mongoose.models.Sliderimg || mongoose.model('Sliderimg', ProductSchema);

export default Sliderimg;
