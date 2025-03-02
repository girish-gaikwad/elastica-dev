// File: app/api/user/profile/route.js
import  connectDB  from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import{authOptions} from "../../auth/[...nextauth]/route"
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if(!session){
      return Response.json({ message: 'Please Login First' }, { status: 400 });
    }
    
    
   
    
    const data = await request.json();
    const { name, phone } = data;

    
    await connectDB();
    
    if(!name && !phone){
      return Response.json({message:'name or phone is required'},{status:400});
    }
    
    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name,
        phone
      },
      { new: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}