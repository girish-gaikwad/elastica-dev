import connectToDatabase from "@/lib/mongoose";
import products from "@/models/produts";

export async function GET() {
  await connectToDatabase();

  try {
    const FeaturedProducts = await products.aggregate([
      { $match: { isNew: false } },
      {
        $lookup: {
          from: "ratings",
          localField: "id",
          foreignField: "productId",
          as: "ratingsData",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$ratingsData.rating" },
          randomIndex: { $floor: { $multiply: [{ $rand: {} }, { $size: "$images" }] } }, // Generate random index
        },
      },
      { $match: { avgRating: { $gt: 4 } } }, // Filter products with avg rating > 4
      { $limit: 10 },
      {
        $project: {
          id: "$_id",
          name: 1,
          categoryId: 1,
          mrp: 1,
          discount: 1,
          finalPrice: 1,
          tags: 1,
          ratings: { $ifNull: [{ $round: ["$avgRating", 1] }, 0] },
          image: { $arrayElemAt: ["$images", "$randomIndex"] }, // Select a random image from the array

        },
      },
    ]);

    // If we got less than 5 products, fetch random products to fill the list
    if (FeaturedProducts.length < 5) {
      const additionalProducts = await products.aggregate([
        {
          $match: {
            isNew: false,
            _id: { $nin: FeaturedProducts.map((p) => p.id) },
          },
        }, // Exclude already selected
        { $sample: { size: 10 - FeaturedProducts.length } }, // Fill remaining slots
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "productId",
            as: "ratingsData",
          },
        },
        {
          $addFields: {
            avgRating: { $avg: "$ratingsData.rating" },
            randomIndex: { $floor: { $multiply: [{ $rand: {} }, { $size: "$images" }] } }, // Generate random index

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

      // Add extra random products to the original list
      FeaturedProducts.push(...additionalProducts);
    }

    return new Response(JSON.stringify(FeaturedProducts), {
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
