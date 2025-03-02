import connectToDatabase from "@/lib/mongoose";
import Categories from "@/models/categories";
import products from "@/models/produts";

export async function GET() {
  await connectToDatabase();

  try {
    // Fetch all categories
    const categories = await Categories.find().lean();

    // Convert categories into a structured navigation format
    const categoryLinks = await Promise.all(
      categories.map(async (category) => {
        // Fetch products related to this category
        const product = await products
          .find({ categoryId: category.categoryId })
          .limit(3);
        // Generate subLinks based on products
        const subLinks = product.map((product) => ({
          id: product.id,
          path: `/purchase/${product.id}`,
          name: product.name,
        }));

        return {
          id: category.categoryId,
          path: `/shop/${category.categoryId}`,
          name: category.name,
          subLinks: [
            {
              id: "all-products",
              path: `/shop/${category.categoryId}`,
              name: "All Products",
            },
            ...subLinks,
          ],
        };
      })
    );

    // Add "Shop" as the main parent link containing all categories
    const navigationLinks = [
      {
        id: "home",
        path: "/",
        name: "Home",
      },
      {
        id: "shop",
        path: "/shop",
        name: "Shop",
        subLinks: [
          {
            id: "all-products",
            path: "/shop/all",
            name: "All Products",
          },
          ...categoryLinks, // Attach categories as sub-links
        ],
      },
      {
        id: "product",
        path: "/products",
        name: "Products",
      },
      {
        id: "contact-us",
        path: "/contactUs",
        name: "Contact Us",
      },
    ];

    return new Response(JSON.stringify(navigationLinks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
