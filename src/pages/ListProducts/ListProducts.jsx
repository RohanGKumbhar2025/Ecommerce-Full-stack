import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2, PlusCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- START: SKELETON COMPONENT ---
const ProductListSkeleton = () => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg"></div>
                                <div className="ml-4">
                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-5 bg-gray-200 rounded-full w-20"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
// --- END: SKELETON COMPONENT ---

const ListProducts = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const fetchProductList = useCallback(async (page) => {
        setLoading(true);
        try {
            const config = getAuthHeaders();
            const response = await axios.get(`${API_BASE_URL}/api/admin/products`, {
                ...config,
                params: { page, size: pageSize },
            });
            setList(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setCurrentPage(response.data.number);
        } catch (error) {
            toast.error("Error fetching the product list.");
            console.error("Error fetching product list:", error);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchProductList(currentPage);
    }, [fetchProductList, currentPage]);

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/products/${productToDelete.id}`, getAuthHeaders());
            toast.success(`Product "${productToDelete.name}" deleted successfully!`);
            if (list.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchProductList(currentPage);
            }
        } catch (error) {
            toast.error("Failed to delete the product.");
        } finally {
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
            setIsDeleting(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Catalog</h2>
                    <p className="text-sm text-gray-500 mt-1">A list of all products in your store.</p>
                </div>
                <Link to="/admin/add" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    <PlusCircle size={18} />
                    <span>Add Product</span>
                </Link>
            </div>

            {loading ? <ProductListSkeleton /> : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {list.length > 0 ? list.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12"><img className="h-12 w-12 rounded-lg object-cover" src={item.imageUrl || "/placeholder.png"} alt={item.name} /></div>
                                                <div className="ml-4"><div className="text-sm font-medium text-gray-900">{item.name}</div></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoryName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">${item.price?.toFixed(2) || '0.00'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link to={`/admin/edit/${item.id}`} className="inline-block p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"><Edit className="h-5 w-5" /></Link>
                                            <button onClick={() => confirmDelete(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="h-5 w-5" /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-500"><h3 className="text-lg font-medium">No products found.</h3></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-700">Showing <strong>{(currentPage * pageSize) + 1}</strong> to <strong>{Math.min((currentPage + 1) * pageSize, totalElements)}</strong> of <strong>{totalElements}</strong> results</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50"><ChevronLeft size={16} /> Previous</button>
                                <span className="text-sm hidden md:block">Page {currentPage + 1} of {totalPages}</span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50">Next <ChevronRight size={16} /></button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
                        <p className="mb-4 text-gray-600">Delete <span className="font-bold">{productToDelete?.name}</span>? This cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                                {isDeleting ? <Loader2 className="animate-spin" /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListProducts;