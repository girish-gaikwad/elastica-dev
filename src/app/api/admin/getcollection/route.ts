import connectToDatabase from '@/lib/mongoose';
import Categories from "@/models/categories";

export async function GET() {
  await connectToDatabase();

  try {
    const products = await Categories.find().lean();

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

