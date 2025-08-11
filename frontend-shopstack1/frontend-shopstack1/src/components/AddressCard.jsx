import React from 'react';

const AddressCard = ({ address, onEdit, onDelete }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, margin: 8, minWidth: 220 }}>
    <div><strong>{address.street}, {address.city}</strong></div>
    <div>{address.state}, {address.zipCode}</div>
    <div>{address.country}</div>
    <div style={{ marginTop: 8 }}>
      <button onClick={onEdit} style={{ marginRight: 8 }}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  </div>
);

export default AddressCard;
