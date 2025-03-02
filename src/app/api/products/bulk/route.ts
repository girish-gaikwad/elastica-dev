// app/api/products/bulk/route.js
import { NextResponse } from 'next/server';
import  connectToDatabase  from '@/lib/mongoose';
import ProductModel from '@/models/produts';

export async function POST(request) {
  try {
    // Parse request body
    const { productIds } = await request.json();
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid product IDs provided' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Fetch products by IDs
    const products = await ProductModel.find({
      id: { $in: productIds }
    });
    
    // If no products found, return empty array
    if (!products || products.length === 0) {
      return NextResponse.json({ products: [] });
    }
    
    // Return the products
    return NextResponse.json({ products });
    
  } catch (error) {
    console.error('Error fetching bulk products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}