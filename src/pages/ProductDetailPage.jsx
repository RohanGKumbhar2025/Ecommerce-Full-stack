import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Skeleton component for loading state
const ProductDetailSkeleton = () => (
  <div className="bg-gray-50 py-12 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-6 w-32 bg-gray-300 rounded mb-6 animate-pulse"></div>
      <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex flex-col space-y-4">
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="flex space-x-4 mt-auto">
            <div className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-12 w-12 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error component for when product fails to load
const ProductDetailError = ({ onRetry, onGoBack }) => (
  <div className="bg-gray-50 py-12 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 font-semibold"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">
          We couldn't load this product. It might have been removed or there was a connection issue.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRetry}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Loader2 size={16} />
            Try Again
          </button>
          <button
            onClick={onGoBack}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailPage = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = new Set(),
  cart = [],
  pendingOperations = new Set(),
  pendingWishlistOperations = new Set(),
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, getProductDetails } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch product details
  const fetchProduct = async () => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const productData = await getProductDetails(id);

      if (productData && productData.id) {
        // Ensure all required fields have default values
        const processedProduct = {
          id: productData.id,
          name: productData.name || 'Unnamed Product',
          description: productData.description || 'No description available',
          price: typeof productData.price === 'number' ? productData.price : 0,
          originalPrice: typeof productData.originalPrice === 'number' ? productData.originalPrice : null,
          imageUrl: productData.imageUrl || '/placeholder-image.jpg',
          inStock: productData.inStock !== false,
          rating: typeof productData.rating === 'number' ? productData.rating : 0,
          reviews: typeof productData.reviews === 'number' ? productData.reviews : 0,
          onSale: productData.onSale === true,
          isNew: productData.isNew === true,
          categoryName: productData.category?.name || productData.categoryName || 'Uncategorized',
        };

        setProduct(processedProduct);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(true);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleRetry = () => {
    fetchProduct();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <ProductDetailError onRetry={handleRetry} onGoBack={handleGoBack} />;
  }

  const isWishlisted = wishlistIds.has(product.id);
  const isProductInCart = cart.some((item) => item.id === product.id);
  const isPendingCart = pendingOperations.has(product.id);
  const isPendingWishlist = pendingWishlistOperations.has(product.id);

  const handleAddToCartClick = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to cart');
      return;
    }
    if (isPendingCart) return;
    if (!product.inStock) {
      toast.error('This product is out of stock');
      return;
    }
    onAddToCart(product);
  };

  const handleToggleWishlistClick = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to manage your wishlist');
      return;
    }
    if (isPendingWishlist) return;
    onToggleWishlist(product.id, product);
  };

  // Calculate discount percentage if on sale
  const discountPercentage =
    product.onSale && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {/* Stock status overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-xl">
                <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
            {/* Sale badge */}
            {product.onSale && discountPercentage && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {discountPercentage}% OFF
              </div>
            )}
            {/* New badge */}
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                NEW
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div>
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {product.categoryName}
                </span>
                {product.rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star size={18} className="text-yellow-400 fill-current" />
                    <span className="text-md font-semibold">{product.rating.toFixed(1)}</span>
                    {product.reviews > 0 && (
                      <span className="text-sm text-gray-500">
                        ({product.reviews} review{product.reviews !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 my-4">{product.name}</h1>

              {/* Description */}
              <p className="text-gray-600 text-base mb-6 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                {product.onSale && product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    {discountPercentage && (
                      <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded font-semibold">
                        Save {discountPercentage}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-auto">
              <button
                onClick={handleAddToCartClick}
                disabled={!product.inStock || isProductInCart || isPendingCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                  !product.inStock
                    ? 'bg-gray-300 text-gray-500'
                    : isProductInCart
                    ? 'bg-green-600 text-white'
                    : isPendingCart
                    ? 'bg-indigo-400 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isPendingCart ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Adding...
                  </>
                ) : isProductInCart ? (
                  'Added to Cart'
                ) : !product.inStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button
                onClick={handleToggleWishlistClick}
                disabled={isPendingWishlist}
                className={`p-3 rounded-lg border-2 transition-colors disabled:opacity-50 ${
                  isWishlisted
                    ? 'bg-red-500 border-red-500 text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isPendingWishlist ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;