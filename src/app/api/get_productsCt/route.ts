import connectToDatabase from "@/lib/mongoose";
import products from "@/models/produts";

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { categoryId, search, minPrice, maxPrice, minDiscount, maxDiscount, sortBy, skip = 0, limit = 10 } = body;

    let query = {};

    // ✅ If categoryId is not "all", filter by category
    if (categoryId && categoryId !== "all") query.categoryId = categoryId;

    // Search in name & description (case insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.mrp = {};
      if (minPrice !== undefined) query.mrp.$gte = minPrice;
      if (maxPrice !== undefined) query.mrp.$lte = maxPrice;
    }

    // Filter by discount range
    if (minDiscount !== undefined || maxDiscount !== undefined) {
      query.discount = {};
      if (minDiscount !== undefined) query.discount.$gte = minDiscount;
      if (maxDiscount !== undefined) query.discount.$lte = maxDiscount;
    }

    // Sorting options
    let sortOptions = {};
    if (sortBy === "priceLowToHigh") sortOptions.finalPrice = 1;
    if (sortBy === "priceHighToLow") sortOptions.finalPrice = -1;
    if (sortBy === "newest") sortOptions.createdAt = -1;
    if (sortBy === "name") sortOptions.name = 1;

    // Fetch products (only required fields)
    const Products = await products.find(query, {
      id: 1,
      categoryId: 1,  
      name: 1,
      description: 1,
      mrp: 1,
      discount: 1,
      finalPrice: 1,
      images: 1,
      tags: 1,
      stock: 1,
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Check if more products exist
    const totalProducts = await products.countDocuments(query);
    const hasMore = skip + limit < totalProducts;

    return new Response(
      JSON.stringify({
        success: true,
        data: { Products, hasMore },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
