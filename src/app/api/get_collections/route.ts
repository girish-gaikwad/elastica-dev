import connectToDatabase from '@/lib/mongoose';
import Categories from "@/models/categories";

export async function GET() {
  await connectToDatabase();

  try {
    const products = await Categories.aggregate([{ $sample: { size: 3 } }]); 

    // If less than 3 products exist, fill the rest with "Coming Soon"
    while (products.length < 3) {
      products.push({
        _id: `coming-soon-${products.length + 1}`,
        categoryId: "C0000",
        name: "Coming Soon",
        slug: "coming-soon",
        description: "Stay tuned for more exciting categories.",
        image: {
          url: "/images/commingSoon.png",  // Placeholder image
          altText: "Coming Soon"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
