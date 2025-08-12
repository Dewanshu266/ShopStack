import React, { useState } from 'react';
import { addProduct } from '../services/productApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await addProduct({
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      }, token, imageFile);
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Add New Product</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>Product added successfully!</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }} encType="multipart/form-data">
        <label>Name:<input name="name" value={form.name} onChange={handleChange} required /></label><br />
        <label>Description:<textarea name="description" value={form.description} onChange={handleChange} required /></label><br />
        <label>Price:<input name="price" type="number" value={form.price} onChange={handleChange} required /></label><br />
        <label>Stock:<input name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></label><br />
        <label>Image:<input name="image" type="file" accept="image/*" onChange={handleImageChange} required /></label><br />
        <label>Category:<input name="category" value={form.category} onChange={handleChange} required /></label><br />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
