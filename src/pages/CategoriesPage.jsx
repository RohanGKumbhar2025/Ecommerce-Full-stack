import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Skeleton Component for Loading State ---
const CategoryCardSkeleton = () => (
    <div className="bg-gray-200 rounded-xl shadow-lg animate-pulse">
        <div className="aspect-video w-full bg-gray-300 rounded-t-xl"></div>
        <div className="p-6">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
    </div>
);

// --- Main CategoriesPage Component ---
const CategoriesPage = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // A map to assign placeholder images to categories for a richer UI
    const categoryImageMap = {
        'Electronics': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
        'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
        'Home and Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
        'Books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
        'Sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/categories`);
                // Add a default placeholder image if a category is not in our map
                const categoriesWithImages = response.data.map(cat => ({
                    ...cat,
                    imageUrl: categoryImageMap[cat.name] || `https://placehold.co/600x400/eee/666?text=${cat.name}`
                }));
                setCategories(categoriesWithImages);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // This handler now shows a toast notification before navigating
    const handleCategoryClick = (categoryId, categoryName) => {
        // Show immediate feedback to the user
        toast.info(`Loading products for ${categoryName}...`, {
            icon: <Loader2 className="animate-spin" />,
            autoClose: 2500, // Will disappear as the new page loads
        });

        if (typeof onCategorySelect === 'function') {
            onCategorySelect(categoryId);
        }
        navigate('/products');
    };

    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Explore Our Categories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find what you're looking for by browsing through our curated product categories.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, index) => <CategoryCardSkeleton key={index} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id, category.name)}
                                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative aspect-video">
                                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                                </div>
                                <div className="p-6 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h2>
                                    <ArrowRight className="text-gray-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;

