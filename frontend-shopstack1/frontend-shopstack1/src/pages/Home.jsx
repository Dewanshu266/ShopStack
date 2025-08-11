import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { fetchProducts, fetchProductsByCategory, fetchLowStockProducts } from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts()
      .then(data => {
        setProducts(data);
        setAllProducts(data);
        // Extract unique categories
        const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        setCategories(cats);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    fetchLowStockProducts()
      .then(setLowStock)
      .catch(() => {});
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    // Filter locally for instant UI
    if (value === '') {
      setProducts(allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setProducts(allProducts.filter(p => p.category && p.category.toLowerCase() === value.toLowerCase() && p.name.toLowerCase().includes(search.toLowerCase())));
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Filter by search and category
    if (category === '') {
      setProducts(allProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase())));
    } else {
      setProducts(allProducts.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase() && p.name.toLowerCase().includes(value.toLowerCase())));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ background: 'var(--ocean-breeze-bg)', minHeight: '100vh', padding: 0, width: '100vw' }}>
      <div style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        background: 'var(--ocean-breeze-card)',
        borderRadius: 18,
        padding: '40px 24px 32px 24px',
        marginTop: 80,
        boxShadow: 'var(--ocean-breeze-shadow)',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Shop Products</h2>
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <label>Category:
            <select value={category} onChange={handleCategoryChange} style={{ marginLeft: 8 }}>
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>Search:
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search product name..."
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
          ))}
        </div>
        <h3 style={{ marginTop: 40, textAlign: 'center' }}>Low Stock Products</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {lowStock.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
