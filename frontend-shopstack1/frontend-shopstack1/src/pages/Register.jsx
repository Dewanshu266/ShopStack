import LogoButton from '../components/LogoButton';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'USER', mobileNo: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <LogoButton text="ShopStack" style={{ fontSize: 22, padding: '10px 28px' }} disabled />
      </div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', marginBottom: 12 }} required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ width: '100%', marginBottom: 12 }} required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" style={{ width: '100%', marginBottom: 12 }} required />
        <input name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="Mobile Number" style={{ width: '100%', marginBottom: 12 }} required />
        <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%', marginBottom: 12 }} required>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" style={{ width: '100%' }}>Register</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Register;
