import connectToDatabase from '@/lib/mongoose';
import Sliderimg from '@/models/silderImg';

export async function GET() {
  await connectToDatabase();

  try {
    const products = await Sliderimg.aggregate([{ $sample: { size: 4 } }]);  // Fetch 4 random products
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
