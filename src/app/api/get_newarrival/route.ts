import connectToDatabase from "@/lib/mongoose";
import products from "@/models/produts";
import ratings from "@/models/ratings";

export async function GET() {
  await connectToDatabase();

  try {
    const newArrival = await products.aggregate([
      { $match: { isNew: true } }, // Fetch products where isNew = true
      { $limit: 10 }, // Limit to 10 products
      {
        $lookup: {
          from: "ratings", // Collection name for ratings
          localField: "_id",
          foreignField: "productId",
          as: "ratingsData",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$ratingsData.rating" }, // Compute average rating
          randomIndex: { $floor: { $multiply: [{ $rand: {} }, { $size: "$images" }] } }, // Generate a random index
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          categoryId: 1,
          mrp: 1,
          discount: 1,
          finalPrice: 1,
          tags: 1,
          ratings: { $ifNull: [{ $round: ["$avgRating", 1] }, 0] }, // Round avg rating & default to 0
          image: { $arrayElemAt: ["$images", "$randomIndex"] }, // Select a random image from the array
        },
      },
    ]);

    return new Response(JSON.stringify(newArrival), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
