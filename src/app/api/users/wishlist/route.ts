// app/api/users/wishlist/route.js
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return NextResponse.json({ message: 'Product already in wishlist', wishlist: user.wishlist }, { status: 200 });
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    user.updatedAt = Date.now();
    await user.save();
    
    return NextResponse.json({ 
      message: 'Product added to wishlist', 
      wishlist: user.wishlist 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id !== productId);
    user.updatedAt = Date.now();
    await user.save();
    
    return NextResponse.json({ 
      message: 'Product removed from wishlist', 
      wishlist: user.wishlist 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      wishlist: user.wishlist 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}