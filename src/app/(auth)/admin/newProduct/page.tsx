"use client";
import { ChromePicker } from "react-color";
import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const AdminAddProductPage = () => {
    const [product, setProduct] = useState({
        id: "",
        name: "",
        categoryId: "",
        dimensions: "",
        weight: "",
        mrp: 0,
        discount: 0,
        finalPrice: 0,
        stock: 0,
        brand: "",
        isNew: true,
        description: "",
        keyFeatures: [],
        technicalDetails: {
            material: "",
            waterResistant: false,
            indoorOutdoor: "Indoor",
            ecoFriendly: false,
            leakProof: false,
            weatherResistant: false,
            easyToClean: false,
        },
        images: [],
        tags: [],
        colors: [],
    });

    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isFinalPriceEditable, setIsFinalPriceEditable] = useState(false);

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
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };

    const handleTechnicalDetailsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({
            ...product,
            technicalDetails: {
                ...product.technicalDetails,
                [name]: type === "checkbox" ? checked : value,
            },
        });
    };

    const handleUploadSuccess = (result) => {
        setUploading(false);

        // Extract the secure URL from the upload result
        const uploadedImageUrl = result.info.secure_url;

        // Create a new image object and add it to the product
        const newImage = {
            url: uploadedImageUrl,
            altText: "New product image", // Default alt text
        };

        setProduct({
            ...product,
            images: [...product.images, newImage],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(product);


        const isProductValid = Object.values(product).every(value => value !== '' && value !== null);

        if (!isProductValid) {
            toast.error("Please fill in all fields before saving.");
            return;
        }
        try {
            const response = await fetch("/api/admin/addproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                toast.success("Product added successfully!");
                // Reset the form
                setProduct({
                    id: "",
                    name: "",
                    categoryId: "",
                    dimensions: "",
                    weight: "",
                    mrp: 0,
                    discount: 0,
                    finalPrice: 0,
                    stock: 0,
                    brand: "",
                    isNew: true,
                    description: "",
                    keyFeatures: [],
                    technicalDetails: {
                        material: "",
                        waterResistant: false,
                        indoorOutdoor: "Indoor",
                        ecoFriendly: false,
                        leakProof: false,
                        weatherResistant: false,
                        easyToClean: false,
                    },
                    images: [],
                    tags: [],
                    colors: [],
                });
            } else {
                toast.error(response.error||"Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };


    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#ffffff");
    const [colorName, setColorName] = useState(""); // Custom name for the color

    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
    };

    // Handle adding the color with a custom name
    const handleAddColor = () => {
        if (currentColor && colorName) {
            const newColor = {
                hex: currentColor,
                name: colorName,
            };
            setProduct({
                ...product,
                colors: [...product.colors, newColor],
            });
            setCurrentColor("#ffffff"); // Reset color
            setColorName(""); // Reset name
            setShowColorPicker(false); // Hide color picker
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            
            <form  onSubmit={handleSubmit} className="space-y-6">
                {/* Product ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                    <input
                        type="text"
                        name="id"
                        value={product.id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Category ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                    <select
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dimensions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <input
                        type="text"
                        name="dimensions"
                        value={product.dimensions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Weight */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input
                        type="text"
                        name="weight"
                        value={product.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* MRP */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                    <input
                        type="number"
                        name="mrp"
                        value={product.mrp}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                    <input
                        type="number"
                        name="discount"
                        value={product.discount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Final Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                    <input
                        type="number"
                        name="finalPrice"
                        value={product.finalPrice}
                        onChange={handleInputChange}
                        disabled={!isFinalPriceEditable}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <label className="inline-flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={isFinalPriceEditable}
                            onChange={(e) => setIsFinalPriceEditable(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2">Edit Final Price Manually</span>
                    </label>
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={product.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Is New */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Is New</label>
                    <input
                        type="checkbox"
                        name="isNew"
                        checked={product.isNew}
                        onChange={(e) => setProduct({ ...product, isNew: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                    />
                </div>

                {/* Key Features */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                    <input
                        type="text"
                        name="keyFeatures"
                        value={product.keyFeatures.join(", ")}
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                keyFeatures: e.target.value.split(", "),
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Technical Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technical Details</label>
                    <div className="space-y-2">
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="waterResistant"
                                    checked={product.technicalDetails.waterResistant}
                                    onChange={handleTechnicalDetailsChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Water Resistant</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="ecoFriendly"
                                    checked={product.technicalDetails.ecoFriendly}
                                    onChange={handleTechnicalDetailsChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Eco Friendly</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="leakProof"
                                    checked={product.technicalDetails.leakProof}
                                    onChange={handleTechnicalDetailsChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Leak Proof</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="weatherResistant"
                                    checked={product.technicalDetails.weatherResistant}
                                    onChange={handleTechnicalDetailsChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Weather Resistant</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="easyToClean"
                                    checked={product.technicalDetails.easyToClean}
                                    onChange={handleTechnicalDetailsChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">Easy to Clean</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
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
                    <div className="mt-4">
                        {product.images.map((image, index) => (
                            <div key={index} className="inline-block mr-2">
                                <Image width={100} height={100} src={image.url} alt={image.altText} className="h-20 w-20 object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="space-y-2">
                        {product.tags.map((tag, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="text"
                                    name="tags"
                                    value={tag}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            tags: product.tags.map((t, i) => (i === index ? e.target.value : t)),
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setProduct({
                                            ...product,
                                            tags: product.tags.filter((t, i) => i !== index),
                                        })
                                    }
                                    className="ml-2 flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white focus:outline-none"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setProduct({ ...product, tags: [...product.tags, ""] })}
                            className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Tag
                        </button>
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                    <div className="flex flex-wrap gap-2">
                        {/* Display selected colors */}
                        {product.colors.map((color, index) => (
                            <div
                                key={index}
                                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center"
                                style={{ backgroundColor: color.hex }}
                                title={`${color.name} (${color.hex})`}
                            >
                                <span className="text-xs text-white mix-blend-difference">
                                    {index + 1}
                                </span>
                            </div>
                        ))}
                        {/* Button to open color picker */}
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
                        >
                            +
                        </button>
                    </div>

                    {/* Color Picker and Name Input */}
                    {showColorPicker && (
                        <div className="mt-4">
                            <ChromePicker
                                color={currentColor}
                                onChange={handleColorChange}
                            />
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Color Name"
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                Add Color
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddProductPage;