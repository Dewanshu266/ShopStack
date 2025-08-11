import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2,136,209,0.10)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--ocean-breeze-card)', padding: 24, borderRadius: 12, minWidth: 300, position: 'relative', border: '1px solid var(--ocean-breeze-border)', boxShadow: 'var(--ocean-breeze-shadow)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'var(--ocean-breeze-accent)', border: 'none', color: 'var(--ocean-breeze-text-light)', fontSize: 20, cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, lineHeight: '32px' }}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
