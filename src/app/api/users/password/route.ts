// File: app/api/user/password/route.js
import connectDB  from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import{authOptions} from "../../auth/[...nextauth]/route"

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if(!session){
      return Response.json({ message: 'Please Login First' }, { status: 400 });
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    await connectDB();
    
    // Find the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      return Response.json({ message: 'Current password is incorrect' }, { status: 400 });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    // Update the password
    user.passwordHash = newPasswordHash;
    await user.save();
    
    return Response.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}