import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { dbOperations } from '../../utils/db'
import { nanoid } from 'nanoid'

const Marketplace = () => {
  const { user } = useAuth()
  const { showNotification } = useNotifications()
  const [products, setProducts] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    contact: user?.phone || '',
    image: null
  })

  const categories = [
    { id: 'all', name: 'Semua', icon: '🏪' },
    { id: 'food', name: 'Makanan', icon: '🍜' },
    { id: 'craft', name: 'Kerajinan', icon: '🎨' },
    { id: 'service', name: 'Jasa', icon: '🔧' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'other', name: 'Lainnya', icon: '📦' }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const allProducts = await dbOperations.getAll('marketplace')
      setProducts(allProducts.filter(p => p.status === 'active').sort((a, b) => b.createdAt - a.createdAt))
    } catch (error) {
      console.error('Load products error:', error)
    }
  }

  const handleAddProduct = async () => {
    if (!productData.name || !productData.price) {
      showNotification('Please fill required fields', 'error')
      return
    }

    try {
      const product = {
        id: nanoid(),
        ...productData,
        sellerId: user.id,
        sellerName: user.name,
        price: parseFloat(productData.price),
        createdAt: Date.now(),
        status: 'active'
      }

      await dbOperations.add('marketplace', product)
      setProducts([product, ...products])
      setProductData({ name: '', description: '', price: '', category: 'food', contact: user?.phone || '', image: null })
      setShowAddProduct(false)
      showNotification('Product added successfully', 'success')
    } catch (error) {
      console.error('Add product error:', error)
      showNotification('Failed to add product', 'error')
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await dbOperations.put('marketplace', { id: productId, status: 'deleted' })
      setProducts(products.filter(p => p.id !== productId))
      showNotification('Product deleted', 'success')
    } catch (error) {
      console.error('Delete product error:', error)
      showNotification('Failed to delete product', 'error')
    }
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const getCategory = (catId) => {
    return categories.find(c => c.id === catId) || categories[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 animate-fade-in">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">🛒 MarketTaruna</h1>
          <p className="opacity-90">Local SME & Youth Services</p>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setShowAddProduct(true)}
          className="w-full glass-card rounded-2xl p-4 text-white font-medium text-lg hover:scale-105 transition-transform mb-6"
        >
          ➕ Jual Produk/Jasa
        </button>

        {/* Category Filter */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-orange-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-white text-center">
            <div className="text-6xl mb-4">🏪</div>
            <p className="opacity-80">Belum ada produk di kategori ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map(product => {
              const category = getCategory(product.category)
              return (
                <div key={product.id} className="glass-card rounded-2xl overflow-hidden text-white animate-scale-in">
                  {/* Product Image */}
                  <div className="h-40 bg-white/10 flex items-center justify-center text-6xl">
                    {category.icon}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-xs opacity-80">{category.name}</p>
                      </div>
                      {product.sellerId === user.id && (
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-300 hover:text-red-100"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm opacity-90 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-green-300">
                        Rp{product.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    
                    <div className="text-xs opacity-80 mb-3">
                      👤 {product.sellerName}
                    </div>
                    
                    <a
                      href={`https://wa.me/${product.contact.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-xl font-medium transition-colors"
                    >
                      💬 Contact Seller
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="glass-card rounded-3xl p-6 w-full max-w-md text-white animate-scale-in max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Tambah Produk/Jasa</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Nama Produk/Jasa *</label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="Contoh: Nasi Goreng Special"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Deskripsi</label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="Deskripsikan produk/jasa Anda"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Kategori *</label>
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id} className="text-gray-900">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Harga *</label>
                  <input
                    type="number"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Kontak (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={productData.contact}
                    onChange={(e) => setProductData({ ...productData, contact: e.target.value })}
                    className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60"
                    placeholder="08123456789"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-white/20 rounded-xl py-3 font-medium hover:bg-white/30 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-green-500 rounded-xl py-3 font-medium hover:bg-green-600 transition-colors"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
