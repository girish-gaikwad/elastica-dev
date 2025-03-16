"use client";
import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    image: {
      url: "",
      altText: "",
    },
  });

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/getcollection");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input change for the new category form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (result) => {
    setNewCategory({
      ...newCategory,
      image: {
        url: result.info.secure_url,
        altText: "Category Image",
      },
    });
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/addcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        toast.success("Category added successfully!");
        // Refresh the category list
        const updatedCategories = await fetch("/api/admin/getcollection").then((res) =>
          res.json()
        );
        setCategories(updatedCategories);
        // Reset the form and close the modal
        setNewCategory({
          categoryId: "",
          name: "",
          slug: "",
          description: "",
          image: {
            url: "",
            altText: "",
          },
        });
        setIsModalOpen(false);
      } else {
        toast.error("Failed to add category. all fields are required");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Failed to add category. Please try again.");

    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/admin/delete_category`, {
          method: "DELETE",
          body: JSON.stringify({ id: categoryId }),
        });

        if (response.ok) {
          toast.success("Category deleted successfully!");
          // Refresh the category list
          const updatedCategories = await fetch("/api/admin/getcollection").then(
            (res) => res.json()
          );
          setCategories(updatedCategories);
        } else {
          toast.error("Failed to delete category. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Category Management</h1>
        <p className="text-green-100 mt-2">Organize your product categories</p>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Add Category Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300 shadow-md flex items-center mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Category
        </button>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 border border-green-100"
            >
              <div className="relative h-48">
                <Image
                  width={500}
                  height={500}
                  src={category.image?.url || "/placeholder-image.jpg"}
                  alt={category.image?.altText || category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent opacity-60"></div>
                <h2 className="text-xl font-bold text-white absolute bottom-4 left-4 drop-shadow-md">
                  {category.name}
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    ID: {category.categoryId || category._id.substring(0, 8)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {category.slug}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{category.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="px-4 py-2 bg-white text-red-600 border border-red-600 font-semibold rounded-md hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  {/* <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                  Edit
                </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-700">No categories found</h3>
            <p className="mt-2 text-gray-500">Add your first category to get started</p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden">
            {/* Desktop layout (horizontal) */}
            <div className="flex flex-col md:flex-row h-full">
              {/* Image preview section - hidden on mobile */}
              <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-green-600 to-green-800 p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Category Preview</h2>
                <div className="h-64 rounded-lg bg-white/10 backdrop-blur-sm shadow-lg overflow-hidden mb-4">
                  {newCategory.image?.url ? (
                    <Image
                      width={500}
                      height={500}
                      src={newCategory.image?.url}
                      alt={newCategory.image?.altText}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 rounded-md p-3 backdrop-blur-sm">
                    <p className="text-sm opacity-70">Name</p>
                    <p className="font-medium truncate">{newCategory.name || "Category Name"}</p>
                  </div>

                  <div className="bg-white/10 rounded-md p-3 backdrop-blur-sm">
                    <p className="text-sm opacity-70">ID</p>
                    <p className="font-medium truncate">{newCategory.categoryId || "category-id"}</p>
                  </div>

                  <div className="bg-white/10 rounded-md p-3 backdrop-blur-sm">
                    <p className="text-sm opacity-70">Description</p>
                    <p className="font-medium line-clamp-3">{newCategory.description || "Category description will appear here."}</p>
                  </div>
                </div>
              </div>

              {/* Form section */}
              <div className="w-full md:w-3/5 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddCategory} className="overflow-y-auto max-h-[75vh]">

                  {/* Image upload - visible on both mobile and desktop */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <CldUploadWidget
                      uploadPreset="elastica"
                      onSuccess={handleImageUpload}
                    >
                      {({ open }) => (
                        <div
                          onClick={() => open()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                        >
                          {newCategory.image?.url ? (
                            <div className="relative w-full md:hidden">
                              <Image
                                width={100}
                                height={100}
                                src={newCategory.image?.url}
                                alt={newCategory.image?.altText}
                                className="h-32 w-full object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-white font-medium">Change Image</p>
                              </div>
                            </div>
                          ) : null}

                          <div className={`flex flex-col items-center justify-center ${newCategory.image?.url ? 'md:flex hidden' : 'flex'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-green-600 font-medium mt-2">
                              {newCategory.image?.url ? 'Change Image' : 'Upload Image'}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              Click to browse files
                            </p>
                          </div>
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category ID
                        </label>
                        <input
                          type="text"
                          name="categoryId"
                          value={newCategory.categoryId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newCategory.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={newCategory.slug}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows="3"
                      />
                    </div>


                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-md hover:bg-gray-100 border border-gray-300 transition-colors w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 shadow-md transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
                    >
                      Add Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;