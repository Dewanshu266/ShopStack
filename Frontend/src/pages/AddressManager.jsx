import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../services/extraApi';
import { useAuth } from '../context/AuthContext';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    fetchAddresses(token)
      .then(setAddresses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await addAddress(form, token);
    setForm({ street: '', city: '', state: '', zipCode: '', country: '' });
    const updated = await fetchAddresses(token);
    setAddresses(updated);
  };

  const handleEdit = address => {
    setEditId(address.id);
    setForm(address);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await updateAddress(editId, form, token);
    setEditId(null);
    setForm({ street: '', city: '', state: '', zipCode: '', country: '' });
    const updated = await fetchAddresses(token);
    setAddresses(updated);
  };

  const handleDelete = async id => {
    const token = localStorage.getItem('token');
    await deleteAddress(id, token);
    const updated = await fetchAddresses(token);
    setAddresses(updated);
  };

  if (!isAuthenticated) return <div>Please login to manage your addresses.</div>;
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Address Management</h2>
      <form onSubmit={editId ? handleUpdate : handleAdd} style={{ marginBottom: 24 }}>
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" required style={{ marginRight: 8 }} />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required style={{ marginRight: 8 }} />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required style={{ marginRight: 8 }} />
        <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" required style={{ marginRight: 8 }} />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required style={{ marginRight: 8 }} />
        <button type="submit">{editId ? 'Update Address' : 'Add Address'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ street: '', city: '', state: '', zipCode: '', country: '' }); }}>Cancel</button>}
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {addresses.map(address => (
          <div key={address.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, margin: 8, minWidth: 220 }}>
            <div><strong>{address.street}, {address.city}</strong></div>
            <div>{address.state}, {address.zipCode}</div>
            <div>{address.country}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleEdit(address)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => handleDelete(address.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManager;
