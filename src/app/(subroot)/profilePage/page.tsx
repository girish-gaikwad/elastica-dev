"use client";
import { useAuthStore } from '@/stores/Auth';
import { BriefcaseIcon, CalendarIcon, LockIcon, PhoneIcon, UserIcon, MailIcon, ShieldIcon, LogOutIcon, EditIcon, SaveIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function ProfilePage() {
  const { checkSession, isAuthenticated, isLoading, user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Profile updated successfully!');
        setUser({ ...user, ...data.user });
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password updated successfully!');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc155]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-[#ffc155] rounded-full flex items-center justify-center shadow-lg">
              <LockIcon size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
          <p className="text-gray-600 text-center">Please login to view your profile</p>
          <div className="mt-6">
            <a href="/login" className="block w-full text-center py-3 px-4 bg-[#ffc155] hover:bg-amber-400 text-white font-medium rounded-md transition duration-300 shadow-md">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ffc155] to-amber-400 text-white py-10 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3 mr-5 shadow-lg">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <UserIcon size={40} className="text-[#ffc155]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                  <div className="flex items-center mt-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(user?.role)}`}>
                      {user?.role || 'Member'}
                    </span>
                    <span className="text-sm ml-3 opacity-90 flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      Member since {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 mt-4 rounded-md flex items-center bg-white text-red-500 hover:bg-gray-100 transition duration-300 shadow-md"
              >
                <LogOutIcon size={16} className="mr-2" />
                Logout
              </button>
            </div>
            <div className="flex space-x-3 bg-white/10 p-1 rounded-lg shadow-inner">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`px-5 py-2.5 rounded-md transition duration-300 flex items-center ${
                  activeTab === 'personal' ? 'bg-white text-[#ffc155] shadow-md' : 'bg-transparent text-white hover:bg-white/20'
                }`}
              >
                <UserIcon size={18} className="mr-2" />
                Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-5 py-2.5 rounded-md transition duration-300 flex items-center ${
                  activeTab === 'security' ? 'bg-white text-[#ffc155] shadow-md' : 'bg-transparent text-white hover:bg-white/20'
                }`}
              >
                <ShieldIcon size={18} className="mr-2" />
                Security
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {activeTab === 'personal' && (
            <div>
              <div className="border-b border-gray-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <UserIcon size={20} className="text-[#ffc155] mr-2" />
                    Personal Information
                  </h2>
                  <button 
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg transition duration-300 flex items-center ${
                      isEditing 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-[#ffc155] text-white hover:bg-amber-400 shadow-md'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <EditIcon size={16} className="mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <EditIcon size={16} className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-[#ffc155] focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 text-black rounded-lg bg-gray-100 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ffc155] focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 font-medium flex items-center justify-center shadow-md"
                      >
                        <SaveIcon size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-full bg-amber-100 mr-3">
                            <UserIcon size={18} className="text-[#ffc155]" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-lg ml-1">{user?.name || 'Not provided'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-full bg-amber-100 mr-3">
                            <MailIcon size={18} className="text-[#ffc155]" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Email Address</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-lg ml-1">{user?.email || 'Not provided'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-full bg-amber-100 mr-3">
                            <PhoneIcon size={18} className="text-[#ffc155]" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-lg ml-1">{user?.phone || 'Not provided'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-full bg-amber-100 mr-3">
                            <BriefcaseIcon size={18} className="text-[#ffc155]" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Role</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-lg ml-1">{user?.role || 'Standard User'}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                        <div className="flex items-center mb-3">
                          <div className="p-2 rounded-full bg-amber-100 mr-3">
                            <CalendarIcon size={18} className="text-[#ffc155]" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">Member Since</p>
                        </div>
                        <p className="font-semibold text-gray-800 text-lg ml-1">
                          {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <ShieldIcon size={22} className="text-[#ffc155] mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Password & Security</h2>
                  </div>
                  <button 
                    onClick={handlePasswordToggle}
                    className={`px-4 py-2 rounded-lg transition duration-300 flex items-center ${
                      isChangingPassword 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-[#ffc155] text-white hover:bg-amber-400 shadow-md'
                    }`}
                  >
                    {isChangingPassword ? (
                      <>
                        <LockIcon size={16} className="mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <LockIcon size={16} className="mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
                
                {isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffc155] focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffc155] focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffc155] focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 font-medium shadow-md flex items-center justify-center"
                      >
                        <SaveIcon size={18} className="mr-2" />
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mt-6 shadow-md border border-gray-100">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-3 rounded-full mr-4 shadow-sm">
                        <ShieldIcon size={24} className="text-[#ffc155]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-lg">Password Protection</h3>
                        <p className="text-gray-600 mt-2">
                          For security reasons, we recommend changing your password regularly. Your password should be at least 8 characters long and include a mix of letters, numbers, and special characters.
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                            <div className="p-1.5 bg-green-100 rounded-full mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                            </div>
                            <span className="text-gray-700">Use 8+ characters</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                            <div className="p-1.5 bg-green-100 rounded-full mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                            </div>
                            <span className="text-gray-700">Include numbers</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                            <div className="p-1.5 bg-green-100 rounded-full mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                            </div>
                            <span className="text-gray-700">Mix uppercase & lowercase</span>
                          </div>
                          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                            <div className="p-1.5 bg-green-100 rounded-full mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                            </div>
                            <span className="text-gray-700">Add special characters</span>
                          </div>
                        </div>
                        <button 
                          onClick={handlePasswordToggle}
                          className="mt-6 px-4 py-2 bg-[#ffc155] text-white hover:bg-amber-400 font-medium transition rounded-lg shadow-md flex items-center"
                        >
                          <LockIcon size={16} className="mr-2" />
                          Change my password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;