import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import AddressCard from '../components/AddressCard';
import { fetchAddresses, addAddress, deleteAddress } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    fetchAddresses(token)
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      if (editId) {
        // Edit mode: update address
        const res = await fetch(`http://localhost:8080/api/addresses/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to update address');
        setMessage('Address updated successfully!');
      } else {
        // Add mode
        await addAddress(form, token);
        setMessage('Address added successfully!');
      }
      setForm({ street: '', city: '', state: '', zipCode: '', country: '' });
      setEditId(null);
      const updatedAddresses = await fetchAddresses(token);
      setAddresses(updatedAddresses);
    } catch (err) {
      setMessage('Failed to save address: ' + (err?.message || err));
    }
  };

  const handleDelete = async (addressId) => {
    const token = localStorage.getItem('token');
    setMessage('');
    try {
      await deleteAddress(addressId, token);
      const updatedAddresses = await fetchAddresses(token);
      setAddresses(updatedAddresses);
      setMessage('Address deleted successfully!');
    } catch (err) {
      setMessage('Failed to delete address: ' + (err?.message || err));
    }
  };

  const handleEdit = (address) => {
    setEditId(address.id);
    setForm({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || '',
    });
    setMessage('');
  };

  if (!isAuthenticated) return <div>Please login to manage your addresses.</div>;
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Addresses</h2>
  {message && <div style={{ color: message.startsWith('Address') ? 'green' : 'red', marginBottom: 12 }}>{message}</div>}
  <form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" required style={{ marginRight: 8 }} />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required style={{ marginRight: 8 }} />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required style={{ marginRight: 8 }} />
        <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" required style={{ marginRight: 8 }} />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required style={{ marginRight: 8 }} />
  <button type="submit">{editId ? 'Save Changes' : 'Add Address'}</button>
  {editId && <button type="button" onClick={() => { setEditId(null); setForm({ street: '', city: '', state: '', zipCode: '', country: '' }); setMessage(''); }}>Cancel</button>}
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {addresses.map(address => (
          <AddressCard key={address.id} address={address} onEdit={() => handleEdit(address)} onDelete={() => handleDelete(address.id)} />
        ))}
      </div>
    </div>
  );
};

export default Addresses;
