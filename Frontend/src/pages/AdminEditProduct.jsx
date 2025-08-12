import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../services/productApi';
import { useAuth } from '../context/AuthContext.jsx';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchProductById(id)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, product, token, imageFile);
      navigate('/admin');
    } catch (err) {
      setError('Failed to update product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.toString()}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name:
          <input name="name" value={product.name || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={product.description || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price:
          <input name="price" type="number" value={product.price || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Stock:
          <input name="quantity" type="number" value={product.quantity || ''} onChange={handleChange} />
        </label>
        <br />
        <label>
          Product Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
