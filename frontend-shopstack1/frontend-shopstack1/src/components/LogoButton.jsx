import React from 'react';
import logo from '../assets/react.svg';
import { CartIcon, HeartIcon } from './Icons';


const LogoButton = ({ text = 'ShopStack', icon, onClick, style = {}, ...props }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--ocean-breeze-primary)',
      color: 'var(--ocean-breeze-text-light)',
      border: 'none',
      borderRadius: 20,
      padding: '8px 20px',
      fontWeight: 700,
      fontSize: 18,
      boxShadow: 'var(--ocean-breeze-shadow)',
      cursor: 'pointer',
      ...style,
    }}
    {...props}
  >
    {icon === 'cart' ? <CartIcon size={28} color="var(--ocean-breeze-text-light)" />
      : icon === 'heart' ? <HeartIcon size={28} color="var(--ocean-breeze-text-light)" />
      : <img src={logo} alt="logo" style={{ height: 28, width: 28, marginRight: 6 }} />}
    <span>{text}</span>
  </button>
);

export default LogoButton;
