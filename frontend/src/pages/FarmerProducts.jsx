import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProducts, addProduct, updateProduct, deleteProduct } from '../services/api';
import { useToast } from '../context/ToastContext';
import ProductForm from '../components/ProductForm';
import { Link, useNavigate } from 'react-router-dom';

const FarmerProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'FARMER') {
            navigate('/');
        } else {
            fetchProducts();
        }
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // We will modify getMyProducts to NOT require ID and use a new endpoint
            const data = await getMyProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
                showToast("Product deleted successfully");
            } catch (err) {
                showToast("Failed to delete product", "error");
            }
        }
    };

    const handleFormSubmit = async (formData, imageFile) => {
        try {
            if (isEditing) {
                const updated = await updateProduct(currentProduct.id, formData, imageFile);
                setProducts(products.map(p => p.id === updated.id ? updated : p));
                showToast("Product updated successfully!");
            } else {
                const newProduct = await addProduct(formData, imageFile);
                setProducts([...products, newProduct]);
                showToast("Product listed successfully!");
            }
            setShowForm(false);
        } catch (err) {
            console.error(err);
            showToast("Failed to save product", "error");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        My Products
                    </h2>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <Link to="/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                            &larr; Back to Dashboard
                        </Link>
                    </div>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={handleAddNew}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                    >
                        Add New Product
                    </button>
                </div>
            </div>

            {showForm ? (
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <ProductForm
                        product={currentProduct}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover rounded-md mb-4" />
                            )}
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            <p className="mt-2 text-sm text-gray-900">{product.description}</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-xl font-semibold text-gray-900">${product.price}</span>
                                <span className="ml-1 text-sm text-gray-500">/{product.unit}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Stock: {product.stockQuantity}</p>
                        </div>
                        <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3 bg-gray-50">
                            <button
                                onClick={() => handleEdit(product)}
                                className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900 font-medium text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !showForm && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found. Start by adding one!</p>
                </div>
            )}
        </div>
    );
};

export default FarmerProducts;
