import LogoButton from '../components/LogoButton';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <LogoButton text="ShopStack" style={{ fontSize: 22, padding: '10px 28px' }} disabled />
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', marginBottom: 12 }} required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" style={{ width: '100%', marginBottom: 12 }} required />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}>
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;
