import { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'VEGETABLE',
        price: '',
        unit: 'kg',
        stockQuantity: '',
        imageUrl: '',
        harvestDate: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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
            setPreviewUrl(product.imageUrl || null);
        }
    }, [product]);

    // Clean up preview URL memory
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                {/* Image Preview / Upload Section */}
                <div className="sm:col-span-6">
                    <label className="block text-sm font-bold text-earth-900 mb-2">Product Image</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand/30 transition-colors">
                        <div className="h-40 w-40 flex-shrink-0 relative rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-50 to-gray-100">
                                    📦
                                </div>
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <p className="text-xs text-earth-500 mb-3">
                                {imageFile ? `Selected: ${imageFile.name}` : "Upload a clear photo of your product. High-quality images attract more customers."}
                            </p>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 
                                    file:mr-4 file:py-2.5 file:px-4 
                                    file:rounded-xl file:border-0 
                                    file:text-sm file:font-bold 
                                    file:bg-brand file:text-white 
                                    hover:file:bg-brand-dark transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-bold text-earth-900 mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="e.g. Organic Red Gala Apples"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-bold text-earth-900 mb-2">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
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

                <div className="sm:col-span-3">
                    <label htmlFor="harvestDate" className="block text-sm font-bold text-earth-900 mb-2">Harvest / Pack Date</label>
                    <input
                        type="date"
                        name="harvestDate"
                        id="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                    />
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-bold text-earth-900 mb-2">Detailed Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Tell customers about the taste, quality, and how it was grown..."
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-bold text-earth-900 mb-2">Price ($)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-earth-400">
                            $
                        </div>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            className="block w-full pl-8 pr-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="unit" className="block text-sm font-bold text-earth-900 mb-2">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        id="unit"
                        required
                        placeholder="e.g. kg, lb, bunch"
                        value={formData.unit}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="stockQuantity" className="block text-sm font-bold text-earth-900 mb-2">Stock Available</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        id="stockQuantity"
                        required
                        placeholder="0"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-brand focus:border-brand sm:text-sm transition-shadow"
                    />
                </div>

            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-50">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-earth-500 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5"
                >
                    {product ? 'Update Product' : 'List Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
