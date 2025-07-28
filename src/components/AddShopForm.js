// components/AddShopForm.js
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function AddShopForm({ onAdd }) {
  const [shop_name, setShopName] = useState('');
  const [contact_number, setContactNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shop_name) {
      alert("Shop name required"); return;
    }
    await onAdd({ shop_name, contact_number, address });
    setShopName('');
    setContactNumber('');
    setAddress('');
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              type="text"
              value={shop_name}
              onChange={e => setShopName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="number"
              value={contact_number}
              onChange={e => setContactNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="success" className="w-100">Add Shop</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddShopForm;
