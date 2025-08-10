import React, { useState, useEffect } from "react";
import axios from "axios";
import AddInventoryForm from "./AddInventoryForm";
import AddInventoryList from "./AddInventoryList";

function AddInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/add-stock/get-stock`);
      setInventory(res.data.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addInventory = async (data) => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/add-stock/add-stock`, data);
    fetchInventory();
  };

  const updateInventory = async (id, data) => {
    await axios.put(`${process.env.REACT_APP_BASE_URL}/api/add-stock/update-stock/${id}`, data);
    setEditingItem(null);
    fetchInventory();
  };

  const deleteInventory = async (id) => {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/add-stock/delete-stock/${id}`);
    fetchInventory();
  };

  return (
    <>
      <h1 className="text-center mb-4">Add Inventory</h1>
      <AddInventoryForm
        onSubmit={editingItem ? (data) => updateInventory(editingItem._id, data) : addInventory}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
      <AddInventoryList
        inventory={inventory}
        onEdit={setEditingItem}
        onDelete={deleteInventory}
      />
    </>
  );
}

export default AddInventoryPage;
