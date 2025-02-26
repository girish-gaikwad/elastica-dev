"use client";
import React, { useState, useEffect } from 'react';
import { User, MapPin, Heart, ShoppingCart, Package, LogOut, Edit, Plus, Trash2, Check, X } from 'lucide-react';

const ProfilePage = () => {
  // We're assuming this would come from an API in a real application
  const [userData, setUserData] = useState({
    "_id": {
      "$oid": "67c05a2a5d3e2f001a3b4c6d"
    },
    "userId": "U1001",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1 123 456 7890",
    "passwordHash": "$2a$10$VhZJ7mRfXzOEq1P6KoI6dOeGQWwXyW7lOftB1l.KfFBO3gU8R9neS",
    "role": "customer",
    "addresses": [
      {
        "type": "Home",
        "street": "123 Green Street",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94107",
        "country": "USA"
      }
    ],
    "wishlist": [
      "P123456",
      "P789012"
    ],
    "cart": [
      {
        "productId": "P123456",
        "quantity": 2
      }
    ],
    "createdAt": {
      "$date": "2025-02-05T14:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2025-02-12T15:30:00.000Z"
    }
  });

  // Mock data for recent orders
  const [recentOrders, setRecentOrders] = useState([
    {
      orderId: "ORD10054321",
      date: "Feb 15, 2025",
      status: "Delivered",
      total: 129.99,
      items: 3
    },
    {
      orderId: "ORD10054290",
      date: "Jan 28, 2025",
      status: "Processing",
      total: 75.50,
      items: 2
    }
  ]);

  // Mock data for wishlist products
  const [wishlistProducts, setWishlistProducts] = useState([
    {
      id: "P123456",
      name: "Premium Wireless Headphones",
      price: 129.99,
      imageUrl: "/api/placeholder/200/200",
      inStock: true
    },
    {
      id: "P789012",
      name: "Smart Fitness Watch",
      price: 89.99,
      imageUrl: "/api/placeholder/200/200",
      inStock: false
    }
  ]);

  // For editing profile information
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone
  });

  // For adding/editing addresses
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "USA"
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Handle input changes for profile editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    setUserData({
      ...userData,
      ...editFormData
    });
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
  };

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  // Handle save new address
  const handleSaveAddress = () => {
    setUserData({
      ...userData,
      addresses: [...userData.addresses, newAddress]
    });
    setIsAddingAddress(false);
    setNewAddress({
      type: "Home",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    });
    // Here you would typically make an API call to update addresses
  };

  // Handle remove address
  const handleRemoveAddress = (index) => {
    const updatedAddresses = [...userData.addresses];
    updatedAddresses.splice(index, 1);
    setUserData({
      ...userData,
      addresses: updatedAddresses
    });
    // Here you would typically make an API call to update addresses
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = userData.wishlist.filter(id => id !== productId);
    setUserData({
      ...userData,
      wishlist: updatedWishlist
    });
    setWishlistProducts(wishlistProducts.filter(product => product.id !== productId));
    // Here you would typically make an API call to update wishlist
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-400 to-amber-300 py-8 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-700 mt-2">Manage your profile, addresses, orders, and more</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 rounded-full p-3">
                  <User className="h-8 w-8 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-800">{userData.name}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                        activeTab === "profile" 
                          ? "bg-amber-100 text-amber-700" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Personal Info
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("addresses")}
                      className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                        activeTab === "addresses" 
                          ? "bg-amber-100 text-amber-700" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <MapPin className="h-5 w-5 mr-3" />
                      Addresses
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                        activeTab === "orders" 
                          ? "bg-amber-100 text-amber-700" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Package className="h-5 w-5 mr-3" />
                      Orders
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab("wishlist")}
                      className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                        activeTab === "wishlist" 
                          ? "bg-amber-100 text-amber-700" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      Wishlist
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-amber-600 hover:text-amber-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditFormData({
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-800">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-800">{userData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium text-gray-800">{formatDate(userData.createdAt.$date)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Password & Security</h3>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Your Addresses</h2>
                  {!isAddingAddress && (
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="flex items-center text-amber-600 hover:text-amber-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Address
                    </button>
                  )}
                </div>
                
                {isAddingAddress && (
                  <div className="mb-8 p-6 border border-dashed border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                          id="type"
                          name="type"
                          value={newAddress.type}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={newAddress.zip}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={newAddress.country}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}
                
                {userData.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="absolute top-3 right-3 flex space-x-1">
                          <button className="text-gray-400 hover:text-amber-500">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleRemoveAddress(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-start mb-2">
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium py-1 px-2 rounded">
                            {address.type}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800">{address.street}</p>
                        <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>You haven't added any addresses yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Your Orders</h2>
                  <p className="text-gray-500 text-sm mt-1">Track and manage your purchase history</p>
                </div>
                
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.orderId} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div>
                            <span className="text-xs text-gray-500">Order #</span>
                            <span className="font-medium ml-1">{order.orderId}</span>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <span className="text-xs text-gray-500 mr-3">Placed on {order.date}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-700"><span className="font-medium">{order.items}</span> items</p>
                              <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                            <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Your Wishlist</h2>
                  <p className="text-gray-500 text-sm mt-1">Items you've saved for later</p>
                </div>
                
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                            <p className="text-amber-600 font-medium">${product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-gray-500 hover:text-amber-600" title="Add to cart">
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleRemoveFromWishlist(product.id)}
                                className="text-gray-500 hover:text-red-500" 
                                title="Remove from wishlist"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2025 Your Store Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;