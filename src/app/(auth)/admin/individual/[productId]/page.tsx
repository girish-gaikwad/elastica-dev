"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, Save, ArrowLeft, Loader } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { notFound, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const ProductEditAdmin = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState({ hex: '#000000', name: '' });
  const [uploading, setUploading] = useState(false);
  const [isFinalPriceEditable, setIsFinalPriceEditable] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', altText: '' });
  const [loading, setLoading] = useState(true);
  const [IsLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log(productId)
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/get_individual/${productId}`
        );

        if (res.status === 404) {
          return notFound();
        }

        const data = await res.json();
        console.log(data, "data")

        const formattedData = {
          ...data.product,
          averageRating: data.averageRating
        }
        setProduct(formattedData);

      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  // Auto-calculate final price when MRP or discount changes
  useEffect(() => {
    if (!isFinalPriceEditable) {
      const calculatedPrice = product?.mrp - (product?.mrp * (product?.discount / 100));
      setProduct({ ...product, finalPrice: Math.round(calculatedPrice) });
    }
  }, [product?.mrp, product?.discount, isFinalPriceEditable]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/get_collections"); // Update with the correct API URL
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProduct({
        ...product,
        [parent]: {
          ...product[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setProduct({
        ...product,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setProduct({
        ...product,
        keyFeatures: [...product.keyFeatures, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...product.keyFeatures];
    updatedFeatures.splice(index, 1);
    setProduct({ ...product, keyFeatures: updatedFeatures });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct({
        ...product,
        tags: [...product.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...product.tags];
    updatedTags.splice(index, 1);
    setProduct({ ...product, tags: updatedTags });
  };

  const handleAddColor = () => {
    if (newColor.name.trim() && newColor.hex) {
      setProduct({
        ...product,
        colors: [...product.colors, { ...newColor }]
      });
      setNewColor({ hex: '#000000', name: '' });
    }
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...product.colors];
    updatedColors.splice(index, 1);
    setProduct({ ...product, colors: updatedColors });
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setNewColor({ ...newColor, [name]: value });
  };

  // Handle Cloudinary upload success
  const handleUploadSuccess = (result) => {
  setUploading(false);

  const uploadedImageUrl = result.info.secure_url;

  const newImage = {
    url: uploadedImageUrl,
    altText: "New product image",
  };

  setProduct((prevProduct) => ({
    ...prevProduct,
    images: [...(prevProduct.images || []), newImage], // Ensure previous images are retained
  }));
};


  const handleRemoveImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct({ ...product, images: updatedImages });
  };

  const handleUpdateAltText = (index, newAltText) => {
    const updatedImages = [...product.images];
    updatedImages[index] = { ...updatedImages[index], altText: newAltText };
    setProduct({ ...product, images: updatedImages });
  };

  const handleSaveProduct = async () => {
    setIsLoading(true);

    const isProductValid = Object.values(product).every(value => value !== '' && value !== null);

    if (!isProductValid) {
      toast.error("Please fill in all fields before saving.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/update_product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();

      if (!data.success) {
        // Handle error
        toast.error(data.message || 'Failed to save product. Please try again.');
      } else {
        // Handle success
        toast.success('Product saved successfully.');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save product. Please try again.');
      setIsLoading(false);
    }
  };


  const [customTechDetails, setCustomTechDetails] = useState(
    // Convert any existing custom properties that aren't in the standard fields to an array
    Object.entries(product?.technicalDetails || {})
      .filter(([key]) =>
        !['material', 'waterResistant', 'indoorOutdoor', 'ecoFriendly',
          'leakProof', 'weatherResistant', 'easyToClean'].includes(key)
      )
      ?.map(([key, value]) => ({ key, value: value.toString() }))
  );

  const [newCustomDetail, setNewCustomDetail] = useState({ key: '', value: '' });

  const handleAddCustomDetail = () => {
    if (newCustomDetail.key.trim()) {
      // Add to custom details array
      setCustomTechDetails([...customTechDetails, { ...newCustomDetail }]);

      // Also update the main product object
      setProduct({
        ...product,
        technicalDetails: {
          ...product?.technicalDetails,
          [newCustomDetail.key.trim()]: newCustomDetail.value
        }
      });

      // Reset the form
      setNewCustomDetail({ key: '', value: '' });
    }
  };

  const handleCustomDetailChange = (e, index, field) => {
    const updatedDetails = [...customTechDetails];
    updatedDetails[index][field] = e.target.value;
    setCustomTechDetails(updatedDetails);

    // Also update the main product object
    if (field === 'value') {
      setProduct({
        ...product,
        technicalDetails: {
          ...product.technicalDetails,
          [customTechDetails[index].key]: e.target.value
        }
      });
    } else if (field === 'key') {
      // When changing key, we need to remove old key and add new one
      const oldKey = customTechDetails[index].key;
      const newTechDetails = { ...product.technicalDetails };
      delete newTechDetails[oldKey];
      newTechDetails[e.target.value] = customTechDetails[index].value;

      setProduct({
        ...product,
        technicalDetails: newTechDetails
      });
    }
  };

  const handleRemoveCustomDetail = (index) => {
    // Remove from product object
    const keyToRemove = customTechDetails[index].key;
    const updatedTechDetails = { ...product.technicalDetails };
    delete updatedTechDetails[keyToRemove];

    setProduct({
      ...product,
      technicalDetails: updatedTechDetails
    });

    // Remove from array
    const updatedDetails = [...customTechDetails];
    updatedDetails.splice(index, 1);
    setCustomTechDetails(updatedDetails);
  };


  return (
    loading ? (
      <>
        ...loadingl
      </>
    ) : (
      <>
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-y sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center">
    {/* Left Section */}
    <div className="flex items-center flex-wrap gap-2">
      <button 
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </button>
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Edit Product</h1>
      <span className="px-3 py-1 bg-green-400 text-blue-800 text-xs font-medium rounded-full">
        {product?.id}
      </span>
    </div>

    {/* Right Section */}
    <button
      onClick={handleSaveProduct}
      className="inline-flex items-center px-3 py-2 sm:px-4 bg-green-400 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none"
    >
      {IsLoading ? <Loader className="mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
      <span className="hidden sm:inline">Save Changes</span>
    </button>
  </div>
</header>



          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-black" >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">



              {/* Left Column - Basic Info */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={product?.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={product?.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                      <select
                        name="categoryId"
                        value={product?.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map((category) => (
                          <option key={category._id} value={category.categoryId}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <input
                        type="text"
                        name="weight"
                        value={product?.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={product?.dimensions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        id="isNew"
                        name="isNew"
                        checked={product?.isNew}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isNew" className="ml-2 block text-sm font-medium text-gray-700">
                        New Product
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Pricing & Inventory</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        name="mrp"
                        value={product?.mrp}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={product?.discount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Final Price (₹)</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="editFinalPrice"
                            checked={isFinalPriceEditable}
                            onChange={() => setIsFinalPriceEditable(!isFinalPriceEditable)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="editFinalPrice" className="ml-1 text-xs text-gray-500">
                            Edit manually
                          </label>
                        </div>
                      </div>
                      <input
                        type="number"
                        name="finalPrice"
                        value={product?.finalPrice}
                        onChange={handleInputChange}
                        disabled={!isFinalPriceEditable}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isFinalPriceEditable ? 'focus:outline-none focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        name="stock"
                        value={product?.stock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Product Images</h2>
                  <div className="space-y-4">
                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {product?.images?.map((image, index) => (
                        <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.altText}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="p-2 bg-gray-50">
                            <input
                              type="text"
                              value={image.altText}
                              onChange={(e) => handleUpdateAltText(index, e.target.value)}
                              placeholder="Alt text"
                              className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Cloudinary Upload Widget */}
                      <CldUploadWidget
                        uploadPreset="elastica"
                        onSuccess={handleUploadSuccess}
                        onUpload={() => setUploading(true)}
                      >
                        {({ open }) => (
                          <div
                            onClick={() => open()}
                            className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            {uploading ? (
                              <div className="animate-pulse text-blue-500">
                                <svg className="h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <p className="mt-2 text-xs font-medium text-blue-500">Uploading...</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-6 w-6 text-gray-400" />
                                <p className="mt-2 text-xs font-medium text-gray-500">Add Image</p>
                              </>
                            )}
                          </div>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Product Description</h2>
                  <div>
                    <textarea
                      name="description"
                      value={product?.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Key Features</h2>
                  <div className="space-y-4">
                    {product?.keyFeatures?.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const updatedFeatures = [...product.keyFeatures];
                            updatedFeatures[index] = e.target.value;
                            setProduct({ ...product, keyFeatures: updatedFeatures });
                          }}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center mt-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add new feature"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddFeature}
                        className="ml-2 p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Technical Details Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Technical Details</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                      <input
                        type="text"
                        name="technicalDetails.material"
                        value={product?.technicalDetails?.material}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Indoor/Outdoor Use</label>
                      <select
                        name="technicalDetails.indoorOutdoor"
                        value={product?.technicalDetails?.indoorOutdoor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Indoor">Indoor Only</option>
                        <option value="Outdoor">Outdoor Only</option>
                        <option value="Both">Both Indoor & Outdoor</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="waterResistant"
                          name="technicalDetails.waterResistant"
                          checked={product?.technicalDetails?.waterResistant}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="waterResistant" className="ml-2 text-sm text-gray-700">Water Resistant</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="leakProof"
                          name="technicalDetails.leakProof"
                          checked={product?.technicalDetails?.leakProof}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="leakProof" className="ml-2 text-sm text-gray-700">Leak Proof</label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ecoFriendly"
                          name="technicalDetails.ecoFriendly"
                          checked={product?.technicalDetails?.ecoFriendly}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="ecoFriendly" className="ml-2 text-sm text-gray-700">Eco Friendly</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="weatherResistant"
                          name="technicalDetails.weatherResistant"
                          checked={product?.technicalDetails?.weatherResistant}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="weatherResistant" className="ml-2 text-sm text-gray-700">Weather Resistant</label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="easyToClean"
                        name="technicalDetails.easyToClean"
                        checked={product?.technicalDetails?.easyToClean}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="easyToClean" className="ml-2 text-sm text-gray-700">Easy To Clean</label>
                    </div>
                  </div>

                  {/* Custom Technical Details */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium text-gray-700">Custom Technical Details</h3>
                    </div>

                    {customTechDetails.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {customTechDetails?.map((detail, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={detail.key}
                              onChange={(e) => handleCustomDetailChange(e, index, 'key')}
                              placeholder="Property"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={detail.value}
                              onChange={(e) => handleCustomDetailChange(e, index, 'value')}
                              placeholder="Value"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={() => handleRemoveCustomDetail(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Custom Detail */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newCustomDetail.key}
                        onChange={(e) => setNewCustomDetail({ ...newCustomDetail, key: e.target.value })}
                        placeholder="Add property name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newCustomDetail.value}
                        onChange={(e) => setNewCustomDetail({ ...newCustomDetail, value: e.target.value })}
                        placeholder="Add value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddCustomDetail}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Tags, Colors and Additional Info */}
              <div className="space-y-6">
                {/* Tags Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Product Tags</h2>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {product?.tags?.map((tag, index) => (
                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Colors Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Available Colors</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {product?.colors?.map((color, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                          <div className="flex items-center">
                            <div
                              className="h-6 w-6 rounded-full border border-gray-300 mr-2"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <span className="text-sm">{color.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveColor(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                          <input
                            type="text"
                            name="name"
                            value={newColor.name}
                            onChange={handleColorChange}
                            placeholder="Color name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Hex Code</label>
                          <div className="flex">
                            <input
                              type="color"
                              name="hex"
                              value={newColor.hex}
                              onChange={handleColorChange}
                              className="h-10 w-10 border-0 p-0 mr-2"
                            />
                            <input
                              type="text"
                              name="hex"
                              value={newColor.hex}
                              onChange={handleColorChange}
                              placeholder="#000000"
                              className="flex-grow px-3 w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>



                      <button
                        onClick={handleAddColor}
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Color
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    )
  )
};

export default ProductEditAdmin;