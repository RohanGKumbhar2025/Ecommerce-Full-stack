// src/pages/CategoriesPage.js (Revised)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoriesPage = ({ onCategoryClick }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        onCategoryClick(categoryId);
        navigate('/products');
    };
    
    if (loading) {
        return <div className="text-center py-16">Loading categories...</div>;
    }

    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Categories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Browse through our wide range of product categories.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-8">
                    {categories.map(category => (
                        <button 
                            key={category.id} 
                            onClick={() => handleCategoryClick(category.id)}
                            className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer text-center transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <h2 className="text-lg font-semibold text-indigo-600">{category.name}</h2>
                            {/* Note: category.count is not available from the backend endpoint. You'd need to add this to the API or calculate it on the frontend. */}
                            <p className="text-gray-500 mt-1">{category.products.length} items</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;