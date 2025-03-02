// app/api/users/cart/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Check if product is already in cart
    const existingCartItem = user.cart.find(item => item.productId === productId);
    
    if (existingCartItem) {
      // Update quantity if already in cart
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ productId, quantity });
    }
    
    user.updatedAt = Date.now();
    await user.save();
    
    return NextResponse.json({ 
      message: 'Product added to cart', 
      cart: user.cart 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json({ message: 'Product ID and quantity are required' }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Find the cart item
    const cartItemIndex = user.cart.findIndex(item => item.productId === productId);
    
    if (cartItemIndex === -1) {
      return NextResponse.json({ message: 'Product not found in cart' }, { status: 404 });
    }
    
    // Update quantity or remove if quantity is 0
    if (quantity > 0) {
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      user.cart.splice(cartItemIndex, 1);
    }
    
    user.updatedAt = Date.now();
    await user.save();
    
    return NextResponse.json({ 
      message: quantity > 0 ? 'Cart updated' : 'Product removed from cart', 
      cart: user.cart 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating cart:', error);
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
    
    // Remove from cart
    user.cart = user.cart.filter(item => item.productId !== productId);
    user.updatedAt = Date.now();
    await user.save();
    
    return NextResponse.json({ 
      message: 'Product removed from cart', 
      cart: user.cart 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error removing from cart:', error);
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
      cart: user.cart 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}