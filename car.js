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
                toast.error(response.error || "Failed to add product.");
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
        <>
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>


            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product ID</label>
                    <input
                        type="text"
                        name="id"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="categoryId"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="cat1">Kitchen</option>
                        <option value="cat2">Bedroom</option>
                        <option value="cat3">Living Room</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                    <input
                        type="text"
                        name="dimensions"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <input
                        type="text"
                        name="weight"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">MRP</label>
                    <input
                        type="number"
                        name="mrp"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                    <input
                        type="number"
                        name="discount"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Final Price</label>
                    <input
                        type="number"
                        name="finalPrice"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                    <label className="inline-flex items-center mt-2">
                        <input
                            type="checkbox"
                            //onchange="toggleFinalPriceEditable(event)"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Edit Final Price Manually</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>


                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Is New</label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isNew"
                            //onchange="handleCheckboxChange(event)"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Mark as new product</span>
                    </div>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        //onchange="handleInputChange(event)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        rows="3"
                    ></textarea>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Key Features</label>
                    <input
                        type="text"
                        name="keyFeatures"
                        //onchange="handleKeyFeaturesChange(event)"
                        placeholder="Enter features separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technical Details</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="waterResistant"
                                    //onchange="handleTechnicalDetailsChange(event)"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Water Resistant</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="ecoFriendly"
                                    //onchange="handleTechnicalDetailsChange(event)"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Eco Friendly</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="leakProof"
                                    //onchange="handleTechnicalDetailsChange(event)"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Leak Proof</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="weatherResistant"
                                    //onchange="handleTechnicalDetailsChange(event)"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Weather Resistant</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="easyToClean"
                                    //onchange="handleTechnicalDetailsChange(event)"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Easy to Clean</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <div
                        onclick="openImageUpload()"
                        className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                        <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-500">Add Image</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2" id="imagePreviewContainer">
                        <!-- Image previews will be added here -->
                    </div>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="space-y-2" id="tagContainer">
                        <div className="flex items-center">
                            <input
                                type="text"
                                name="tags"
                                //onchange="handleTagChange(event, 0)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                type="button"
                                onclick="removeTag(0)"
                                className="ml-2 flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white focus:outline-none"
                            >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onclick="addTag()"
                        className="mt-2 flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14m-7-7h14"></path>
                        </svg>
                        Add Tag
                    </button>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Colors</label>
                    <div className="flex flex-wrap gap-2" id="colorContainer">
                        <div className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center" style="background-color: #1cb353">
                            <span className="text-xs text-white mix-blend-difference">1</span>
                        </div>

                        <button
                            type="button"
                            onclick="toggleColorPicker()"
                            className="h-8 w-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500"
                        >
                            +
                        </button>
                    </div>

                    <div className="mt-4 hidden" id="colorPickerSection">
                        <!-- Simple color picker - for a real app, you might use a library -->
                        <div className="grid grid-cols-6 gap-2">
                            <button type="button" onclick="selectColor('#1cb353', 'Green')" className="h-8 w-8 rounded-full bg-green-500"></button>
                            <button type="button" onclick="selectColor('#3b82f6', 'Blue')" className="h-8 w-8 rounded-full bg-blue-500"></button>
                            <button type="button" onclick="selectColor('#ef4444', 'Red')" className="h-8 w-8 rounded-full bg-red-500"></button>
                            <button type="button" onclick="selectColor('#f59e0b', 'Yellow')" className="h-8 w-8 rounded-full bg-yellow-500"></button>
                            <button type="button" onclick="selectColor('#8b5cf6', 'Purple')" className="h-8 w-8 rounded-full bg-purple-500"></button>
                            <button type="button" onclick="selectColor('#ec4899', 'Pink')" className="h-8 w-8 rounded-full bg-pink-500"></button>
                            <button type="button" onclick="selectColor('#10b981', 'Emerald')" className="h-8 w-8 rounded-full bg-emerald-500"></button>
                            <button type="button" onclick="selectColor('#6366f1', 'Indigo')" className="h-8 w-8 rounded-full bg-indigo-500"></button>
                            <button type="button" onclick="selectColor('#000000', 'Black')" className="h-8 w-8 rounded-full bg-black"></button>
                            <button type="button" onclick="selectColor('#ffffff', 'White')" className="h-8 w-8 rounded-full bg-white border border-gray-300"></button>
                            <button type="button" onclick="selectColor('#d1d5db', 'Gray')" className="h-8 w-8 rounded-full bg-gray-300"></button>
                            <button type="button" onclick="selectColor('#78350f', 'Brown')" className="h-8 w-8 rounded-full bg-amber-900"></button>
                        </div>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="colorNameInput"
                                placeholder="Color Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <button
                            type="button"
                            onclick="addColor()"
                            className="mt-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Add Color
                        </button>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <button
                        type="submit"
                        onclick="handleSubmit(event)"
                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </>
    );
};

export default AdminAddProductPage;