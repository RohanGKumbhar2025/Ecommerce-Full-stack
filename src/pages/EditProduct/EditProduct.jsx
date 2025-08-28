// src/pages/EditProduct/EditProduct.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader2, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const EditProduct = () => {
    const [formData, setFormData] = useState(null); // Start with null until data is fetched
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true); // For initial data fetch
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { productId } = useParams(); // Get the product ID from the URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both categories and the specific product data in parallel
                const [categoriesResponse, productResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/categories`, getAuthHeaders()),
                    axios.get(`${API_BASE_URL}/api/products/${productId}`) // Public endpoint, no auth needed
                ]);
                
                setCategories(categoriesResponse.data);
                
                // Set the form data with the fetched product details
                const productData = productResponse.data;
                setFormData({
                    name: productData.name,
                    description: productData.description,
                    // The API returns categoryName, but we need the ID for the form
                    categoryId: categoriesResponse.data.find(c => c.name === productData.categoryName)?.id || '',
                    price: productData.price,
                    imageUrl: productData.imageUrl,
                    originalPrice: productData.originalPrice,
                    inStock: productData.inStock,
                    isNew: productData.isNew,
                    onSale: productData.onSale,
                });

            } catch (err) {
                toast.error('Failed to fetch product data.');
                console.error('Error fetching data:', err);
                setError('Could not load product information. It may have been deleted.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = getAuthHeaders();
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
                categoryId: parseInt(formData.categoryId, 10)
            };
            // Use a PUT request to update the product
            await axios.put(`${API_BASE_URL}/api/admin/products/${productId}`, payload, config);
            toast.success('Product updated successfully!');
            navigate('/admin/list');
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Failed to update product.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="text-center mt-8 text-lg"><Loader2 className="inline-block animate-spin mr-2" /> Loading product details...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-lg text-red-600 bg-red-50 p-6 rounded-lg">
                <AlertCircle className="inline-block mr-2" /> {error}
            </div>
        );
    }

    // This check is important to prevent rendering the form before data is ready
    if (!formData) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-6">
                    <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                    <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Category" name="categoryId" value={formData.categoryId} onChange={handleChange} options={categories} required />
                        <InputField label="Sale Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputField label="Original Price ($)" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder="Optional" />
                         <InputField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                    </div>
                </div>

                {/* Right Column: Image Preview & Toggles */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                        <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto" />
                                    <p className="mt-2 text-sm">Image will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                        <SwitchToggle label="In Stock" name="inStock" checked={formData.inStock} onChange={handleChange} />
                        <SwitchToggle label="Mark as New Arrival" name="isNew" checked={formData.isNew} onChange={handleChange} />
                        <SwitchToggle label="Mark as On Sale" name="onSale" checked={formData.onSale} onChange={handleChange} />
                    </div>
                </div>

                 {/* Action Buttons Full Width */}
                <div className="lg:col-span-3 flex justify-end gap-4 pt-6 border-t">
                    <button type="button" onClick={() => navigate('/admin/list')} className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 font-semibold flex items-center gap-2">
                        <X size={18} /> Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold flex items-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-400">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {loading ? 'Saving...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Reusable Form Field Components (copied from AddProduct.jsx for consistency) ---
const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select a category</option>
            {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
        </select>
    </div>
);

const SwitchToggle = ({ label, name, checked, onChange }) => (
    <label htmlFor={name} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50">
        <span className="font-medium text-gray-700">{label}</span>
        <div className="relative">
            <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="sr-only" />
            <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);

export default EditProduct;