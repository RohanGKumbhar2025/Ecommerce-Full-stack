import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const ListProducts = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const config = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/admin/products`, config);
      setList(response.data);
    } catch (error) {
      toast.error("Error fetching the product list.");
      console.error("Error fetching product list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const config = getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/api/admin/products/${productToDelete.id}`, config);
      toast.success(`Product "${productToDelete.name}" deleted successfully!`);
      setList(list.filter(item => item.id !== productToDelete.id));
    } catch (error) {
      toast.error("Failed to delete the product.");
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-lg text-gray-500">Loading products...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product Catalog</h2>
          <p className="text-sm text-gray-500 mt-1">A list of all products in your store.</p>
        </div>
        <div className="flex items-center gap-2">
           <Link to="/admin/add" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            <PlusCircle size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

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
            {list.length > 0 ? list.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img className="h-12 w-12 rounded-lg object-cover" src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                {/* ✅ THE DEFINITIVE FIX #3: Use the flattened categoryName property from the DTO. */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoryName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   <Link to={`/admin/edit/${item.id}`} className="inline-block p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors" title="Edit Product">
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button onClick={() => confirmDelete(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Delete Product">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                  <h3 className="text-lg font-medium">No products found.</h3>
                  <p className="mt-1">Add a new product to get started!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Confirm Deletion</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete the product: <span className="font-bold">{productToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteDialogOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProducts;