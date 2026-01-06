import { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'VEGETABLE', // default
        price: '',
        unit: 'kg',
        stockQuantity: '',
        imageUrl: '',
        harvestDate: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || 'VEGETABLE',
                price: product.price || '',
                unit: product.unit || 'kg',
                stockQuantity: product.stockQuantity || '',
                imageUrl: product.imageUrl || '',
                harvestDate: product.harvestDate || ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="mt-1">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                            <option value="VEGETABLE">Vegetables</option>
                            <option value="FRUIT">Fruits</option>
                            <option value="DAIRY">Dairy</option>
                            <option value="MEAT">Meat</option>
                            <option value="BAKERY">Bakery</option>
                            <option value="PANTRY">Pantry</option>
                            <option value="BEVERAGE">Beverage</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit (e.g. kg, bunch)</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="unit"
                            id="unit"
                            required
                            value={formData.unit}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="stockQuantity"
                            id="stockQuantity"
                            required
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">Harvest Date</label>
                    <div className="mt-1">
                        <input
                            type="date"
                            name="harvestDate"
                            id="harvestDate"
                            value={formData.harvestDate}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Save Product
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
