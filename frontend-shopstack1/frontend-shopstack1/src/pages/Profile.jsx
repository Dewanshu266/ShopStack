import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', mobileNo: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj);
      setForm({
        username: userObj.username || '',
        email: userObj.email || '',
        mobileNo: userObj.mobileNo || '',
      });
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update: ' + err.message);
    }
  };

  if (!isAuthenticated) return <div>Please login to view your profile.</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '32px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>My Profile</h2>
      {message && <div style={{ color: message.startsWith('Profile') ? 'green' : 'red', marginBottom: 12 }}>{message}</div>}
      {!editMode ? (
        <>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile No:</strong> {user.mobileNo}</p>
          <button onClick={() => setEditMode(true)} style={{ marginRight: 12 }}>Edit Profile</button>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <label>Username:<input name="username" value={form.username} onChange={handleChange} required /></label><br />
          <label>Email:<input name="email" value={form.email} onChange={handleChange} required /></label><br />
          <label>Mobile No:<input name="mobileNo" value={form.mobileNo} onChange={handleChange} required /></label><br />
          <button type="submit" style={{ marginRight: 12 }}>Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
