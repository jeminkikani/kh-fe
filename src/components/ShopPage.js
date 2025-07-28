// ShopPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';
import AddShopForm from './AddShopForm';

function ShopPage() {
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchShops = async () => {
    const res = await axios.get('http://localhost:5000/api/shops/get-shops');
    setShops(res.data.data || res.data);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleAddShop = async (shop) => {
    await axios.post('http://localhost:5000/api/shops/add-shop', shop);
    fetchShops();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Shops</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>Add Shop</Button>
      </div>

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {shops.map(shop => (
            <tr key={shop._id}>
              <td>{shop.shop_name}</td>
              <td>{shop.contact_number}</td>
              <td>{shop.address}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Shop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddShopForm
            onAdd={handleAddShop}
            onClose={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ShopPage;
