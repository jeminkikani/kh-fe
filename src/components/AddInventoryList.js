import React from "react";
import { Table, Button } from "react-bootstrap";

function AddInventoryList({ inventory, onEdit, onDelete }) {
  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Item</th>
          <th>Opening Stock</th>
          <th>Purchase Qty</th>
          <th>Purchase Price</th>
          <th>Closing Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item._id}>
            <td>{item.date?.slice(0, 10)}</td>
            <td>{item.item_name}</td>
            <td>{item.opening_stock}</td>
            <td>{item.purchase_qty}</td>
            <td>{item.purchase_price}</td>
            <td>{item.closing_stock}</td>
            <td>
              <Button variant="warning" size="sm" onClick={() => onEdit(item)}>
                Edit
              </Button>{" "}
              <Button variant="danger" size="sm" onClick={() => onDelete(item._id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AddInventoryList;
